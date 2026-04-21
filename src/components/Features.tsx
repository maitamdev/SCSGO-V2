import React from 'react';
import './Features.css';

const Features: React.FC = () => {
  return (
    <section className="qq-features">
      <div className="container">
        <div className="qq-grid-2">
          
          <div className="qq-card card-green">
            <h2 className="qq-card-title">Đăng ký lên SCSGO</h2>
            <p className="qq-card-desc">Hợp tác cùng nền tảng xe điện hàng đầu và mở rộng mạng lưới trạm sạc của bạn.</p>
            <a href="#" className="btn btn-green">ĐĂNG KÝ TRẠM SẠC</a>
          </div>

          <div className="qq-card card-orange">
            <h2 className="qq-card-title">Bạn cần hỗ trợ?</h2>
            <p className="qq-card-desc">Tham gia hệ sinh thái và nhận hỗ trợ kỹ thuật 24/7 từ chuyên gia.</p>
            <div className="qq-card-actions">
              <a href="#" className="btn btn-orange">TỔNG ĐÀI HỖ TRỢ</a>
              <a href="#" className="btn btn-white">KẾT NỐI ZALO OA</a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Features;
