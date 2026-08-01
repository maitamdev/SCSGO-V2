import { useState } from 'react';
import type { FormEvent } from 'react';
import { Check, Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import './Login.css';

export default function LoginScreen() {
  const { signInWithEmail, signUp, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim() || !password.trim() || (isSignUp && !displayName.trim())) return;
    const success = isSignUp
      ? await signUp(email, password, displayName)
      : await signInWithEmail(email, password);
    if (success) navigate('/app/home');
  };

  const toggleMode = () => {
    setIsSignUp(current => !current);
    setResetSent(false);
    clearError();
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/app/home` },
    });
  };

  const handleReset = async () => {
    if (!email.trim()) return;
    await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/login`,
    });
    setResetSent(true);
  };

  return (
    <main className="auth-page">
      <section className="auth-visual" aria-label="Giới thiệu SCSGO">
        <img
          src="/design-reference/real-ev-charging-pexels.jpg"
          alt="Xe điện đang sạc tại một trạm sạc công cộng"
        />
        <div className="auth-visual-overlay">
          <Link className="auth-brand" to="/about">
            <span className="auth-logo-crop">
              <img src="/logo.jpg" alt="SCSGO - Smart Charging Station" />
            </span>
          </Link>
          <div className="auth-story">
            <h1>Đi xa hơn.<br />Sạc thông minh hơn.</h1>
            <p>Kết nối hành trình của bạn với mạng lưới sạc thông minh trên toàn quốc.</p>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-heading">
            <span className="auth-mobile-logo">
              <img src="/logo.jpg" alt="SCSGO - Smart Charging Station" />
            </span>
            <h2>{isSignUp ? 'Tạo tài khoản SCSGO' : 'Chào mừng trở lại'}</h2>
            <p>{isSignUp ? 'Lưu trạm yêu thích và quản lý mọi lịch sạc.' : 'Đăng nhập để quản lý hành trình của bạn.'}</p>
          </div>

          {error && <div className="auth-alert error"><span>{error}</span><button type="button" onClick={clearError}>Đóng</button></div>}
          {resetSent && <div className="auth-alert success"><Check size={16} /><span>Đã gửi hướng dẫn đặt lại mật khẩu.</span></div>}

          {isSignUp && (
            <label className="auth-field">
              <span>Họ và tên</span>
              <div><UserRound size={17} /><input value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder="Nguyễn Minh Khoa" autoComplete="name" /></div>
            </label>
          )}
          <label className="auth-field">
            <span>Email</span>
            <div><Mail size={17} /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="ban@example.com" autoComplete="email" /></div>
          </label>
          <label className="auth-field">
            <span>Mật khẩu</span>
            <div>
              <LockKeyhole size={17} />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={event => setPassword(event.target.value)} placeholder="Tối thiểu 6 ký tự" autoComplete={isSignUp ? 'new-password' : 'current-password'} />
              <button type="button" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} onClick={() => setShowPassword(current => !current)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button>
            </div>
          </label>

          {!isSignUp && <button className="auth-forgot" type="button" onClick={() => void handleReset()}>Quên mật khẩu?</button>}
          <button className="auth-submit" type="submit" disabled={isLoading}>{isLoading ? 'Đang xử lý...' : isSignUp ? 'Tạo tài khoản' : 'Đăng nhập'}</button>
          <div className="auth-divider"><span>hoặc</span></div>
          <button className="auth-google" type="button" disabled={isLoading} onClick={() => void handleGoogleLogin()}><img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" /> Tiếp tục với Google</button>
          <p className="auth-toggle">{isSignUp ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'} <button type="button" onClick={toggleMode}>{isSignUp ? 'Đăng nhập' : 'Đăng ký ngay'}</button></p>
        </form>
      </section>
    </main>
  );
}
