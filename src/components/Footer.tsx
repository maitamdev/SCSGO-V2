import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="qq-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-company">
            <h2>CÔNG TY CỔ PHẦN CÔNG NGHỆ SCSGO</h2>
            <p>CSKH: 0987.xxx.xxx (08h00 - 22h00)</p>
            <p>Email: hotro@scsgo.com</p>
          </div>
          <div className="footer-links">
            <a href="#">Về SCSGO</a>
            <a href="#">Chính sách bảo mật</a>
            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
