import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import './Testimonials.css';

const reviews = [
  {
    name: "Hoàng Long",
    car: "VinFast VF8",
    content: "Ứng dụng tuyệt vời! Từ ngày có SCSGO mình đi xa không còn lo lắng vụ tìm trạm sạc nữa. Đặt chỗ trước siêu tiện lợi.",
    rating: 5
  },
  {
    name: "Minh Anh",
    car: "Porsche Taycan",
    content: "Giao diện đỉnh cao, mượt mà. Đã thử rất nhiều app nhưng SCSGO là app duy nhất cập nhật trạng thái sạc realtime chính xác nhất.",
    rating: 5
  },
  {
    name: "Đức Trí",
    car: "Hyundai Ioniq 5",
    content: "Cộng đồng rất thân thiện, hay share các trạm sạc có quán cafe chill. Chức năng thanh toán qua app cũng là một điểm cộng lớn.",
    rating: 4
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="community" className="testimonials">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gradient">Được tin dùng bởi 10,000+ tài xế.</h2>
          <p>Cộng đồng xe điện lớn mạnh và gắn kết nhất tại Việt Nam.</p>
        </motion.div>

        <div className="testimonials-grid">
          {reviews.map((review, index) => (
            <motion.div 
              key={index} 
              className="testimonial-card glass-panel"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="stars">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={20} fill="var(--accent-primary)" color="var(--accent-primary)" />
                ))}
              </div>
              <p className="testimonial-content">"{review.content}"</p>
              <div className="testimonial-author">
                <div className="author-avatar">{review.name.charAt(0)}</div>
                <div className="author-info">
                  <h4>{review.name}</h4>
                  <span>Lái xe {review.car}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
