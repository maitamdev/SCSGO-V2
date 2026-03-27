import React from 'react';
import './Navbar.css';

interface NavbarProps {
  scrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ scrolled }) => {
  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <a href="#" className="logo">
          <img src="/logo.jpg" alt="SCSGO Logo" />
          <span>SCSGO</span>
        </a>
        
        <div className="nav-links">
          <a href="#features">Tính Năng</a>
          <a href="#community">Cộng Đồng</a>
          <a href="#download" className="text-accent">Tải Ứng Dụng</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
