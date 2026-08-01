import { useCallback, useEffect, useState } from 'react';
import { CalendarDays, ChevronRight, Filter, LocateFixed, MapPin, Route, Zap } from 'lucide-react';
import { useNavigate } from 'react-router';
import AppMap from '../../components/AppMap';
import StationCard from '../../components/StationCard';
import { useAuth } from '../../contexts/AuthContext';
import { loadBookings, type WebBooking } from '../../data/bookings';
import { getDirectionsUrl, type ChargingStation } from '../../data/stations';
import { useStations } from '../../hooks/useStations';
import { supabase } from '../../lib/supabase';
import './AppScreens.css';

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { stations, isLoading } = useStations();
  const [selected, setSelected] = useState<ChargingStation | null>(null);
  const [toast, setToast] = useState('');
  const [upcomingBooking, setUpcomingBooking] = useState<WebBooking | null>(null);
  const profileRecord = profile as Record<string, string> | null;
  const displayName = profileRecord?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'bạn';

  const handleSelect = useCallback((station: ChargingStation) => setSelected(station), []);
  const handleOpenDetails = useCallback((station: ChargingStation) => {
    navigate(`/app/stations/${station.id}`);
  }, [navigate]);

  useEffect(() => {
    const refresh = async () => {
      try {
        const bookings = await loadBookings();
        setUpcomingBooking(bookings.find(item => item.status === 'confirmed') || null);
      } catch {
        setUpcomingBooking(null);
      }
    };
    void refresh();
    window.addEventListener('scsgo-bookings-updated', refresh);
    return () => window.removeEventListener('scsgo-bookings-updated', refresh);
  }, []);

  const saveStation = async (station: ChargingStation) => {
    if (!user) return;
    const { error } = await supabase.from('favorites').upsert({
      user_id: user.id,
      place_id: station.id,
      place_data: station,
    }, { onConflict: 'user_id,place_id' });
    setToast(error ? 'Chưa thể lưu trạm. Vui lòng thử lại.' : `Đã lưu ${station.name}`);
    window.setTimeout(() => setToast(''), 2600);
  };

  const nearby = stations.slice(0, 4);

  return (
    <div className="app-page">
      <header className="page-heading">
        <div>
          <h1>Chào buổi sáng, {displayName}</h1>
          <p>Tìm điểm sạc phù hợp và tiếp tục hành trình của bạn.</p>
        </div>
        <div className="page-actions">
          <button className="secondary-button" type="button" onClick={() => navigate('/app/map')}><MapPin size={16} /> Xem bản đồ</button>
          <button className="primary-button" type="button" onClick={() => navigate('/app/map')}><Zap size={16} /> Tìm trạm sạc</button>
        </div>
      </header>

      <div className="dashboard-grid">
        <div className="dashboard-left">
          <section className="surface-panel station-list-panel">
            <div className="section-heading">
              <div><h2>Trạm gần bạn</h2><p>{stations.length} trạm trong khu vực</p></div>
              <button className="text-button" type="button" onClick={() => navigate('/app/map')}>Xem tất cả</button>
            </div>
            <div className="station-stack">
              {isLoading ? [1, 2, 3].map(item => <div key={item} className="station-card compact skeleton" style={{ minHeight: 96 }} />) : nearby.map(station => (
                <StationCard
                  key={station.id}
                  station={station}
                  compact
                  active={(selected?.id || stations[0]?.id) === station.id}
                  onClick={() => setSelected(station)}
                  onSave={() => void saveStation(station)}
                />
              ))}
            </div>
          </section>

          <section className="surface-panel upcoming-card">
            <div className="section-heading"><h2>Lịch sạc sắp tới</h2><CalendarDays size={18} color="var(--app-primary)" /></div>
            {upcomingBooking ? (() => {
              const bookingDate = new Date(`${upcomingBooking.date}T12:00:00`);
              const bookingStation = stations.find(item => item.id === upcomingBooking.stationId);
              return (
                <div className="booking-mini">
                  <div className="booking-date-tile"><strong>{bookingDate.getDate().toString().padStart(2, '0')}</strong><small>Tháng {bookingDate.getMonth() + 1}</small></div>
                  <div>
                    <span className="status-badge available">Đã xác nhận</span>
                    <h3>{upcomingBooking.stationName}</h3>
                    <p>{upcomingBooking.time}<br />{upcomingBooking.connector}</p>
                  </div>
                  <div className="booking-mini-actions">
                    <button className="primary-button" type="button" onClick={() => navigate('/app/bookings')}>Xem lịch</button>
                    {bookingStation && <a className="secondary-button" href={getDirectionsUrl(bookingStation)} target="_blank" rel="noreferrer"><Route size={15} /> Chỉ đường</a>}
                  </div>
                </div>
              );
            })() : (
              <div className="booking-mini booking-mini-empty">
                <div className="empty-state-icon"><CalendarDays size={22} /></div>
                <div><h3>Chưa có lịch sạc</h3><p>Đặt trước một trạm để giữ chỗ và không phải chờ.</p></div>
                <button className="primary-button" type="button" onClick={() => navigate('/app/map')}>Đặt lịch</button>
              </div>
            )}
          </section>
        </div>

        <section className="surface-panel map-panel">
          <div className="map-panel-toolbar">
            <button className="map-control" type="button" onClick={() => navigate('/app/map')}><LocateFixed size={15} /> Gần tôi</button>
            <button className="map-control" type="button" onClick={() => navigate('/app/map')}><Filter size={15} /> Bộ lọc</button>
          </div>
          <AppMap
            stations={stations}
            selectedId={selected?.id || stations[0]?.id}
            onSelect={handleSelect}
            onOpenDetails={handleOpenDetails}
            compact
          />
          <div className="map-legend">
            <span className="legend-item"><i className="legend-swatch" /> Còn trống</span>
            <span className="legend-item"><i className="legend-swatch busy" /> Sắp đầy</span>
          </div>
        </section>
      </div>

      {selected && (
        <div className="toast" role="status">
          <Zap size={16} /> {selected.name}
          <button className="text-button" type="button" onClick={() => navigate(`/app/stations/${selected.id}`)}>Chi tiết <ChevronRight size={14} /></button>
        </div>
      )}
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
