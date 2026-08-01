import { supabase } from '../lib/supabase';
import { FALLBACK_STATIONS, formatPower, type ChargingStation } from './stations';

export type BookingStatus = 'pending' | 'pending_payment' | 'confirmed' | 'charging' | 'cancelled' | 'completed';
export type PaymentMethod = 'pay_at_station' | 'vnpay' | 'momo';

export interface WebBooking {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress: string;
  stationImage: string;
  date: string;
  time: string;
  connector: string;
  powerKw: number;
  powerLabel: string;
  totalPrice: number;
  estimatedTotal: number;
  status: BookingStatus;
  paymentStatus: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
}

type BookingRow = Record<string, unknown> & {
  charging_stations?: { place_id?: string; name?: string } | null;
  charging_slots?: { connector_type?: string; power_kw?: number } | null;
};

function normalizeBooking(row: BookingRow): WebBooking {
  const startTime = new Date(String(row.start_time));
  const duration = Number(row.duration_minutes || 60);
  const endTime = new Date(startTime.getTime() + duration * 60000);
  const placeId = String(row.charging_stations?.place_id || '');
  const station = FALLBACK_STATIONS.find(item => item.id === placeId);
  const powerKw = Number(row.charging_slots?.power_kw || station?.powerKw || 0);
  return {
    id: String(row.id),
    stationId: placeId,
    stationName: String(row.charging_stations?.name || station?.name || 'Trạm sạc SCSGO'),
    stationAddress: station ? `${station.address}, ${station.district}` : 'Địa chỉ đang cập nhật',
    stationImage: station?.image || '/stations/demo-mall-garage.png',
    date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' }).format(startTime),
    time: `${new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' }).format(startTime)} - ${new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Ho_Chi_Minh' }).format(endTime)}`,
    connector: String(row.connector_type || row.charging_slots?.connector_type || station?.connector || 'Đầu sạc tiêu chuẩn'),
    powerKw,
    powerLabel: station ? formatPower({ ...station, powerKw }) : `${powerKw} kW`,
    totalPrice: Number(row.total_price || 0),
    estimatedTotal: Number(row.estimated_total || row.total_price || 0),
    status: String(row.status || 'pending') as BookingStatus,
    paymentStatus: String(row.payment_status || 'unpaid') as WebBooking['paymentStatus'],
    paymentMethod: String(row.payment_method || 'pay_at_station') as PaymentMethod,
  };
}

export async function loadBookings(): Promise<WebBooking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, charging_stations(place_id, name), charging_slots(connector_type, power_kw)')
    .order('start_time', { ascending: false });
  if (error) throw error;
  return (data || []).map(row => normalizeBooking(row as BookingRow));
}

export async function createBooking(
  station: ChargingStation,
  connector: string,
  date: string,
  time: string,
  estimatedEnergyKwh: number,
  paymentMethod: PaymentMethod,
) {
  const { data: stationRow, error: stationError } = await supabase
    .from('charging_stations')
    .select('id, charging_slots(id, status, connector_type)')
    .eq('place_id', station.id)
    .maybeSingle();
  if (stationError) throw stationError;

  const row = stationRow as { id?: string; charging_slots?: Array<{ id: string; status: string; connector_type?: string }> } | null;
  const slot = row?.charging_slots?.find(item => item.status === 'available' && (!item.connector_type || item.connector_type === connector))
    || row?.charging_slots?.find(item => item.status === 'available');
  if (!row?.id || !slot) throw new Error('Không còn cổng sạc phù hợp tại trạm này.');

  const startTime = new Date(`${date}T${time.slice(0, 5)}:00+07:00`);
  if (startTime.getTime() <= Date.now()) throw new Error('Vui lòng chọn khung giờ trong tương lai.');

  const { data, error } = await supabase.rpc('create_booking', {
    p_station_id: row.id,
    p_slot_id: slot.id,
    p_start_time: startTime.toISOString(),
    p_duration_minutes: 60,
    p_connector_type: connector,
    p_estimated_energy_kwh: estimatedEnergyKwh,
    p_payment_method: paymentMethod,
    p_idempotency_key: crypto.randomUUID(),
  });
  if (error) {
    const message = error.message.includes('slot_already_booked')
      ? 'Khung giờ này vừa được người khác đặt. Vui lòng chọn giờ khác.'
      : error.message.includes('start_time_must_be_in_future')
        ? 'Vui lòng chọn khung giờ trong tương lai.'
        : error.message;
    throw new Error(message);
  }
  window.dispatchEvent(new Event('scsgo-bookings-updated'));
  return data as Record<string, unknown>;
}

export async function cancelBooking(id: string, reason = 'Người dùng chủ động hủy') {
  const { error } = await supabase.rpc('cancel_booking', { p_booking_id: id, p_reason: reason });
  if (error) throw new Error(error.message.includes('booking_cannot_be_cancelled')
    ? 'Lịch chỉ được hủy trước giờ sạc ít nhất 60 phút.'
    : error.message);
  window.dispatchEvent(new Event('scsgo-bookings-updated'));
}
