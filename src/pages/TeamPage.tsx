import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Globe, MessageSquare, ArrowRight } from 'lucide-react';
import '../components/Team.css';

const teamMembers = [
  { id: 1, name: "Nguyễn Văn A", role: "Giám Đốc Lãnh Đạo (CEO)", image: "/team-1.jpg", desc: "Định hướng tầm nhìn và dẫn dắt SCSGO trở thành mạng lưới trạm sạc lớn nhất Việt Nam.", highlight: true },
  { id: 2, name: "Trần Thế B", role: "Kiến Trúc Sư Phần Mềm", image: "/team-2.jpg", desc: "Thiết kế cốt lõi hạ tầng và hệ thống xử lý phân tán khổng lồ." },
  { id: 3, name: "Lý Đình C", role: "Trưởng Phòng Dữ Liệu", image: "/team-3.jpg", desc: "Tối ưu hoá thuật toán dẫn đường, bản đồ thông minh và xử lý dữ liệu sạc thời gian thực." },
  { id: 4, name: "Phạm Minh D", role: "Thiết Kế Trải Nghiệm", image: "/team-4.jpg", desc: "Đảm bảo mọi điểm chạm trên app đều mượt mà, trực quan chuẩn Apple." },
  { id: 5, name: "Hoàng Lê E", role: "Giám Đốc Marketing", image: "/team-5.jpg", desc: "Kiến tạo cộng đồng SCSGO gắn kết và bền vững nhất khu vực." }
];

const TeamPage: React.FC = () => {
  return (
    <main className="pt-24 min-h-screen">
      <section className="team-section" style={{ minHeight: 'calc(100vh - 200px)' }}>
        <div className="container">
          
          <motion.div 
            className="team-header-massive text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1>Sức Mạnh Phía Sau <br/><span className="text-accent-gradient">Kỷ Nguyên Mới.</span></h1>
            <p>5 bộ óc. 1 tầm nhìn. Hàng nghìn trạm sạc trong tương lai.</p>
          </motion.div>

          <div className="team-magazine-grid">
            {teamMembers.map((member, index) => (
              <motion.div 
                key={member.id} 
                className={`mag-card ${member.highlight ? 'mag-hero' : ''}`}
                initial={{ opacity: 0, scale: 0.95, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: index * 0.15, type: "spring" }}
              >
                <div className={`mag-image-wrapper fallback-bg-${member.id}`}>
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="mag-image"
                    onError={(e) => { e.currentTarget.style.opacity = '0'; }}
                  />
                  <div className="mag-overlay"></div>
                </div>
                
                <div className="mag-content">
                  <div className="mag-content-main">
                    <span className="mag-role">{member.role}</span>
                    <h3 className="mag-name">{member.name}</h3>
                  </div>
                  
                  <div className="mag-content-hover">
                    <p className="mag-desc">{member.desc}</p>
                    <div className="mag-social text-accent">
                      <a href="#"><Mail size={22} className="mag-icon" /></a>
                      <a href="#"><Globe size={22} className="mag-icon" /></a>
                      <a href="#"><MessageSquare size={22} className="mag-icon" /></a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="team-join-cta"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <div className="cta-content text-center">
              <h2>Bạn Đã Sẵn Sàng Trải Nghiệm?</h2>
              <a href="/" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Quay Trở Lại App <ArrowRight style={{ marginLeft: '10px' }} size={20} />
              </a>
            </div>
          </motion.div>

        </div>
      </section>
    </main>
  );
};

export default TeamPage;
