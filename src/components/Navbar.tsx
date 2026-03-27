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
        <a href="#" className="logo">
          <img src="/logo.jpg" alt="SCSGO Logo" />
          <span>SCSGO</span>
        </a>
        
        <div className="nav-links">
          {isTeamPage ? (
            <Link to="/">Trang Chủ</Link>
          ) : (
            <>
              <a href="#features">Tính Năng</a>
              <a href="#community">Cộng Đồng</a>
            </>
          )}
          <Link to="/team" className={isTeamPage ? "text-accent" : ""}>Đội Ngũ</Link>
          {!isTeamPage && <a href="#download" className="text-accent">Tải Ứng Dụng</a>}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
