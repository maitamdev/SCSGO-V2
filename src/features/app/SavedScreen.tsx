import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

interface SavedPlace {
  id: string;
  place_id: string;
  place_data: Record<string, unknown>;
  created_at: string;
}

export default function SavedScreen() {
  const { user } = useAuth();
  const [saved, setSaved] = useState<SavedPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSaved();
  }, []);

  const loadSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setSaved((data as SavedPlace[]) || []);
    } catch (e) {
      console.error('Load saved error:', e);
    }
    setLoading(false);
  };

  const removeSaved = async (placeId: string) => {
    if (!user) return;
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('place_id', placeId);
    loadSaved();
  };

  return (
    <div className="app-screen">
      <div className="app-header">
        <div className="app-header-row">
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Đã lưu</h2>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748b' }}>{saved.length} địa điểm</span>
        </div>
      </div>

      <div className="app-place-list">
        {loading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="app-place-card shimmer">
              <div className="shimmer-icon" /><div className="shimmer-lines"><div className="shimmer-line w60" /><div className="shimmer-line w80" /></div>
            </div>
          ))
        ) : saved.length === 0 ? (
          <div className="app-empty">
            <span style={{ fontSize: 48 }}>🔖</span>
            <h3>Chưa lưu địa điểm</h3>
            <p>Nhấn biểu tượng trái tim để lưu trạm sạc yêu thích</p>
          </div>
        ) : (
          saved.map(item => {
            const pd = item.place_data || {};
            return (
              <div key={item.id} className="app-place-card">
                <div className="app-place-icon">⚡</div>
                <div className="app-place-info">
                  <h4>{(pd.title || pd.name || 'Trạm sạc') as string}</h4>
                  <p>{(pd.address || pd.vicinity || '') as string}</p>
                </div>
                <button className="app-icon-btn" onClick={() => removeSaved(item.place_id)} title="Bỏ lưu">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ef4444" stroke="#ef4444" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
