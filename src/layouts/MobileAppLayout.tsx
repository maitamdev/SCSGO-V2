import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './MobileAppLayout.css';

const NAV_ITEMS = [
  { path: '/app/home', icon: 'home', activeIcon: 'home-filled', label: 'Trang chủ' },
  { path: '/app/map', icon: 'map', activeIcon: 'map-filled', label: 'Bản đồ' },
  { path: '/app/feed', icon: 'feed', activeIcon: 'feed-filled', label: 'Bảng tin' },
  { path: '/app/saved', icon: 'bookmark', activeIcon: 'bookmark-filled', label: 'Đã lưu' },
  { path: '/app/profile', icon: 'person', activeIcon: 'person-filled', label: 'Cá nhân' },
];

function NavIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? '#2563eb' : '#94a3b8';
  const size = 22;
  switch (type) {
    case 'home': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case 'home-filled': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
    case 'map': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>;
    case 'map-filled': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2" opacity="0.9"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18" stroke="#fff" strokeWidth="1.5"/><line x1="15" y1="6" x2="15" y2="21" stroke="#fff" strokeWidth="1.5"/></svg>;
    case 'feed': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><rect x="4" y="5" width="16" height="14" rx="2"/><line x1="4" y1="9" x2="20" y2="9"/><line x1="4" y1="13" x2="12" y2="13"/></svg>;
    case 'feed-filled': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><rect x="4" y="5" width="16" height="14" rx="2"/><line x1="4" y1="9" x2="20" y2="9" stroke="#fff"/><line x1="4" y1="13" x2="12" y2="13" stroke="#fff"/></svg>;
    case 'bookmark': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
    case 'bookmark-filled': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>;
    case 'person': return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'person-filled': return <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    default: return null;
  }
}

export default function MobileAppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="mobile-app-shell">
      <div className="mobile-app-container">
        <div className="mobile-app-content">
          <Outlet />
        </div>
        <nav className="mobile-bottom-nav">
          {NAV_ITEMS.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <NavIcon type={isActive ? item.activeIcon : item.icon} active={isActive} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
