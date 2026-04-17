import React from 'react';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';

const Sidebar = ({ sections, activeSection, setActiveSection, onLogout }) => {
  return (
    <motion.div 
      className="sidebar"
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="sidebar-header">
        <h2>🗳️ VoteHub</h2>
        <p>Admin Panel</p>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <motion.button
            key={section.id}
            className={`nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => setActiveSection(section.id)}
            whileHover={{ scale: 1.05, x: 5 }}
            whileTap={{ scale: 0.98 }}
            style={{ '--color': section.color }}
          >
            <section.icon size={24} />
            <span>{section.label}</span>
          </motion.button>
        ))}
      </nav>

      <motion.button
        className="logout-btn"
        onClick={onLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <LogOut size={20} /> Logout
      </motion.button>
    </motion.div>
  );
};

export default Sidebar;