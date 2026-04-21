import React, { useEffect, useState } from 'react';
import './Hero.css';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [battery, setBattery] = useState(25);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Fast charging effect: runs from 25 to 100 and stops
    const batteryInterval = setInterval(() => {
      setBattery(prev => {
        if (prev >= 100) {
          clearInterval(batteryInterval);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 3) + 1;
        if (next >= 100) {
          clearInterval(batteryInterval);
          return 100;
        }
        return next;
      });
    }, 40); // 40ms per tick makes it even smoother

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
                {/* Tech wire connecting the stats to the floor */}
                <svg className="sleek-energy-wire" viewBox="0 0 100 200" preserveAspectRatio="none">
                  <path className="sleek-wire-base" d="M 10 10 L 10 150 Q 10 180 50 180 L 100 180" />
                  <path className="sleek-wire-flow" d="M 10 10 L 10 150 Q 10 180 50 180 L 100 180" />
                </svg>
                
                <div className="vf7-battery-stats">{battery}%</div>
                <div className="vf7-status-text">CHARGING VF7...</div>
                
                {/* Animated tech progress bar / battery indicator */}
                <div className="vf7-charge-bar">
                  <div className="vf7-charge-fill" style={{ width: `${battery}%` }}></div>
                </div>
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
