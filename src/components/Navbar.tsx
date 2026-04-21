import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="qq-navbar">
      <div className="container nav-wrapper">
        <Link to="/" className="nav-logo-box">
          <img src="/logo.jpg" alt="SCSGO Logo" className="qq-logo" />
          <span className="qq-brand-text">SCSGO</span>
        </Link>
        <div className="nav-actions">
          <Link to="/login" className="btn btn-navy">ĐĂNG NHẬP</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
