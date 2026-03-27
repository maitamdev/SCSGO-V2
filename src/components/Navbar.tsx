import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  const location = useLocation();
  const isTeamPage = location.pathname === '/team';
  
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link 
          to="/" 
          className="logo"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img src="/logo.jpg" alt="SCSGO Logo" />
          <span>SCSGO</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/"
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
          >
            Trang Chủ
          </Link>
          <a href="/#features">Tính Năng</a>
          <a href="/#community">Cộng Đồng</a>
          <Link to="/team" className={isTeamPage ? "text-accent" : ""}>Đội Ngũ</Link>
          <a href="/#download" className="text-accent btn-primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '100px', fontSize: '0.95rem' }}>Tải App</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
