import React from 'react';
import './Testimonials.css';

const Testimonials: React.FC = () => {
  const reviews = [
    { text: "Ứng dụng sạc EV gọn gàng và nhanh nhất tôi từng dùng. Cực kỳ thông minh.", author: "Tạp chí Xe Tương Lai" },
    { text: "Đơn giản là nó hoạt động hoàn hảo. Không có tính năng thừa thãi, chỉ tập trung đúng vào thứ bạn cần.", author: "Cộng đồng Xe Điện VN" },
    { text: "Một luồng gió mới giữa thị trường các ứng dụng sạc cồng kềnh, chậm chạp.", author: "Tech Review" }
  ];

  return (
    <section className="testimonials" id="reviews">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '4rem' }}>
          <div className="title-tag">Đánh giá</div>
        </div>
        
        <div className="testimonials-grid">
          {reviews.map((rev, idx) => (
            <div className="minimal-card review-card" key={idx}>
              <p className="review-text">"{rev.text}"</p>
              <div className="review-author">— {rev.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
