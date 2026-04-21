import React from 'react';
import './Team.css';

const teamMembers = [
  { id: 1, name: "Sơn Hoàng Hiếu", role: "Founder (CEO)", img: "/hieu.jpg" },
  { id: 2, name: "Vũ Thị Thơm", role: "Co-founder (CMO)", img: "/thom.jpg" },
  { id: 3, name: "Ng. Thị Bích Trâm", role: "Co-founder (CCO)", img: "/tram.jpg" },
  { id: 4, name: "Bùi Thị Tuyên", role: "Co-founder (CFO)", img: "/tuyen.jpg" },
  { id: 5, name: "Mai T. Thiện Tâm", role: "Co-founder (CTO)", img: "/tam.jpg" },
  { id: 6, name: "Trần Biểu", role: "Co-founder (COO)", img: "/bieu.jpg" }
];

const Team: React.FC = () => {
  return (
    <section className="qq-team-section">
      <div className="container">
        <div className="team-header-box text-center">
          <div className="qq-badge">ĐỘI NGŨ SCSGO</div>
          <h2 className="qq-team-title">Gương Mặt Thương Hiệu</h2>
          <p className="qq-team-subtitle">Những con người nhiệt huyết đứng sau sự thành công của trạm sạc thông minh.</p>
        </div>

        <div className="qq-team-grid">
          {teamMembers.map((member) => (
            <div key={member.id} className="qq-team-card">
              <div className="avatar-wrapper">
                <img src={member.img} alt={member.name} className="qq-avatar" />
                <div className="avatar-bubble b1"></div>
                <div className="avatar-bubble b2"></div>
              </div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="qq-role">{member.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
