import { useEffect, useState } from 'react';
import { Bookmark, Gauge, MapPin, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { formatPower, type ChargingStation } from '../../data/stations';
import { supabase } from '../../lib/supabase';

interface SavedPlace {
  id: string;
  place_id: string;
  place_data: Partial<ChargingStation> & Record<string, unknown>;
}

export default function SavedScreen() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let active = true;
    supabase.from('favorites').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => {
      if (active) {
        setSaved((data as SavedPlace[]) || []);
        setLoading(false);
      }
    });
    return () => { active = false; };
  }, [user]);

  const removeSaved = async (placeId: string) => {
    if (!user) return;
    setSaved(current => current.filter(item => item.place_id !== placeId));
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('place_id', placeId);
  };

  return (
    <div className="app-page">
      <header className="page-heading"><div><h1>Trạm đã lưu</h1><p>{saved.length} địa điểm trong bộ sưu tập của bạn.</p></div></header>
      {loading ? <div className="saved-grid">{[1, 2, 3].map(item => <div key={item} className="surface-panel skeleton" style={{ minHeight: 300 }} />)}</div> : saved.length === 0 ? (
        <section className="surface-panel empty-state">
          <div className="empty-state-icon"><Bookmark size={27} /></div>
          <h2>Chưa có trạm đã lưu</h2>
          <p>Lưu các trạm thường dùng để kiểm tra tình trạng và đặt chỗ nhanh hơn.</p>
          <button className="primary-button" type="button" onClick={() => navigate('/app/map')}>Khám phá trạm sạc</button>
        </section>
      ) : (
        <div className="saved-grid">
          {saved.map(item => {
            const station = item.place_data;
            return (
              <article className="surface-panel saved-card" key={item.id}>
                <div className="saved-card-image">
                  <img src={String(station.image || station.thumbnail || '/charging_station.png')} alt={`Trạm sạc ${String(station.name || station.title || '')}`} />
                  <button className="icon-button" type="button" aria-label="Bỏ lưu" onClick={() => void removeSaved(item.place_id)}><Trash2 size={17} /></button>
                </div>
                <div className="saved-card-content">
                  <span className="status-badge available">Còn trống</span>
                  <h3>{String(station.name || station.title || 'Trạm sạc SCSGO')}</h3>
                  <p><MapPin size={13} /> {String(station.address || 'TP. Hồ Chí Minh')}</p>
                  <div className="saved-card-footer"><span><Gauge size={13} /> {formatPower({ ...station, powerKw: Number(station.powerKw || 120) } as ChargingStation)}</span><button className="text-button" type="button" onClick={() => navigate(`/app/stations/${item.place_id}`)}>Xem chi tiết</button></div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
