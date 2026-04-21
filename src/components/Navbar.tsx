import React from 'react';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="qq-navbar">
      <div className="container nav-wrapper">
        <a href="/" className="nav-logo-box">
          <img src="/logo.jpg" alt="SCSGO Logo" className="qq-logo" />
          <span className="qq-brand-text">SCSGO</span>
        </a>
        <div className="nav-actions">
          <a href="#" className="btn btn-navy">ĐĂNG NHẬP</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
