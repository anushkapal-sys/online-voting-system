import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#EDE9FE', '#F3E8FF'];

const ResultsModal = ({ poll, open, onClose }) => {
  if (!poll || !poll.options_data) return null;

  const pieData = poll.options_data.map(item => ({
    name: item.optionname,
    value: item.votes || 0,
    fill: COLORS[Math.floor(Math.random() * COLORS.length)]
  }));

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="modal-overlay"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            className="modal-content"
            onClick={e => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>{poll.title}</h2>
                <div className="poll-stats">
                  <span>{poll.total_votes || 0} total votes</span>
                  <div className={`status-badge live`}>Live Results</div>
                </div>
              <button className="close-btn" onClick={onClose}>
                <X size={24} />
              </button>
            </div>
            </div>

            <div className="modal-body">
              <div className="charts-grid">
                <div className="chart-container">
                  <h4><Crown size={20} /> Vote Distribution</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        nameKey="name"
                        label
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h4><TrendingUp size={20} /> Detailed Results</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={poll.options_data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="optionname" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="votes" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="leaderboard">
                <h4>🥇 Leaderboard</h4>
                {poll.options_data
                  ?.sort((a, b) => (b.votes || 0) - (a.votes || 0))
                  .slice(0, 3)
                  .map((option, index) => (
                    <div key={option.optionid} className="leader-item">
                      <span className="rank">{index + 1}.</span>
                      <span className="option-name">{option.optionname}</span>
                      <span className="votes">{option.votes || 0} votes</span>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ResultsModal;