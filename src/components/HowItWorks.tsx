import React from 'react';
import './HowItWorks.css';

const HowItWorks: React.FC = () => {
  const steps = [
    { num: '01', title: 'Mở ứng dụng', desc: 'SCSGO tự động định vị và tìm các trạm sạc khả dụng gần bạn nhất.' },
    { num: '02', title: 'Chọn điểm đến', desc: 'Xem giá cả thời gian thực, loại súng sạc hỗ trợ và khoảng cách chính xác.' },
    { num: '03', title: 'Cắm & Sạc', desc: 'Giữ chỗ, cắm phích ô tô và thoải mái theo dõi tiến trình sạc ngay trên điện thoại.' }
  ];

  return (
    <section className="how-it-works" id="how-it-works">
      <div className="container">
        <div className="hiw-header text-center">
          <div className="title-tag">Cách thức hoạt động</div>
          <h2>Dễ như đếm 1, 2, 3.</h2>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-row" key={index}>
              <div className="step-number">{step.num}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
