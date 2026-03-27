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
        <div className="nav-side nav-left">
          {isTeamPage ? (
            <Link to="/team" className="text-accent text-accent-btn">Đội Ngũ</Link>
          ) : (
            <>
              <a href="#features">Tính Năng</a>
              <a href="#community">Cộng Đồng</a>
            </>
          )}
        </div>

        <Link to="/" className="logo">
          <img src="/logo.jpg" alt="SCSGO Logo" />
          <span>SCSGO</span>
        </Link>
        
        <div className="nav-side nav-right">
          {isTeamPage ? (
            <Link to="/">Trang Chủ</Link>
          ) : (
            <>
              <Link to="/team">Đội Ngũ</Link>
              <a href="#download" className="text-accent text-accent-btn">Tải App</a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
