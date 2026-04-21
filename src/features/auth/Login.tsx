import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

export default function LoginScreen() {
  const { signInWithEmail, signUp, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    if (isSignUp && !displayName.trim()) return;

    let success: boolean;
    if (isSignUp) {
      success = await signUp(email, password, displayName);
    } else {
      success = await signInWithEmail(email, password);
    }
    if (success) {
      navigate('/app/home');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    clearError();
  };

  return (
    <div className="login-screen">
      <form className="login-form" onSubmit={handleSubmit}>
        {/* Logo */}
        <div className="login-logo-wrapper">
          <img src="/logo.jpg" alt="SCSGO" className="login-logo" />
        </div>
        <h1 className="login-title">Chào mừng đến SCSGO</h1>
        <p className="login-subtitle">
          {isSignUp ? 'Tạo tài khoản để lưu và đánh giá' : 'Đăng nhập để trải nghiệm đầy đủ'}
        </p>

        {/* Error */}
        {error && (
          <div className="login-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <span>{error}</span>
            <button type="button" className="login-error-close" onClick={clearError}>✕</button>
          </div>
        )}

        {/* Name (sign up only) */}
        {isSignUp && (
          <div className="login-field">
            <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input type="text" placeholder="Tên hiển thị" value={displayName} onChange={e => setDisplayName(e.target.value)} />
          </div>
        )}

        {/* Email */}
        <div className="login-field">
          <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
        </div>

        {/* Password */}
        <div className="login-field">
          <svg className="login-field-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          <button type="button" className="login-field-toggle" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Forgot password */}
        {!isSignUp && (
          <div className="login-forgot">
            <button type="button">Quên mật khẩu?</button>
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="login-btn-submit" disabled={isLoading}>
          {isLoading ? <span className="login-spinner" /> : (isSignUp ? 'Đăng ký' : 'Đăng nhập')}
        </button>

        {/* Toggle */}
        <p className="login-toggle">
          {isSignUp ? 'Đã có tài khoản? ' : 'Chưa có tài khoản? '}
          <button type="button" onClick={toggleMode}>
            {isSignUp ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </p>

        {/* Divider */}
        <div className="login-divider"><span>hoặc</span></div>

        {/* Google */}
        <button type="button" className="login-btn-google" disabled={isLoading}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" height="20" />
          Đăng nhập bằng Google
        </button>
      </form>
    </div>
  );
}
