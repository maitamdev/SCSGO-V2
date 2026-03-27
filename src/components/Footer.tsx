import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="logo">
            <img src="/logo.jpg" alt="SCSGO Logo" />
            <span>SCSGO</span>
          </div>
          <p className="footer-desc">Nạp Năng Lượng. Vững Hành Trình. Ứng dụng đồng hành cùng xe điện số 1 Việt Nam.</p>
        </div>
        
        <div className="footer-links">
          <div className="link-col">
            <h4>Ứng Dụng</h4>
            <a href="#">Tải Xuống</a>
            <a href="#">Tính Năng</a>
            <a href="#">Bản Cập Nhật</a>
          </div>
          <div className="link-col">
            <h4>Công Ty</h4>
            <a href="#">Về Chúng Tôi</a>
            <a href="#">Liên Hệ</a>
            <a href="#">Tuyển Dụng</a>
          </div>
          <div className="link-col">
            <h4>Pháp Lý</h4>
            <a href="#">Chính Sách Bảo Mật</a>
            <a href="#">Điều Khoản Dịch Vụ</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} SCSGO. Thuộc sở hữu bởi SCSGO Team.</p>
      </div>
    </footer>
  );
};

export default Footer;
