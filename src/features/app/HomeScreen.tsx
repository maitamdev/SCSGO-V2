import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './AppScreens.css';

interface PlaceItem {
  id: string;
  place_id: string;
  title: string;
  address: string;
  rating: number;
  type: string;
}

export default function HomeScreen() {
  const { user, profile } = useAuth();
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng ☀️';
    if (hour < 18) return 'Chào buổi chiều 🌤️';
    return 'Chào buổi tối 🌙';
  };

  const displayName = (profile as Record<string, string>)?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Người dùng';

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    setLoading(true);
    try {
      // Load favorites as "places" for now (the Flutter app uses external API for places)
      const { data } = await supabase
        .from('favorites')
        .select()
        .eq('user_id', user?.id ?? '')
        .order('created_at', { ascending: false });

      if (data) {
        setPlaces(data.map((item: Record<string, unknown>) => {
          const pd = (item.place_data || {}) as Record<string, unknown>;
          return {
            id: item.id as string,
            place_id: (item.place_id || '') as string,
            title: (pd.title || pd.name || 'Trạm sạc') as string,
            address: (pd.address || pd.vicinity || 'Không rõ địa chỉ') as string,
            rating: (pd.rating || 0) as number,
            type: (pd.type || 'charging') as string,
          };
        }));
      }
    } catch (e) {
      console.error('Load places error:', e);
    }
    setLoading(false);
  };

  const filteredPlaces = places.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cafe': return '☕';
      case 'restaurant': return '🍽️';
      case 'charging': return '⚡';
      case 'restroom': return '🚻';
      default: return '📍';
    }
  };

  return (
    <div className="app-screen">
      {/* Header */}
      <div className="app-header">
        <div className="app-header-row">
          <div className="app-location-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#2563eb"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          </div>
          <div className="app-header-text">
            <span className="app-greeting">{getGreeting()}</span>
            <span className="app-username">{displayName}</span>
          </div>
          <div className="app-header-actions">
            <button className="app-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button className="app-icon-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="app-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" placeholder="Tìm trạm sạc gần bạn..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
      </div>

      {/* Filter chips */}
      <div className="app-filter-chips">
        {['Tất cả', 'Trạm sạc', 'Quán café', 'Nhà hàng', 'Nghỉ chân'].map(chip => (
          <button key={chip} className="app-chip">{chip}</button>
        ))}
      </div>

      {/* Banner */}
      <div className="app-banner">
        <div className="app-banner-content">
          <span className="app-banner-tag">🔥 Khuyến mãi</span>
          <h3>Sạc miễn phí 2 lần đầu</h3>
          <p>Dành cho người dùng mới đăng ký tài khoản SCSGO</p>
        </div>
      </div>

      {/* Section header */}
      <div className="app-section-header">
        <div>
          <h2>Địa điểm gần đây</h2>
          <span>{filteredPlaces.length} địa điểm</span>
        </div>
      </div>

      {/* Place list */}
      <div className="app-place-list">
        {loading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} className="app-place-card shimmer">
                <div className="shimmer-icon" />
                <div className="shimmer-lines">
                  <div className="shimmer-line w60" />
                  <div className="shimmer-line w80" />
                </div>
              </div>
            ))}
          </>
        ) : filteredPlaces.length === 0 ? (
          <div className="app-empty">
            <span style={{ fontSize: 48 }}>🔍</span>
            <h3>Không tìm thấy địa điểm</h3>
            <p>Thử thay đổi bộ lọc hoặc mở rộng khu vực tìm kiếm</p>
          </div>
        ) : (
          filteredPlaces.map(place => (
            <div key={place.id} className="app-place-card">
              <div className="app-place-icon">{getTypeIcon(place.type)}</div>
              <div className="app-place-info">
                <h4>{place.title}</h4>
                <p>{place.address}</p>
                {place.rating > 0 && (
                  <div className="app-place-rating">
                    <span>⭐</span> {place.rating.toFixed(1)}
                  </div>
                )}
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
