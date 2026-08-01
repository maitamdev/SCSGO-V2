import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, Banknote, CalendarDays, RefreshCw, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { formatCurrency } from '../../data/stations';
import { supabase } from '../../lib/supabase';

interface AdminStation {
  id: string;
  name: string;
  status: 'active' | 'offline' | 'maintenance' | 'suspended';
  total_slots: number;
  last_heartbeat_at: string | null;
  charging_slots?: Array<{ id: string; status: string }>;
}

interface AdminBooking {
  id: string;
  start_time: string;
  status: string;
  payment_status?: string;
  total_price?: number;
  charging_stations?: { name?: string } | null;
}

export default function AdminScreen() {
  const { profile } = useAuth();
  const profileRecord = profile as Record<string, string> | null;
  const role = profileRecord?.role || 'driver';
  const canManage = ['admin', 'operator', 'support', 'finance'].includes(role);
  const canEditStations = ['admin', 'operator'].includes(role);
  const [stations, setStations] = useState<AdminStation[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [paidRevenue, setPaidRevenue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!canManage) return;
    setIsLoading(true);
    const [stationResult, bookingResult, paymentResult] = await Promise.all([
      supabase.from('charging_stations').select('id,name,status,total_slots,last_heartbeat_at,charging_slots(id,status)').order('name'),
      supabase.from('bookings').select('id,start_time,status,payment_status,total_price,charging_stations(name)').order('start_time', { ascending: false }).limit(50),
      supabase.from('payment_transactions').select('amount,status').eq('status', 'paid'),
    ]);
    const firstError = stationResult.error || bookingResult.error || paymentResult.error;
    if (firstError) setError(firstError.message);
    else {
      setStations((stationResult.data || []) as AdminStation[]);
      setBookings((bookingResult.data || []) as AdminBooking[]);
      setPaidRevenue((paymentResult.data || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0));
      setError('');
    }
    setIsLoading(false);
  }, [canManage]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadDashboard(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadDashboard]);

  const updateStationStatus = async (stationId: string, status: AdminStation['status']) => {
    const previous = stations;
    setStations(current => current.map(station => station.id === stationId ? { ...station, status } : station));
    const { error: updateError } = await supabase.from('charging_stations').update({ status }).eq('id', stationId);
    if (updateError) {
      setStations(previous);
      setError(updateError.message);
    }
  };

  const metrics = useMemo(() => ({
    onlineStations: stations.filter(station => station.status === 'active').length,
    availableSlots: stations.flatMap(station => station.charging_slots || []).filter(slot => slot.status === 'available').length,
    upcomingBookings: bookings.filter(booking => ['pending', 'pending_payment', 'confirmed', 'charging'].includes(booking.status)).length,
  }), [bookings, stations]);

  if (!canManage) {
    return <div className="app-page"><section className="surface-panel empty-state"><div className="empty-state-icon"><ShieldAlert size={28} /></div><h2>Không có quyền truy cập</h2><p>Tài khoản của bạn chưa được gán vào vai trò quản trị hoặc đơn vị vận hành trạm.</p></section></div>;
  }

  return (
    <div className="app-page">
      <header className="page-heading"><div><h1>Trung tâm vận hành</h1><p>Theo dõi trạm, cổng sạc, lịch đặt và doanh thu thực tế.</p></div><button className="secondary-button" type="button" onClick={() => void loadDashboard()}><RefreshCw size={15} /> Làm mới</button></header>
      {error && <div className="auth-alert error" role="alert">{error}</div>}
      <div className="admin-metrics">
        <article className="surface-panel admin-metric"><Activity size={20} /><span>Trạm hoạt động</span><strong>{isLoading ? '…' : `${metrics.onlineStations}/${stations.length}`}</strong></article>
        <article className="surface-panel admin-metric"><Zap size={20} /><span>Cổng đang trống</span><strong>{isLoading ? '…' : metrics.availableSlots}</strong></article>
        <article className="surface-panel admin-metric"><CalendarDays size={20} /><span>Lịch đang hoạt động</span><strong>{isLoading ? '…' : metrics.upcomingBookings}</strong></article>
        <article className="surface-panel admin-metric"><Banknote size={20} /><span>Doanh thu đã thu</span><strong>{isLoading ? '…' : formatCurrency(paidRevenue)}</strong></article>
      </div>

      <div className="admin-grid">
        <section className="surface-panel admin-table-panel">
          <div className="section-heading"><h2>Trạng thái trạm</h2><span>{stations.length} trạm</span></div>
          <div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>Trạm</th><th>Cổng trống</th><th>Heartbeat</th><th>Trạng thái</th></tr></thead><tbody>{stations.map(station => <tr key={station.id}><td><strong>{station.name}</strong></td><td>{(station.charging_slots || []).filter(slot => slot.status === 'available').length}/{station.total_slots}</td><td>{station.last_heartbeat_at ? new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(station.last_heartbeat_at)) : 'Chưa kết nối'}</td><td><select value={station.status} disabled={!canEditStations} onChange={event => void updateStationStatus(station.id, event.target.value as AdminStation['status'])}><option value="active">Hoạt động</option><option value="offline">Ngoại tuyến</option><option value="maintenance">Bảo trì</option><option value="suspended">Tạm khóa</option></select></td></tr>)}</tbody></table></div>
        </section>

        <section className="surface-panel admin-table-panel">
          <div className="section-heading"><h2>Lịch đặt gần đây</h2><span>{bookings.length} giao dịch</span></div>
          <div className="admin-booking-list">{bookings.slice(0, 12).map(booking => <article key={booking.id}><div><strong>{booking.charging_stations?.name || 'Trạm sạc'}</strong><span>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(booking.start_time))}</span></div><div><span className={`status-badge ${booking.status === 'confirmed' ? 'available' : booking.status === 'cancelled' ? 'offline' : 'busy'}`}>{booking.status}</span><small>{formatCurrency(Number(booking.total_price || 0))}</small></div></article>)}</div>
        </section>
      </div>
    </div>
  );
}
