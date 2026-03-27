import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, CalendarCheck, Zap } from 'lucide-react';
import './HowItWorks.css';

const steps = [
  {
    icon: <MapPin size={32} />,
    image: "/step1.png",
    title: "1. Tìm Trạm Sạc",
    desc: "Mở ứng dụng và xem bản đồ thời gian thực. Lọc theo chuẩn sạc, công suất, và tình trạng chỗ trống ngay lập tức."
  },
  {
    icon: <CalendarCheck size={32} />,
    image: "/step2.png",
    title: "2. Đặt Chỗ Sạc",
    desc: "Chọn khung giờ phù hợp và đặt chỗ trước. Trạm sạc sẽ giữ chỗ cho bạn, không còn phải lo lắng đến nơi hết trụ."
  },
  {
    icon: <Zap size={32} />,
    image: "/step3.png",
    title: "3. Cắm Sạc & Thư Giãn",
    desc: "Kết nối xe vào trụ sạc. Theo dõi phần trăm pin, ước tính chi phí và thời gian ngay trên điện thoại khi bạn uống cafe."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <motion.div 
          className="hiw-header text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gradient">3 Bước Đơn Giản.</h2>
          <p>Trải nghiệm sạc xe điện chưa bao giờ dễ dàng và mượt mà đến thế.</p>
        </motion.div>

        <div className="hiw-grid">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="hiw-card glass-panel"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="hiw-image-wrapper">
                <img src={step.image} alt={step.title} className="hiw-image" />
                <div className="hiw-icon">
                  {step.icon}
                </div>
              </div>
              <h3 className="text-primary">{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
