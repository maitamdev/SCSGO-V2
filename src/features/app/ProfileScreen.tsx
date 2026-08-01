import { useCallback, useEffect, useState } from 'react';
import { Bell, Car, ChevronRight, CreditCard, Globe2, LockKeyhole, LogOut, Pencil, Plus, Save, ShieldCheck, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { hasLocationConsent, revokeLocationConsent } from '../../data/consents';

interface UserVehicle {
  id: string;
  brand: string;
  model: string;
  plate_number?: string | null;
  vehicle_type: 'car' | 'motorbike';
  battery_capacity_kwh?: number | null;
  is_default: boolean;
}

export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const profileRecord = profile as Record<string, string> | null;
  const initialName = profileRecord?.display_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Người dùng SCSGO';
  const avatarUrl = profileRecord?.avatar_url || user?.user_metadata?.avatar_url;
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(initialName);
  const [notice, setNotice] = useState('');
  const [vehicles, setVehicles] = useState<UserVehicle[]>([]);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [vehicleDraft, setVehicleDraft] = useState({ brand: 'VinFast', model: '', plateNumber: '', batteryCapacity: '', vehicleType: 'car' as 'car' | 'motorbike' });

  const loadVehicles = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase.from('vehicles').select('*').eq('user_id', user.id).order('is_default', { ascending: false });
    setVehicles((data || []) as UserVehicle[]);
  }, [user]);

  useEffect(() => {
    let active = true;
    if (!user) return () => { active = false; };
    void supabase.from('vehicles').select('*').eq('user_id', user.id).order('is_default', { ascending: false })
      .then(({ data }) => { if (active) setVehicles((data || []) as UserVehicle[]); });
    return () => { active = false; };
  }, [user]);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(''), 2400);
  };

  const saveProfile = async () => {
    if (!user || !displayName.trim()) return;
    const { error } = await supabase.from('profiles').upsert({ id: user.id, display_name: displayName.trim(), avatar_url: avatarUrl || null });
    if (error) {
      showNotice('Chưa thể cập nhật hồ sơ. Vui lòng thử lại.');
      return;
    }
    setIsEditing(false);
    await refreshProfile();
    showNotice('Đã cập nhật hồ sơ');
  };

  const sendPasswordReset = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/login`,
    });
    showNotice(error ? 'Chưa thể gửi email bảo mật.' : 'Đã gửi liên kết đổi mật khẩu qua email.');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const revokeLocation = async () => {
    if (!user || !hasLocationConsent()) {
      showNotice('Quyền định vị hiện chưa được bật.');
      return;
    }
    try {
      await revokeLocationConsent(user.id);
      showNotice('Đã rút lại sự đồng ý dùng vị trí trong SCSGO.');
    } catch {
      showNotice('Chưa thể cập nhật quyền định vị.');
    }
  };

  const saveVehicle = async () => {
    if (!user || !vehicleDraft.brand.trim() || !vehicleDraft.model.trim()) {
      showNotice('Vui lòng nhập hãng và mẫu xe.');
      return;
    }
    const { error } = await supabase.from('vehicles').insert({
      user_id: user.id,
      brand: vehicleDraft.brand.trim(),
      model: vehicleDraft.model.trim(),
      plate_number: vehicleDraft.plateNumber.trim() || null,
      battery_capacity_kwh: vehicleDraft.batteryCapacity ? Number(vehicleDraft.batteryCapacity) : null,
      vehicle_type: vehicleDraft.vehicleType,
      connector_types: vehicleDraft.vehicleType === 'car' ? ['CCS2', 'Type 2'] : ['Ổ cắm 220V'],
      is_default: vehicles.length === 0,
    });
    if (error) {
      showNotice('Chưa thể lưu phương tiện.');
      return;
    }
    setShowVehicleForm(false);
    setVehicleDraft({ brand: 'VinFast', model: '', plateNumber: '', batteryCapacity: '', vehicleType: 'car' });
    await loadVehicles();
    showNotice('Đã thêm phương tiện.');
  };

  const defaultVehicle = vehicles.find(vehicle => vehicle.is_default) || vehicles[0];

  return (
    <div className="app-page">
      <header className="page-heading"><div><h1>Tài khoản của tôi</h1><p>Quản lý hồ sơ, xe và cài đặt bảo mật.</p></div></header>
      <section className="surface-panel profile-hero">
        <div className="profile-avatar-large">{avatarUrl ? <img src={avatarUrl} alt="" /> : displayName.slice(0, 1).toUpperCase()}</div>
        <div className="profile-identity">
          {isEditing ? (
            <label className="local-search" style={{ maxWidth: 340, marginTop: 0 }}><UserRound size={16} /><input value={displayName} onChange={event => setDisplayName(event.target.value)} aria-label="Tên hiển thị" /></label>
          ) : <h1>{displayName}</h1>}
          <p>{user?.email || 'Tài khoản SCSGO'}<br />Thành viên Bạc</p>
          {isEditing ? <button className="primary-button" type="button" onClick={() => void saveProfile()}><Save size={14} /> Lưu thay đổi</button> : <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}><Pencil size={14} /> Chỉnh sửa hồ sơ</button>}
        </div>
        <div className="vehicle-summary">
          {defaultVehicle ? <img src="/ev_car.png" alt={`${defaultVehicle.brand} ${defaultVehicle.model}`} /> : <span className="vehicle-type-icon"><Car size={24} /></span>}
          <div><strong>{defaultVehicle ? `${defaultVehicle.brand} ${defaultVehicle.model}` : 'Chưa thêm phương tiện'}</strong><span>{defaultVehicle?.plate_number || 'Thêm xe để chọn đúng đầu sạc'}</span>{defaultVehicle?.battery_capacity_kwh && <><div className="battery-line" /><span>Dung lượng pin {defaultVehicle.battery_capacity_kwh} kWh</span></>}</div>
          <button className="secondary-button" type="button" onClick={() => setShowVehicleForm(current => !current)}><Plus size={14} /> Thêm xe</button>
        </div>
      </section>

      {showVehicleForm && <section className="surface-panel vehicle-form-panel"><div className="section-heading"><h2>Thêm phương tiện</h2></div><div className="vehicle-form-grid"><label><span>Loại xe</span><select value={vehicleDraft.vehicleType} onChange={event => setVehicleDraft(current => ({ ...current, vehicleType: event.target.value as 'car' | 'motorbike' }))}><option value="car">Ô tô điện</option><option value="motorbike">Xe máy điện</option></select></label><label><span>Hãng xe</span><input value={vehicleDraft.brand} onChange={event => setVehicleDraft(current => ({ ...current, brand: event.target.value }))} /></label><label><span>Mẫu xe</span><input value={vehicleDraft.model} onChange={event => setVehicleDraft(current => ({ ...current, model: event.target.value }))} placeholder="VF 8, Klara S…" /></label><label><span>Biển số</span><input value={vehicleDraft.plateNumber} onChange={event => setVehicleDraft(current => ({ ...current, plateNumber: event.target.value }))} /></label><label><span>Dung lượng pin (kWh)</span><input type="number" min="0" value={vehicleDraft.batteryCapacity} onChange={event => setVehicleDraft(current => ({ ...current, batteryCapacity: event.target.value }))} /></label></div><div className="page-actions"><button className="secondary-button" type="button" onClick={() => setShowVehicleForm(false)}>Hủy</button><button className="primary-button" type="button" onClick={() => void saveVehicle()}><Save size={14} /> Lưu phương tiện</button></div></section>}

      <div className="profile-grid">
        <section className="surface-panel settings-panel">
          <h2>Cài đặt tài khoản</h2>
          <button className="settings-row" type="button" onClick={() => setIsEditing(true)}><UserRound size={17} /> Thông tin cá nhân <ChevronRight size={16} /></button>
          <button className="settings-row" type="button" onClick={() => void sendPasswordReset()}><LockKeyhole size={17} /> Bảo mật và đăng nhập <ChevronRight size={16} /></button>
          <button className="settings-row" type="button" onClick={() => showNotice('Thông báo lịch sạc đang được bật.')}><Bell size={17} /> Thông báo <ChevronRight size={16} /></button>
          <button className="settings-row" type="button" onClick={() => showNotice('Ứng dụng đang sử dụng Tiếng Việt.')}><Globe2 size={17} /> Ngôn ngữ <span style={{ marginLeft: 'auto', color: 'var(--app-text-soft)' }}>Tiếng Việt</span><ChevronRight size={16} /></button>
          <button className="settings-row" type="button" onClick={() => void revokeLocation()}><ShieldCheck size={17} /> Rút quyền định vị <ChevronRight size={16} /></button>
          <button className="settings-row" type="button" onClick={handleSignOut} style={{ color: 'var(--app-danger)' }}><LogOut size={17} /> Đăng xuất <ChevronRight size={16} /></button>
        </section>
        <aside>
          <section className="surface-panel payment-card">
            <div className="section-heading"><h2>Thanh toán an toàn</h2><CreditCard size={18} color="var(--app-primary)" /></div>
            <div className="payment-method"><strong className="payment-logo">VNPAY</strong><span>Thanh toán qua cổng bảo mật</span></div>
            <p style={{ margin: '10px 0 0', color: 'var(--app-text-soft)', fontSize: 10, lineHeight: 1.55 }}>SCSGO không lưu số thẻ hoặc mã CVV. Bạn cũng có thể chọn thanh toán trực tiếp tại trạm.</p>
          </section>
        </aside>
      </div>
      {notice && <div className="toast" role="status"><ShieldCheck size={16} /> {notice}</div>}
    </div>
  );
}
