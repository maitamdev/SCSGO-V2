import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Briefcase, Lightbulb, Wrench, User, ChevronLeft } from 'lucide-react';
import '../components/Team.css';

const teamMembers = [
  { id: 1, name: "Sơn Hoàng Hiếu", role: "Founder (CEO) - Giám đốc điều hành", image: "/hieu.jpg", stat1: "ĐH Nguyễn Tất Thành - Quản trị KD", stat2: "MSSV: 2200012147", icon1: <Briefcase size={16} color="#1e40af"/>, icon2: <User size={16} color="#d97706"/> },
  { id: 2, name: "Vũ Thị Thơm", role: "Co-founder (CMO) - Giám đốc tiếp thị", image: "/thom.jpg", stat1: "ĐH Nguyễn Tất Thành - Quản trị KD", stat2: "MSSV: 2311559764", icon1: <Briefcase size={16} color="#3b82f6"/>, icon2: <User size={16} color="#d97706"/> },
  { id: 3, name: "Ng. Thị Bích Trâm", role: "Co-founder (CCO) - Giám đốc sáng tạo", image: "/tram.jpg", stat1: "ĐH Nguyễn Tất Thành - Quản trị KD", stat2: "MSSV: 2311553463", icon1: <Lightbulb size={16} color="#1e40af"/>, icon2: <User size={16} color="#d97706"/> },
  { id: 4, name: "Bùi Thị Tuyên", role: "Co-founder (CFO) - Giám đốc tài chính", image: "/tuyen.jpg", stat1: "ĐH Công Nghiệp TP.HCM - Quản trị KD", stat2: "MSSV: 22703911", icon1: <Briefcase size={16} color="#1e40af"/>, icon2: <User size={16} color="#d97706"/> },
  { id: 5, name: "Mai T. Thiện Tâm", role: "Co-founder (CTO) - Giám đốc công nghệ", image: "/tam.jpg", stat1: "Đại học Hùng Vương TP.HCM - Kỹ Thuật CN", stat2: "MSSV: 2305CT2070", icon1: <Wrench size={16} color="#3b82f6"/>, icon2: <User size={16} color="#d97706"/> },
  { id: 6, name: "Trần Biểu", role: "Co-founder (COO) - Giám đốc vận hành", image: "/bieu.jpg", stat1: "Đại Học Văn Hiến - Kinh Tế Quản Trị", stat2: "MSSV: 231A230072", icon1: <Briefcase size={16} color="#1e40af"/>, icon2: <User size={16} color="#d97706"/> }
];

const FbIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none" style={{ background: '#3b5998', borderRadius: '4px', padding: '2px' }}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="none" style={{ background: '#0077b5', borderRadius: '4px', padding: '2px' }}>
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.39h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94V10.11H5.49v8.39h2.78z"></path>
  </svg>
);

const MailIconWrapper = () => (
  <div style={{ background: '#9ca3af', borderRadius: '4px', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
     <Mail size={12} color="white" />
  </div>
);

const TeamPage: React.FC = () => {
  return (
    <main className="team-page-wrapper">
      <section className="classic-team-section">
        <div className="container" style={{ maxWidth: '1200px' }}>
          
          <div className="classic-header text-center">
            <h1>ĐỘI NGŨ CỦA CHÚNG TÔI</h1>
            <div className="classic-subtitle">
              <span></span>
              <p>Meet Our Team</p>
              <span></span>
            </div>
            <p className="classic-desc">
              Chúng tôi gồm những chuyên gia giàu kinh nghiệm, tận tâm và sáng tạo trong lĩnh vực của mình.
            </p>
          </div>

          <div className="classic-team-grid">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="classic-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
              >
                <div className="classic-image-wrapper">
                  <div className="classic-fallback">
                    <User size={64} color="#d1d5db" />
                  </div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="classic-image"
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  />
                </div>
                
                <div className="classic-info">
                  <h3>{member.name}</h3>
                  <div className="classic-divider"></div>
                  <span className="classic-role">{member.role}</span>
                  
                  <div className="classic-stats">
                    <div className="stat-item">
                      {member.icon1}
                      <span>{member.stat1}</span>
                    </div>
                    <div className="stat-item">
                      {member.icon2}
                      <span>{member.stat2}</span>
                    </div>
                  </div>

                  <div className="classic-divider" style={{ margin: '1rem 0' }}></div>
                  
                  <div className="classic-footer">
                    <div className="classic-social">
                      <a href="#"><FbIcon /></a>
                      <a href="#"><InIcon /></a>
                      <a href="#"><MailIconWrapper /></a>
                    </div>
                    <button className="classic-btn">Xem Thêm</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '4rem' }}>
            <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.75rem 2rem' }}>
              <ChevronLeft size={20} /> Quay lại App
            </a>
          </div>

        </div>
      </section>
    </main>
  );
};

export default TeamPage;
