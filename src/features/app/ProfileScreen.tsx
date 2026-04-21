import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = (profile as Record<string, string>)?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Người dùng';
  const avatarUrl = (profile as Record<string, string>)?.avatar_url || user?.user_metadata?.avatar_url;
  const email = user?.email || '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    { icon: '🔖', label: 'Địa điểm đã lưu', action: () => navigate('/app/saved') },
    { icon: '⚡', label: 'Lịch sử đặt chỗ', action: () => {} },
    { icon: '🕐', label: 'Lịch sử tìm kiếm', action: () => {} },
    { icon: '⭐', label: 'Đánh giá của tôi', action: () => {} },
    { icon: '🔔', label: 'Thông báo', action: () => {} },
    { icon: '⚙️', label: 'Cài đặt', action: () => {} },
    { icon: '❓', label: 'Trợ giúp', action: () => {} },
    { icon: 'ℹ️', label: 'Về ứng dụng', action: () => {} },
  ];

  return (
    <div className="app-screen">
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        {/* Avatar */}
        <div className="profile-avatar-wrapper">
          <div className="profile-avatar">
            {avatarUrl
              ? <img src={avatarUrl} alt="" />
              : <span>{displayName[0].toUpperCase()}</span>
            }
          </div>
        </div>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>{displayName}</h2>
        <p style={{ margin: 0, fontSize: 14, color: '#64748b' }}>{email}</p>
      </div>

      {/* Menu */}
      <div className="app-place-list">
        {menuItems.map((item, i) => (
          <button key={i} className="app-place-card" onClick={item.action} style={{ cursor: 'pointer', border: 'none', width: '100%', textAlign: 'left' }}>
            <div className="profile-menu-icon">{item.icon}</div>
            <div className="app-place-info">
              <h4>{item.label}</h4>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ))}
      </div>

      {/* Logout */}
      <div style={{ padding: '8px 16px 24px' }}>
        <button className="profile-logout-btn" onClick={handleSignOut}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
