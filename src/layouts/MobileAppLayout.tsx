import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router';
import {
  Bell,
  Bookmark,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Home,
  LogOut,
  Map,
  LayoutDashboard,
  Menu,
  Search,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import './MobileAppLayout.css';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  data: Record<string, unknown> | null;
  read_at: string | null;
  created_at: string;
}

const NAV_ITEMS = [
  { path: '/app/home', icon: Home, label: 'Trang chủ' },
  { path: '/app/map', icon: Map, label: 'Trạm sạc' },
  { path: '/app/bookings', icon: CalendarDays, label: 'Lịch đặt chỗ' },
  { path: '/app/feed', icon: Users, label: 'Cộng đồng' },
  { path: '/app/saved', icon: Bookmark, label: 'Đã lưu' },
  { path: '/app/profile', icon: UserRound, label: 'Tài khoản' },
];

export default function MobileAppLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const profileRecord = profile as Record<string, string> | null;
  const displayName = profileRecord?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || 'Người dùng SCSGO';
  const avatarUrl = profileRecord?.avatar_url || user?.user_metadata?.avatar_url;
  const canManageStations = ['admin', 'operator', 'support', 'finance'].includes(profileRecord?.role || '');
  const navItems = canManageStations
    ? [...NAV_ITEMS, { path: '/app/admin', icon: LayoutDashboard, label: 'Quản trị trạm' }]
    : NAV_ITEMS;

  const loadNotifications = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('notifications').select('id,title,body,data,read_at,created_at')
      .eq('user_id', user.id).order('created_at', { ascending: false }).limit(12);
    setNotifications((data || []) as AppNotification[]);
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const timer = window.setTimeout(() => { void loadNotifications(); }, 0);
    const channel = supabase.channel(`notifications:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, payload => {
        setNotifications(current => [payload.new as AppNotification, ...current].slice(0, 12));
      }).subscribe();
    return () => {
      window.clearTimeout(timer);
      void supabase.removeChannel(channel);
    };
  }, [loadNotifications, user]);

  const openNotifications = async () => {
    const nextOpen = !showNotifications;
    setShowNotifications(nextOpen);
    if (!nextOpen || !user) return;
    const unreadIds = notifications.filter(item => !item.read_at).map(item => item.id);
    if (unreadIds.length) {
      const readAt = new Date().toISOString();
      setNotifications(current => current.map(item => unreadIds.includes(item.id) ? { ...item, read_at: readAt } : item));
      await supabase.from('notifications').update({ read_at: readAt }).in('id', unreadIds).eq('user_id', user.id);
    }
  };

  const unreadCount = notifications.filter(item => !item.read_at).length;

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    navigate(`/app/map${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="product-app">
      <aside className={`app-sidebar ${isMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand" onClick={() => navigate('/app/home')}>
          <span className="sidebar-brand-logo">
            <img src="/logo.jpg" alt="SCSGO - Smart Charging Station" />
          </span>
        </div>

        <button className="sidebar-close" type="button" aria-label="Đóng menu" onClick={() => setIsMenuOpen(false)}>
          <X size={21} />
        </button>

        <nav className="sidebar-nav" aria-label="Điều hướng chính">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-support" type="button">
            <CircleHelp size={19} />
            <span><strong>Cần hỗ trợ?</strong><small>1900 88 55 66</small></span>
          </button>
          <button className="sidebar-signout" type="button" onClick={handleSignOut}>
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </aside>

      {isMenuOpen && <button className="sidebar-backdrop" aria-label="Đóng menu" onClick={() => setIsMenuOpen(false)} />}

      <div className="app-workspace">
        <header className="app-topbar">
          <button className="mobile-menu-button" type="button" aria-label="Mở menu" onClick={() => setIsMenuOpen(true)}>
            <Menu size={21} />
          </button>
          <form className="global-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="Tìm trạm sạc theo tên hoặc khu vực"
              aria-label="Tìm trạm sạc"
            />
            <kbd>⌘ K</kbd>
          </form>
          <div className="topbar-actions">
            <div className="notification-center">
              <button className="icon-button notification-trigger" type="button" aria-label="Thông báo" aria-expanded={showNotifications} onClick={() => void openNotifications()}>
                <Bell size={19} />{unreadCount > 0 && <span className="notification-badge">{Math.min(unreadCount, 9)}</span>}
              </button>
              {showNotifications && <div className="notification-popover">
                <div className="notification-heading"><strong>Thông báo</strong><span>{notifications.length} gần đây</span></div>
                <div className="notification-list">
                  {notifications.length ? notifications.map(item => <button key={item.id} type="button" onClick={() => { setShowNotifications(false); if (item.data?.booking_id) navigate('/app/bookings'); }}>
                    <span className={item.read_at ? '' : 'unread'} />
                    <div><strong>{item.title}</strong><p>{item.body}</p><small>{new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(item.created_at))}</small></div>
                  </button>) : <p className="notification-empty">Bạn chưa có thông báo mới.</p>}
                </div>
              </div>}
            </div>
            <button className="account-trigger" type="button" onClick={() => navigate('/app/profile')}>
              <span className="topbar-avatar">
                {avatarUrl ? <img src={avatarUrl} alt="" /> : displayName.slice(0, 1).toUpperCase()}
              </span>
              <span>{displayName}</span>
              <ChevronDown size={15} />
            </button>
          </div>
        </header>

        <main className="app-main">
          <Outlet />
        </main>

        <nav className="mobile-bottom-nav" aria-label="Điều hướng di động">
          {NAV_ITEMS.slice(0, 5).map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => isActive ? 'active' : ''}>
                <Icon size={20} />
                <span>{item.label.replace('Lịch đặt chỗ', 'Lịch sạc')}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
