import { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Bike,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Coffee,
  MapPin,
  Navigation,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { createBooking, type PaymentMethod } from '../../data/bookings';
import { FALLBACK_STATIONS, formatCurrency, getDirectionsUrl } from '../../data/stations';
import { useStations } from '../../hooks/useStations';
import { supabase } from '../../lib/supabase';

const TIME_SLOTS = ['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '12:00 - 13:00', '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00'];
const DATE_OPTIONS = Array.from({ length: 5 }, (_, index) => {
  const date = new Date();
  date.setDate(date.getDate() + index);
  return {
    iso: date.toISOString().slice(0, 10),
    day: new Intl.DateTimeFormat('vi-VN', { weekday: 'short' }).format(date),
    label: new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit' }).format(date),
  };
});

export default function StationDetailScreen() {
  const { stationId } = useParams();
  const { stations, isLoading } = useStations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const demoDataEnabled = import.meta.env.VITE_ENABLE_DEMO_DATA !== 'false';
  const station = stations.find(item => item.id === stationId)
    || (demoDataEnabled ? FALLBACK_STATIONS.find(item => item.id === stationId) : undefined);
  const [connectorIndex, setConnectorIndex] = useState(0);
  const [date, setDate] = useState(DATE_OPTIONS[0].iso);
  const [time, setTime] = useState('12:00 - 13:00');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay_at_station');
  const [bookingError, setBookingError] = useState('');
  const isMotorbikeStation = station?.vehicleType === 'motorbike';
  const estimatedEnergy = isMotorbikeStation ? 1.5 : 35;
  const chargePrice = station?.pricingMode === 'flat'
    ? station.flatFee || 0
    : (station?.pricePerKwh || 0) * estimatedEnergy;
  const serviceFee = station?.pricingMode === 'flat' ? 0 : 10000;
  const totalPrice = useMemo(() => chargePrice + serviceFee, [chargePrice, serviceFee]);
  const connectorOptions = isMotorbikeStation
    ? Array.from(new Set([station?.connector || 'Ổ cắm 220V', 'Sạc nhanh 1800W']))
    : Array.from(new Set([station?.connector || 'CCS2', 'CCS2', 'Type 2']));
  const selectedConnector = connectorOptions[connectorIndex] || connectorOptions[0];

  const confirmBooking = async () => {
    if (!station) return;
    setIsSubmitting(true);
    setBookingError('');
    try {
      if (!user) throw new Error('Bạn cần đăng nhập để đặt chỗ.');
      const booking = await createBooking(station, selectedConnector, date, time, estimatedEnergy, paymentMethod);
      if (paymentMethod === 'vnpay' && Number(booking.total_price || 0) > 0) {
        const { data, error } = await supabase.functions.invoke('vnpay-create', {
          body: { bookingId: booking.id, returnUrl: `${window.location.origin}/app/bookings` },
        });
        if (error || !data?.paymentUrl) throw new Error('Cổng VNPay chưa được cấu hình. Lịch vẫn được giữ trong mục Lịch đặt chỗ.');
        window.location.assign(data.paymentUrl);
        return;
      }
      setIsConfirmed(true);
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Chưa thể đặt chỗ. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !station) return <div className="app-page"><section className="surface-panel skeleton" style={{ minHeight: 520 }} /></div>;
  if (!station) return <div className="app-page"><section className="surface-panel empty-state"><h2>Không tìm thấy trạm sạc</h2><p>Trạm có thể đã tạm ngưng hoặc đường dẫn không còn hợp lệ.</p><button className="primary-button" type="button" onClick={() => navigate('/app/map')}>Quay lại bản đồ</button></section></div>;

  if (isConfirmed) {
    return (
      <div className="app-page">
        <section className="surface-panel booking-success">
          <div className="success-icon"><Check size={31} strokeWidth={2.2} /></div>
          <h2>Đặt chỗ thành công</h2>
          <p>Lịch sạc tại {station.name} đã được xác nhận. Bạn có thể xem lại hoặc hủy lịch trong mục Lịch đặt chỗ.</p>
          <div className="page-actions">
            <button className="secondary-button" type="button" onClick={() => navigate('/app/map')}>Tiếp tục tìm trạm</button>
            <button className="primary-button" type="button" onClick={() => navigate('/app/bookings')}><CalendarCheck size={16} /> Xem lịch đặt chỗ</button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="app-page">
      <div className="station-detail-grid">
        <section className="surface-panel station-hero">
          <img src={station.image} className="station-hero-image" alt={`Không gian tại ${station.name}`} />
          <div className="station-info">
            <div className="station-title-row">
              <div>
                <span className={`status-badge ${station.status}`}>{station.availableSlots}/{station.totalSlots} cổng trống</span>
                <h1>{station.name}</h1>
              </div>
              <span className="station-title-rating"><Star size={18} fill="currentColor" /> {station.rating} <small>({station.reviewCount} đánh giá)</small></span>
            </div>
            <p className="station-detail-address"><MapPin size={16} /> {station.address}, {station.district} <a className="text-button" href={getDirectionsUrl(station)} target="_blank" rel="noreferrer"><Navigation size={13} /> Chỉ đường</a></p>
            <div className="station-facts">
              <span><Clock3 size={15} /> {station.openHours}</span>
              <span><ShieldCheck size={15} /> {station.amenities[0]}</span>
              <span><Camera size={15} /> {station.amenities[1]}</span>
              <span><Coffee size={15} /> {station.amenities[2]}</span>
            </div>
            <p className="station-description">{station.description}</p>
            <p className="station-source">Nguồn địa điểm: {station.sourceLabel}. {demoDataEnabled ? 'Chế độ demo có thể dùng dữ liệu dự phòng khi Supabase gián đoạn.' : 'Trạng thái cổng và biểu giá được đồng bộ từ hệ thống vận hành.'}</p>
            <div className="section-heading"><h2>Đầu sạc khả dụng</h2></div>
            <div className="connector-grid">
              {connectorOptions.map((item, index) => (
                <button key={`${item}-${index}`} type="button" className={`connector-option ${connectorIndex === index ? 'selected' : ''}`} onClick={() => setConnectorIndex(index)}>
                  <Zap size={20} color="var(--app-primary)" />
                  <strong>{item}</strong>
                  <span>{isMotorbikeStation ? `${Math.max(1000, Math.round(station.powerKw * 1000 - index * 400))} W` : `${Math.max(11, station.powerKw - index * 30)} kW`}</span>
                  <small>Còn trống {Math.max(1, station.availableSlots - index)}/{Math.max(2, station.totalSlots - index * 2)}</small>
                </button>
              ))}
            </div>
          </div>
        </section>

        <aside className="surface-panel booking-panel">
          <h2>Đặt lịch sạc</h2>
          <div className="booking-step">
            <span className="booking-step-title">Chọn ngày</span>
            <div className="date-strip">
              {DATE_OPTIONS.map(option => <button type="button" key={option.iso} className={`date-option ${date === option.iso ? 'selected' : ''}`} onClick={() => setDate(option.iso)}>{option.day}<strong>{option.label}</strong></button>)}
            </div>
          </div>
          <div className="booking-step">
            <span className="booking-step-title">Phương thức thanh toán</span>
            <div className="payment-choice-grid">
              <button type="button" className={`payment-choice ${paymentMethod === 'pay_at_station' ? 'selected' : ''}`} onClick={() => setPaymentMethod('pay_at_station')}><strong>Thanh toán tại trạm</strong><small>Thanh toán sau khi sạc</small></button>
              <button type="button" className={`payment-choice ${paymentMethod === 'vnpay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('vnpay')}><strong>VNPay</strong><small>Giữ chỗ trực tuyến</small></button>
            </div>
          </div>
          <div className="booking-step">
            <span className="booking-step-title">Chọn khung giờ</span>
            <div className="time-grid">
              {TIME_SLOTS.map(slot => <button type="button" key={slot} className={`time-option ${time === slot ? 'selected' : ''}`} onClick={() => setTime(slot)}>{slot}</button>)}
            </div>
          </div>
          <div className="booking-step">
            <span className="booking-step-title">Xe của bạn</span>
            <button className="vehicle-select" type="button">
              {isMotorbikeStation ? <span className="vehicle-type-icon"><Bike size={24} /></span> : <img src="/ev_car.png" alt="VinFast VF 8" />}
              <span><strong>{isMotorbikeStation ? 'Xe máy điện của bạn' : 'VinFast VF 8 Plus'}</strong><small>{isMotorbikeStation ? '59-MĐ1 123.45' : '51K-123.45'}</small></span>
              <ChevronDown size={15} />
            </button>
          </div>
          <div className="price-summary">
            <div className="price-row"><span>{station.pricingMode === 'flat' ? 'Phí sạc theo lượt' : `Phí sạc dự kiến (${estimatedEnergy} kWh)`}</span><span>{chargePrice ? formatCurrency(chargePrice) : 'Miễn phí'}</span></div>
            <div className="price-row"><span>Phí đặt chỗ</span><span>{serviceFee ? formatCurrency(serviceFee) : 'Miễn phí'}</span></div>
            <div className="price-row total"><span>Tổng cộng</span><strong>{formatCurrency(totalPrice)}</strong></div>
          </div>
          <button className="primary-button button-wide" type="button" disabled={isSubmitting} onClick={() => void confirmBooking()}>
            {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận đặt chỗ'}
          </button>
          {bookingError && <p className="booking-error" role="alert">{bookingError}</p>}
          <p className="booking-note"><ShieldCheck size={14} /> Bạn có thể hủy miễn phí trước giờ sạc 60 phút.</p>
        </aside>
      </div>
    </div>
  );
}
