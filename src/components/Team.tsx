import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';
import './Team.css';

const teamMembers = [
  { id: 1, name: "Nguyễn Văn A", role: "Trưởng Dự Án / CEO", image: "/team-1.jpg" },
  { id: 2, name: "Trần Thị B", role: "Giám Đốc Kỹ Thuật (CTO)", image: "/team-2.jpg" },
  { id: 3, name: "Lê Văn C", role: "Trưởng Bộ Phận Thiết Kế", image: "/team-3.jpg" },
  { id: 4, name: "Phạm Thị D", role: "Chuyên Viên Marketing", image: "/team-4.jpg" }
];

const Team: React.FC = () => {
  return (
    <section id="team" className="team-section">
      <div className="container">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-gradient">Đội Ngũ Của Chúng Tôi.</h2>
          <p>Những con người đứng đằng sau hệ sinh thái xe điện thông minh SCSGO.</p>
        </motion.div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <motion.div 
              key={member.id} 
              className="team-card glass-panel"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10 }}
            >
              <div className="team-avatar-wrapper">
                {/* Fallback gradient if image not found */}
                <div className="avatar-fallback">
                  {member.name.split(' ').pop()?.charAt(0)}
                </div>
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="team-avatar"
                  onError={(e) => {
                    // Hide image if not found, fallback will show underneath
                    e.currentTarget.style.opacity = '0';
                  }}
                />
              </div>
              
              <div className="team-info">
                <h3>{member.name}</h3>
                <span className="text-accent">{member.role}</span>
                
                <div className="team-social">
                  <a href="#" className="social-icon"><Linkedin size={18} /></a>
                  <a href="#" className="social-icon"><Twitter size={18} /></a>
                  <a href="#" className="social-icon"><Github size={18} /></a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
