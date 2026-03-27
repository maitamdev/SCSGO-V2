import React from 'react';
import './Marquee.css';

const Marquee: React.FC = () => {
  const items = [
    "KHÔNG LO HẾT PIN",
    "•",
    "BẢN ĐỒ THỜI GIAN THỰC",
    "•",
    "ĐẶT CHỖ TRƯỚC",
    "•",
    "CỘNG ĐỒNG SÔI ĐỘNG",
    "•",
    "ĐA DẠNG TRẠM SẠC",
    "•",
    "ƯỚC TÍNH CHI PHÍ",
    "•",
  ];

  return (
    <div className="marquee-container">
      <div className="marquee-track">
        {/* Double items for seamless infinite scroll */}
        {[...items, ...items, ...items].map((item, index) => (
          <div key={index} className="marquee-item">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
