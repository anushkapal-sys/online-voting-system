import React from 'react';
import { motion } from 'framer-motion';
import { Users, Shield, CheckCircle, Download, Activity, Clock } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, subtitle }) => (
  <motion.div 
    className="feature-card"
    whileHover={{ y: -5, scale: 1.02 }}
  >
    <Icon size={40} />
    <h4>{title}</h4>
    <p>{subtitle}</p>
  </motion.div>
);

const SecurityFeature = ({ icon: Icon, title }) => (
  <motion.div 
    className="security-feature"
    whileHover={{ x: 5 }}
  >
    <Icon size={24} />
    <span>{title}</span>
  </motion.div>
);

const ActivityItem = ({ activity }) => (
  <motion.div 
    className="activity-item"
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
  >
    <div className="activity-dot"></div>
    <span>{activity} • 2 mins ago</span>
  </motion.div>
);

export { FeatureCard, SecurityFeature, ActivityItem };