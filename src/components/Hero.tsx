import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [battery, setBattery] = useState(25);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Battery random ticker up to 80
    const batteryInterval = setInterval(() => {
      setBattery(prev => {
        if (prev < 80) {
          const next = prev + Math.floor(Math.random() * 2) + 1;
          return next > 80 ? 80 : next;
        }
        return 80;
      });
    }, 1500);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(batteryInterval);
    };
  }, []);

  return (
    <section className="qq-hero">
      {/* Background doodles with parallax effect */}
      <div 
        className="doodle-layer" 
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      >
        <div className="doodle doodle-1">⚡</div>
        <div className="doodle doodle-2">🚗</div>
        <div className="doodle doodle-3">🔋</div>
        <div className="doodle doodle-4">🔌</div>
        <div className="doodle doodle-5">✨</div>
        <div className="doodle doodle-6">📍</div>
      </div>
      
      {/* Cloud Blobs */}
      <div className="cloud-blob blob-1"></div>
      <div className="cloud-blob blob-2"></div>
      
      <div className="container hero-container position-relative">
        <div className="hero-grid">
          
          {/* Cột trái: Text Card */}
          <div className="hero-left-col">
            <div className="qq-hero-card fade-scale-in">
              <h1 className="qq-hero-title">TRẠM SẠC SCSGO<br/>GẦN ĐÂY</h1>
              <p className="qq-hero-subtitle">Mở app SCSGO là chạm ngay vào tiện ích sạc vạn năng!</p>
              
              <div className="qq-app-buttons">
                <a href="#" className="btn-app">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" />
                </a>
                <a href="#" className="btn-app">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Google Play" />
                </a>
              </div>
            </div>
          </div>

          {/* Cột phải: Animation Xe VF7 */}
          <div className="hero-right-col fade-scale-in delay-1">
            <div className="vf7-scene">
              <div className="vf7-overlay-ui">
                <div className="vf7-battery-stats">{battery}%</div>
                <div className="vf7-status-text">CHARGING VF7...</div>
              </div>

              <div className="vf7-car-wrapper">
                <img src="/vf7.png" alt="Vinfast VF7 EV" className="vf7-car-img" />
              </div>
              
              <div className="vf7-floor-glow"></div>
            </div>
          </div>

        </div>
      </div>

      <div className="bounce-arrow">
        ↓
      </div>
    </section>
  );
};

export default Hero;
