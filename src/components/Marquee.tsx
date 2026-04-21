import React from 'react';
import './Marquee.css';

const Marquee: React.FC = () => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>SCSGO</span>
        <span className="dot">•</span>
        <span>NHANH CHÓNG</span>
        <span className="dot">•</span>
        <span>SẠCH SẼ</span>
        <span className="dot">•</span>
        <span>ĐƠN GIẢN</span>
        <span className="dot">•</span>
        <span>SCSGO</span>
        <span className="dot">•</span>
        <span>NHANH CHÓNG</span>
        <span className="dot">•</span>
        <span>SẠCH SẼ</span>
        <span className="dot">•</span>
        <span>ĐƠN GIẢN</span>
      </div>
    </div>
  );
};

export default Marquee;
