import React from 'react';
import { motion } from 'framer-motion';
import './Showcase.css';

const Showcase: React.FC = () => {
  return (
    <section className="showcase">
      <div className="container">
        <div className="showcase-bento">
          
          <motion.div 
            className="bento-box large-box photo-box"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <img src="/ev_car.png" alt="Electric Vehicle driving" className="bento-img" />
            <div className="bento-content overlay">
              <h3>Hành Trình Xanh & Thông Minh</h3>
              <p>Tự tin di chuyển khắp cả nước với dữ liệu trạm sạc cập nhật liên tục.</p>
            </div>
          </motion.div>

          <motion.div 
            className="bento-box small-box photo-box glow-edge"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <img src="/charging_station.png" alt="Modern Charging Station" className="bento-img" />
            <div className="bento-content overlay">
              <h3>Hạ Tầng Sạc Nhanh</h3>
              <p>Tìm kiếm trạm sạc với công nghệ hiện đại nhất.</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bento-box small-box text-box glass-panel"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h3 className="text-gradient">Cộng đồng EV đa dạng</h3>
            <p>Tương tác, đánh giá và chia sẻ điểm sạc cùng hàng ngàn tài xế khác từ dòng VinFast, Porsche, Hyundai đến Audi.</p>
            <div className="btn-group mt-auto">
              <a href="#download" className="btn btn-secondary btn-sm">Tham Gia Ngay</a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Showcase;
