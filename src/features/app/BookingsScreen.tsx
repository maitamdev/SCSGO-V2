import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Gauge, MapPin, Plus, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cancelBooking, loadBookings, type WebBooking } from '../../data/bookings';
import { formatCurrency } from '../../data/stations';

export default function BookingsScreen() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<WebBooking[]>([]);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const refresh = async () => {
      try {
        setBookings(await loadBookings());
        setError('');
      } catch {
        setError('Chưa thể tải lịch đặt chỗ. Vui lòng thử lại.');
      } finally {
        setIsLoading(false);
      }
    };
    void refresh();
    window.addEventListener('scsgo-bookings-updated', refresh);
    return () => window.removeEventListener('scsgo-bookings-updated', refresh);
  }, []);

  const visible = bookings.filter(item => activeTab === 'upcoming'
    ? ['pending', 'pending_payment', 'confirmed', 'charging'].includes(item.status)
    : ['cancelled', 'completed'].includes(item.status));

  const handleCancel = async (id: string) => {
    try {
      await cancelBooking(id);
      setBookings(await loadBookings());
      setError('');
    } catch (cancelError) {
      setError(cancelError instanceof Error ? cancelError.message : 'Chưa thể hủy lịch.');
    }
  };

  return (
    <div className="app-page">
      <header className="page-heading">
        <div><h1>Lịch đặt chỗ</h1><p>Quản lý các phiên sạc sắp tới và lịch sử của bạn.</p></div>
        <button className="primary-button" type="button" onClick={() => navigate('/app/map')}><Plus size={16} /> Đặt lịch mới</button>
      </header>
      <div className="tabs">
        <button className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('upcoming')}>Sắp tới</button>
        <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} type="button" onClick={() => setActiveTab('history')}>Lịch sử</button>
      </div>

      <div className="bookings-layout">
        <section>
          {error && <div className="auth-alert error" role="alert">{error}</div>}
          {isLoading ? (
            <div className="surface-panel empty-state"><div className="skeleton" style={{ width: 220, height: 12 }} /></div>
          ) : visible.length === 0 ? (
            <div className="surface-panel empty-state">
              <div className="empty-state-icon"><CalendarDays size={27} /></div>
              <h2>{activeTab === 'upcoming' ? 'Chưa có lịch sạc sắp tới' : 'Chưa có lịch sử sạc'}</h2>
              <p>Chọn một trạm gần bạn và đặt trước khung giờ phù hợp để không phải chờ đợi.</p>
              {activeTab === 'upcoming' && <button className="primary-button" type="button" onClick={() => navigate('/app/map')}>Tìm trạm sạc</button>}
            </div>
          ) : (
            <div className="booking-list">
              {visible.map(booking => {
                const date = new Date(`${booking.date}T12:00:00`);
                return (
                  <article className="surface-panel booking-card" key={booking.id}>
                    <div className="booking-card-date"><strong>{date.getDate().toString().padStart(2, '0')}</strong><span>Tháng {date.getMonth() + 1}</span></div>
                    <div className="booking-card-content">
                      <span className={`status-badge ${['confirmed', 'charging'].includes(booking.status) ? 'available' : booking.status === 'cancelled' ? 'offline' : 'busy'}`}>{booking.status === 'confirmed' ? 'Đã xác nhận' : booking.status === 'pending_payment' ? 'Chờ thanh toán' : booking.status === 'pending' ? 'Đang giữ chỗ' : booking.status === 'charging' ? 'Đang sạc' : booking.status === 'cancelled' ? 'Đã hủy' : 'Hoàn thành'}</span>
                      <h3>{booking.stationName}</h3>
                      <p><MapPin size={12} /> {booking.stationAddress}</p>
                      <div className="booking-card-meta">
                        <span><Clock3 size={13} /> {booking.time}</span>
                        <span><Zap size={13} /> {booking.connector}</span>
                        <span><Gauge size={13} /> {booking.powerLabel || `${booking.powerKw} kW`}</span>
                      </div>
                    </div>
                    <div className="booking-card-actions">
                      <button className="secondary-button" type="button" onClick={() => navigate(`/app/stations/${booking.stationId}`)}>Xem chi tiết</button>
                      {['pending', 'pending_payment', 'confirmed'].includes(booking.status) && <button className="danger-button" type="button" onClick={() => void handleCancel(booking.id)}>Hủy lịch</button>}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
        <aside className="surface-panel booking-summary">
          <h2>Tổng quan sạc</h2>
          <div className="summary-stat"><span>Lịch đang hoạt động</span><strong>{bookings.filter(item => ['pending', 'pending_payment', 'confirmed', 'charging'].includes(item.status)).length}</strong></div>
          <div className="summary-stat"><span>Điện năng ước tính</span><strong>{(bookings.length * 35).toFixed(1)} kWh</strong></div>
          <div className="summary-stat"><span>Tổng chi phí</span><strong>{formatCurrency(bookings.reduce((sum, item) => sum + item.totalPrice, 0))}</strong></div>
          <button className="secondary-button button-wide" type="button" style={{ marginTop: 16 }} onClick={() => navigate('/app/map')}><Zap size={15} /> Tìm trạm khác</button>
        </aside>
      </div>
    </div>
  );
}
