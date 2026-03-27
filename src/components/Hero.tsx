import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './Hero.css';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Scroll animations
  const yElement = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacityElement = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const rotateMockup = useTransform(scrollYProgress, [0, 1], [15, 0]);
  const scaleMockup = useTransform(scrollYProgress, [0, 1], [1, 1.2]);

  // Smooth mouse tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // -10 to 10 degrees
    const y = (clientY / innerHeight - 0.5) * -20; // -10 to 10 degrees
    setMousePosition({ x, y });
  };

  const titleText = "Xe Điện Của Bạn.";

  return (
    <section 
      className="hero" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      <div className="container hero-container text-center">
        <motion.div 
          className="hero-content"
          style={{ y: yElement, opacity: opacityElement }}
        >
          
          <motion.div 
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="badge-glow"></span>
            <span className="badge-text" style={{ color: '#fff' }}>SCSGO v3.0 - Bản cập nhật mới nhất</span>
          </motion.div>

          <motion.img 
            src="/logo.jpg" 
            alt="SCSGO App Logo" 
            className="hero-app-logo"
            initial={{ opacity: 0, y: -50, rotate: -20 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          />

          <h1>
            Giải Pháp Toàn Diện Cho <br/>
            <span className="text-accent-gradient">
              {titleText.split('').map((char, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          </h1>
          
          <motion.p 
            className="subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            Từ việc tìm kiếm trạm sạc nhanh nhất đến đặt lịch và thanh toán tiện lợi. Mọi thứ bạn cần cho chuyến đi tiếp theo đều nằm gọn trong ứng dụng SCSGO.
          </motion.p>
          
          <motion.div 
            className="hero-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <a href="#download" className="btn btn-primary">Tải Ứng Dụng Ngay</a>
            <a href="#features" className="btn btn-secondary">Xem Tính Năng</a>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="hero-mockup-container"
          initial={{ opacity: 0, y: 150 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, type: "spring", damping: 20 }}
          style={{ 
            rotateX: mousePosition.y || rotateMockup,
            rotateY: mousePosition.x,
            scale: scaleMockup
          }}
        >
          <div className="hero-mockup-glow"></div>
          <img src="/hero_mockup.png" alt="SCSGO App Interface" className="mockup-img-huge" />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
