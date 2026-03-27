import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Features.css';

const Features: React.FC = () => {
    
  return (
    <section id="features" className="features">
      <div className="container">
        <motion.div 
          className="features-header"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-gradient">Tính năng cốt lõi. Trải nghiệm trọn vẹn.</h2>
          <p>Chúng tôi cung cấp bộ công cụ tối ưu nhất giúp bạn thao tác đặt chỗ trạm sạc trơn tru và dễ dàng nhất.</p>
        </motion.div>
        
        <div className="features-grid">
          {[
            { icon: '🗺️', title: 'Bản Đồ EV Trực Tuyến', delay: 0 },
            { icon: '📅', title: 'Đặt Chỗ & Thanh Toán', delay: 0.2 },
            { icon: '💬', title: 'Cộng Đồng Người Dùng', delay: 0.4 }
          ].map((feature, i) => (
             <motion.div 
               className="feature-card"
               key={i}
               initial={{ opacity: 0, y: 100, scale: 0.9 }}
               whileInView={{ opacity: 1, y: 0, scale: 1 }}
               viewport={{ once: true, margin: "-50px" }}
               transition={{ duration: 0.7, delay: feature.delay, type: "spring", bounce: 0.4 }}
               whileHover={{ y: -20, rotateX: 10, rotateY: -10 }}
             >
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>Từ việc lọc trạm sạc theo chuẩn (CCS, Type 2), xem đánh giá đến việc thanh toán tự động, mọi thứ đều sẵn sàng phục vụ bạn.</p>
             </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="feature-showcase"
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, type: "spring" }}
        >
          <div className="showcase-content">
            <h3>Theo dõi lộ trình và chi phí sạc.</h3>
            <p>Kiểm soát phần trăm pin còn lại, thời gian sạc đầy và ước tính số tiền phải trả ngay trên điện thoại khi bạn đang uống cafe một cách chính xác nhất.</p>
            <ul className="showcase-list">
              <li>Cập nhật tình trạng trạm sạc theo thời gian thực</li>
              <li>Tự động thông báo khi sạc đầy</li>
              <li>Lưu trữ lịch sử sạc minh bạch trên Cloud</li>
            </ul>
          </div>
          <motion.div 
            className="showcase-image"
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
             <div className="mockup-wrapper small">
                <img src="/features_mockup.png" alt="Charging Status" />
             </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Features;
