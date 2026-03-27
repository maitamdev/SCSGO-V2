import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, MessageSquare } from 'lucide-react';
import '../components/Team.css';

const teamMembers = [
  { id: 1, name: "Nguyễn Văn A", role: "Giám Đốc Kỹ Thuật (CTO)", image: "/team-1.jpg" },
  { id: 2, name: "Trần Thế B", role: "Kiến Trúc Sư Phần Mềm", image: "/team-2.jpg" },
  { id: 3, name: "Lý Đình C", role: "Chuyên Gia Dữ Liệu", image: "/team-3.jpg" },
  { id: 4, name: "Phạm Minh D", role: "Thiết Kế Trải Nghiệm", image: "/team-4.jpg" },
  { id: 5, name: "Hoàng Lê E", role: "Trưởng Nhóm Marketing", image: "/team-5.jpg" }
];

const TeamPage: React.FC = () => {
  return (
    <main className="pt-24 min-h-screen">
      <section className="team-section" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="container">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-gradient" style={{ marginBottom: "2rem" }}>Ban Điều Hành & Đội Ngũ</h1>
            <p style={{ margin: "0 auto 4rem", maxWidth: "800px", fontSize: "1.2rem", color: "var(--text-secondary)" }}>
              SCSGO được xây dựng và phát triển bởi 5 chuyên gia với hơn 10 năm kinh nghiệm trong lĩnh vực xe điện, hệ thống hạ tầng và công nghệ thông tin. Chúng tôi tin rằng tương lai thực thụ nằm ở sự dịch chuyển thông minh mang tính kết nối. Mình cùng tiến bước!
            </p>
          </motion.div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className="team-card glass-panel"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
              >
                <div className="team-avatar-wrapper">
                  <div className="avatar-fallback">
                    {member.name.split(' ').pop()?.charAt(0)}
                  </div>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="team-avatar"
                    onError={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                </div>
                
                <div className="team-info">
                  <h3 style={{ fontSize: "1.4rem" }}>{member.name}</h3>
                  <span className="text-accent" style={{ fontSize: "1.1rem" }}>{member.role}</span>
                  
                  <div className="team-social">
                    <a href="#" className="social-icon"><Mail size={20} /></a>
                    <a href="#" className="social-icon"><Globe size={20} /></a>
                    <a href="#" className="social-icon"><MessageSquare size={20} /></a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            style={{ marginTop: "6rem" }}
          >
            <a href="/" className="btn btn-secondary">Quay lại Trang Chủ</a>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default TeamPage;
