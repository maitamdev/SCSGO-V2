import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronRight, ExternalLink, LocateFixed, MapPin, Navigation, Search, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import AppMap from '../../components/AppMap';
import StationCard from '../../components/StationCard';
import { useAuth } from '../../contexts/AuthContext';
import { grantLocationConsent, hasLocationConsent } from '../../data/consents';
import { formatPower, getDirectionsUrl, type ChargingStation } from '../../data/stations';
import { useStations } from '../../hooks/useStations';

const FILTERS = ['Tất cả', 'Còn trống', 'Xe máy điện', 'Ô tô điện', 'Sạc nhanh', 'Mở 24/7'];
const ROUTING_BASE_URL = (import.meta.env.VITE_ROUTING_BASE_URL || 'https://router.project-osrm.org').replace(/\/$/, '');

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface ActiveRoute {
  stationId: string;
  stationName: string;
  coordinates: [number, number][];
  distanceKm: number;
  durationMinutes: number;
}

function getDeviceLocation() {
  return new Promise<UserLocation>((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('unsupported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
      reject,
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  });
}

function distanceInKm(from: UserLocation, station: ChargingStation) {
  const earthRadiusKm = 6371;
  const toRadians = (value: number) => value * Math.PI / 180;
  const latitudeDelta = toRadians(station.latitude - from.latitude);
  const longitudeDelta = toRadians(station.longitude - from.longitude);
  const originLatitude = toRadians(from.latitude);
  const stationLatitude = toRadians(station.latitude);
  const haversine = Math.sin(latitudeDelta / 2) ** 2
    + Math.cos(originLatitude) * Math.cos(stationLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export default function MapScreen() {
  const { stations } = useStations();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [activeFilter, setActiveFilter] = useState('Tất cả');
  const [selected, setSelected] = useState<ChargingStation | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationState, setLocationState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [locationMessage, setLocationMessage] = useState('');
  const [activeRoute, setActiveRoute] = useState<ActiveRoute | null>(null);
  const [routeState, setRouteState] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle');
  const [routeMessage, setRouteMessage] = useState('');
  const [locationConsent, setLocationConsent] = useState(hasLocationConsent);
  const [showConsent, setShowConsent] = useState(!hasLocationConsent());

  const requestLocation = useCallback(async () => {
    if (!locationConsent) {
      setShowConsent(true);
      return;
    }
    setLocationState('loading');
    setLocationMessage('Đang xác định vị trí của bạn…');
    try {
      const location = await getDeviceLocation();
      setUserLocation(location);
      setLocationState('ready');
      setLocationMessage('Đã sắp xếp trạm theo vị trí hiện tại.');
    } catch (error) {
      const geolocationError = error as GeolocationPositionError;
      setLocationState('error');
      setLocationMessage(geolocationError.code === geolocationError.PERMISSION_DENIED
        ? 'Bạn cần cho phép truy cập vị trí để tìm trạm gần nhất.'
        : 'Chưa thể lấy vị trí. Hãy thử lại.');
    }
  }, [locationConsent]);

  useEffect(() => {
    if (!locationConsent) return;
    const timer = window.setTimeout(requestLocation, 0);
    return () => window.clearTimeout(timer);
  }, [locationConsent, requestLocation]);

  const acceptLocationConsent = async () => {
    if (!user) return;
    try {
      await grantLocationConsent(user.id);
      setLocationConsent(true);
      setShowConsent(false);
    } catch {
      setLocationState('error');
      setLocationMessage('Chưa thể lưu lựa chọn quyền riêng tư. Vui lòng thử lại.');
    }
  };

  const locatedStations = useMemo(() => {
    if (!userLocation) return stations;
    return stations
      .map(station => ({ ...station, distanceKm: distanceInKm(userLocation, station) }))
      .sort((first, second) => first.distanceKm - second.distanceKm);
  }, [stations, userLocation]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    return locatedStations.filter(station => {
      const matchesQuery = !normalized || `${station.name} ${station.address} ${station.district}`.toLocaleLowerCase('vi').includes(normalized);
      const matchesFilter = activeFilter === 'Tất cả'
        || (activeFilter === 'Còn trống' && station.status === 'available')
        || (activeFilter === 'Xe máy điện' && (station.vehicleType === 'motorbike' || station.vehicleType === 'both'))
        || (activeFilter === 'Ô tô điện' && (station.vehicleType === 'car' || station.vehicleType === 'both'))
        || (activeFilter === 'Sạc nhanh' && station.powerKw >= 60)
        || (activeFilter === 'Mở 24/7' && station.openHours.includes('24/7'));
      return matchesQuery && matchesFilter;
    });
  }, [locatedStations, query, activeFilter]);

  const handleSelect = useCallback((station: ChargingStation) => {
    setSelected(station);
    setActiveRoute(current => current?.stationId === station.id ? current : null);
    setRouteState(current => current === 'loading' ? current : 'idle');
  }, []);
  const handleOpenDetails = useCallback((station: ChargingStation) => {
    navigate(`/app/stations/${station.id}`);
  }, [navigate]);
  const focused = filtered.find(station => station.id === selected?.id) || filtered[0];
  const nearestStation = userLocation ? locatedStations[0] : null;

  const loadRoute = useCallback(async (origin: UserLocation, station: ChargingStation) => {
    setRouteState('loading');
    setRouteMessage('Đang tìm tuyến đường nhanh nhất…');
    try {
      const endpoint = `${ROUTING_BASE_URL}/route/v1/driving/${origin.longitude},${origin.latitude};${station.longitude},${station.latitude}?overview=full&geometries=geojson&steps=false`;
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error('route-request-failed');
      const payload = await response.json() as {
        code?: string;
        routes?: Array<{
          distance: number;
          duration: number;
          geometry: { coordinates: [number, number][] };
        }>;
      };
      const route = payload.routes?.[0];
      if (payload.code !== 'Ok' || !route?.geometry.coordinates.length) throw new Error('route-not-found');
      setActiveRoute({
        stationId: station.id,
        stationName: station.name,
        coordinates: route.geometry.coordinates,
        distanceKm: route.distance / 1000,
        durationMinutes: Math.max(1, Math.round(route.duration / 60)),
      });
      setSelected(station);
      setRouteState('ready');
      setRouteMessage('');
    } catch {
      setRouteState('error');
      setRouteMessage('Chưa thể tải tuyến đường. Bạn vẫn có thể mở Google Maps.');
    }
  }, []);

  const startDirections = useCallback(async (station: ChargingStation) => {
    if (!locationConsent) {
      setShowConsent(true);
      return;
    }
    let origin = userLocation;
    if (!origin) {
      setLocationState('loading');
      setLocationMessage('Đang lấy vị trí để bắt đầu dẫn đường…');
      try {
        origin = await getDeviceLocation();
        setUserLocation(origin);
        setLocationState('ready');
        setLocationMessage('Đã xác định vị trí xuất phát.');
      } catch {
        setLocationState('error');
        setLocationMessage('Hãy cho phép truy cập vị trí để bắt đầu dẫn đường.');
        return;
      }
    }
    await loadRoute(origin, station);
  }, [loadRoute, locationConsent, userLocation]);

  return (
    <div className="app-page map-page">
      <div className="map-layout">
        <section className="map-results">
          <div className="map-results-header">
            <h1>Trạm sạc</h1>
            <p>{filtered.length} kết quả quanh TP. Hồ Chí Minh</p>
            <label className="local-search">
              <Search size={16} />
              <input value={query} onChange={event => setQuery(event.target.value)} placeholder="Tìm theo tên hoặc quận" />
            </label>
            <div className={`location-status ${locationState}`}>
              <button type="button" onClick={requestLocation} disabled={locationState === 'loading'}>
                <LocateFixed size={15} />
                {locationState === 'loading' ? 'Đang định vị…' : userLocation ? 'Cập nhật vị trí' : 'Dùng vị trí của tôi'}
              </button>
              {locationMessage && <span>{locationMessage}</span>}
            </div>
          </div>
          <div className="filter-row">
            {FILTERS.map(filter => <button key={filter} type="button" className={`filter-chip ${activeFilter === filter ? 'active' : ''}`} onClick={() => setActiveFilter(filter)}>{filter}</button>)}
          </div>
          <div className="map-results-list">
            {showConsent && (
              <section className="location-consent-card" aria-labelledby="location-consent-title">
                <span><LocateFixed size={19} /></span>
                <div><strong id="location-consent-title">Cho phép dùng vị trí chính xác?</strong><p>SCSGO dùng GPS để xếp trạm gần nhất và vẽ tuyến đường. Tọa độ chỉ giữ trong bộ nhớ khi bạn đang dùng trang; khi bấm dẫn đường, điểm đầu và điểm đến được gửi tới dịch vụ định tuyến. Bạn có thể rút lại quyền trong Tài khoản.</p><div><button className="primary-button" type="button" onClick={() => void acceptLocationConsent()}>Cho phép định vị</button><button className="secondary-button" type="button" onClick={() => setShowConsent(false)}>Không phải bây giờ</button></div></div>
              </section>
            )}
            {nearestStation && (
              <button className="nearest-station-card" type="button" onClick={() => setSelected(nearestStation)}>
                <span className="nearest-station-icon"><MapPin size={17} /></span>
                <span><small>Đề xuất gần bạn nhất</small><strong>{nearestStation.name}</strong><em>{nearestStation.distanceKm < 1 ? `${Math.round(nearestStation.distanceKm * 1000)} m` : `${nearestStation.distanceKm.toFixed(1)} km`} • {nearestStation.availableSlots} cổng trống</em></span>
                <ChevronRight size={17} />
              </button>
            )}
            {filtered.map(station => (
              <StationCard key={station.id} station={station} compact active={focused?.id === station.id} onClick={() => setSelected(station)} />
            ))}
            {filtered.length === 0 && (
              <div className="map-results-empty">
                <strong>Không tìm thấy trạm phù hợp</strong>
                <span>Thử đổi từ khóa hoặc chọn bộ lọc khác.</span>
              </div>
            )}
          </div>
        </section>

        <section className="map-canvas">
          <AppMap
            stations={filtered}
            selectedId={focused?.id}
            onSelect={handleSelect}
            onOpenDetails={handleOpenDetails}
            userLocation={userLocation}
            activeRoute={activeRoute}
          />
          {(routeState === 'loading' || activeRoute || routeState === 'error') && (
            <aside className={`route-summary-panel ${routeState}`}>
              <span className="route-summary-icon"><Navigation size={18} /></span>
              <div>
                <small>{routeState === 'loading' ? 'Đang tính tuyến đường' : routeState === 'error' ? 'Không tải được tuyến đường' : 'Tuyến đường đề xuất'}</small>
                <strong>{activeRoute?.stationName || routeMessage}</strong>
                {activeRoute && <p>{activeRoute.distanceKm.toFixed(1)} km • khoảng {activeRoute.durationMinutes} phút lái xe</p>}
              </div>
              <button type="button" aria-label="Đóng chỉ đường" onClick={() => { setActiveRoute(null); setRouteState('idle'); }}><X size={16} /></button>
            </aside>
          )}
          {focused && (
            <article className="map-floating-detail">
              <img src={focused.image} alt={`Trạm sạc ${focused.name}`} />
              <div className="map-floating-content">
                <span className={`status-badge ${focused.status}`}>{focused.availableSlots}/{focused.totalSlots} cổng trống</span>
                <h3>{focused.name}</h3>
                <p>{formatPower(focused)}, cách bạn {focused.distanceKm.toFixed(1)} km</p>
                <div className="map-floating-actions">
                  <button className="secondary-button" type="button" disabled={routeState === 'loading'} onClick={() => void startDirections(focused)}><Navigation size={14} /> {routeState === 'loading' ? 'Đang tìm…' : 'Dẫn đường'}</button>
                  <a className="secondary-button" href={getDirectionsUrl(focused)} target="_blank" rel="noreferrer" aria-label="Mở bằng Google Maps"><ExternalLink size={14} /> Google Maps</a>
                  <button className="primary-button" type="button" onClick={() => navigate(`/app/stations/${focused.id}`)}>Xem chi tiết <ChevronRight size={14} /></button>
                </div>
              </div>
            </article>
          )}
        </section>
      </div>
    </div>
  );
}
