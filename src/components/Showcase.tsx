import React, { useState, useEffect, useCallback } from 'react';
import './Showcase.css';

interface ScreenItem {
  id: string;
  src: string;
  title: string;
  desc: string;
  step: string;
}

const screens: ScreenItem[] = [
  {
    id: 'map',
    src: '/screenshots/screen_map.jpg',
    title: 'Bản đồ trạm sạc',
    desc: 'Tìm trạm sạc gần nhất với bộ lọc theo danh mục — chỉ trong 1 chạm',
    step: '01',
  },
  {
    id: 'charger',
    src: '/screenshots/screen_charger_type.jpg',
    title: 'Chọn loại sạc',
    desc: 'AC hay DC? Chọn loại phù hợp với xe, xem ngay số chỗ trống',
    step: '02',
  },
  {
    id: 'slot',
    src: '/screenshots/screen_slot_select.jpg',
    title: 'Chọn chỗ sạc',
    desc: 'Xem trạng thái realtime — Trống, Đang sạc hay Bảo trì',
    step: '03',
  },
  {
    id: 'confirm',
    src: '/screenshots/screen_booking_confirm.jpg',
    title: 'Xác nhận đặt chỗ',
    desc: 'Tóm tắt đầy đủ: trạm, loại sạc, thời gian & ước tính giá',
    step: '04',
  },
  {
    id: 'feed',
    src: '/screenshots/screen_feed.jpg',
    title: 'Cộng đồng EV',
    desc: 'Review & chia sẻ kinh nghiệm từ cộng đồng tài xế điện',
    step: '05',
  },
];

const Showcase: React.FC = () => {
  const [active, setActive] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold: 0.1 }
    );
    const el = document.getElementById('app-showcase');
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((index: number) => {
    if (isTransitioning || index === active) return;
    setIsTransitioning(true);
    setActive(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [active, isTransitioning]);

  const prev = () => goTo((active - 1 + screens.length) % screens.length);
  const next = () => goTo((active + 1) % screens.length);

  useEffect(() => {
    if (!isVisible) return;
    const timer = setInterval(() => {
      setActive(prev => (prev + 1) % screens.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isVisible, active]);

  const getPosition = (index: number) => {
    const diff = index - active;
    const total = screens.length;
    let nd = diff;
    if (diff > total / 2) nd = diff - total;
    if (diff < -total / 2) nd = diff + total;
    if (nd === 0) return 'center';
    if (nd === 1) return 'right-1';
    if (nd === -1) return 'left-1';
    if (nd === 2) return 'right-2';
    if (nd === -2) return 'left-2';
    return 'hidden';
  };

  return (
    <section
      id="app-showcase"
      className={`app-showcase ${isVisible ? 'visible' : ''}`}
    >
      {/* Gradient orbs */}
      <div className="sc-orb sc-orb-1" />
      <div className="sc-orb sc-orb-2" />
      <div className="sc-orb sc-orb-3" />

      {/* Header */}
      <div className="sc-header">
        <p className="sc-overline">TRẢI NGHIỆM ỨNG DỤNG</p>
        <h2 className="sc-title">
          Mọi thứ bạn cần,<br />
          <span className="sc-title-accent">ngay trong SCSGO</span>
        </h2>
        <p className="sc-lead">
          5 bước đơn giản từ tìm trạm đến đặt chỗ sạc xe điện
        </p>
      </div>

      {/* 3D Carousel */}
      <div className="sc-stage">
        <button className="sc-arrow sc-arrow-prev" onClick={prev} aria-label="Previous">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button className="sc-arrow sc-arrow-next" onClick={next} aria-label="Next">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        <div className="sc-phones">
          {screens.map((screen, index) => (
            <div
              key={screen.id}
              className={`sc-phone pos-${getPosition(index)}`}
              onClick={() => goTo(index)}
            >
              <div className="sc-device">
                <div className="sc-dynamic-island" />
                <div className="sc-screen">
                  <img src={screen.src} alt={screen.title} draggable={false} />
                </div>
                {/* Edge highlight */}
                <div className="sc-edge-light" />
              </div>
            </div>
          ))}
        </div>
        {/* Floor reflection */}
        <div className="sc-floor" />
      </div>

      {/* Info bar */}
      <div className="sc-info-bar">
        <span className="sc-step-num">{screens[active].step}</span>
        <div className="sc-info-text">
          <h3>{screens[active].title}</h3>
          <p>{screens[active].desc}</p>
        </div>
      </div>

      {/* Tab nav */}
      <div className="sc-tabs">
        {screens.map((screen, index) => (
          <button
            key={screen.id}
            className={`sc-tab ${active === index ? 'active' : ''}`}
            onClick={() => goTo(index)}
          >
            <span className="sc-tab-num">{screen.step}</span>
            <span className="sc-tab-label">{screen.title}</span>
            {active === index && <div className="sc-tab-progress" />}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Showcase;
