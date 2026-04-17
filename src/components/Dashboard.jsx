import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  motion, 
  AnimatePresence 
} from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  Users, 
  BarChart3, 
  Activity, 
  Award, 
  Clock, 
  Shield, 
  Zap, 
  TrendingUp,
  Vote,
  Download,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import Sidebar from './Sidebar';
import ResultsModal from './ResultsModal';
import CreatePollModal from './CreatePollModal';
import { FeatureCard, SecurityFeature, ActivityItem } from './HelperComponents';

const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#EDE9FE', '#F3E8FF'];

const Dashboard = ({ token, onLogout }) => {
  const [polls, setPolls] = useState([]);
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const response = await axios.get('/api/polls');
      setPolls(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to fetch polls');
      if (error.response?.status === 401) {
        onLogout();
        navigate('/login');
      }
    }
  };

  const sections = [
    { id: 'overview', icon: BarChart3, label: 'Overview', color: '#8B5CF6' },
    { id: 'live-polls', icon: Vote, label: 'Live Polls', color: '#A78BFA' },
    { id: 'results', icon: TrendingUp, label: 'Results', color: '#C4B5FD' },
    { id: 'analytics', icon: Activity, label: 'Analytics', color: '#EDE9FE' },
    { id: 'users', icon: Users, label: 'Users', color: '#F3E8FF' },
    { id: 'security', icon: Shield, label: 'Security', color: '#8B5CF6' },
    { id: 'activity', icon: Clock, label: 'Activity', color: '#A78BFA' },
  ];

  const stats = [
    { label: 'Total Polls', value: polls.length, icon: Vote, color: '#8B5CF6' },
    { label: 'Active Votes', value: polls.reduce((sum, poll) => sum + parseInt(poll.total_votes || 0, 10), 0), icon: Users, color: '#A78BFA' },
    { label: 'Avg Participation', value: `${Math.round(polls.reduce((sum, poll) => sum + parseInt(poll.total_votes || 0, 10), 0) / Math.max(polls.length, 1))}%`, icon: TrendingUp, color: '#C4B5FD' },
  ];

  const overviewData = polls.map(poll => ({
    name: poll.title.slice(0, 20) + '...',
    votes: poll.total_votes || 0,
    active: poll.status === 'active'
  }));

  return (
    <div className="dashboard">
      <Sidebar 
        sections={sections}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={onLogout}
      />
      
      <div className="main-content">
        <header className="dashboard-header">
          <div>
            <h1 className="dashboard-title">
              <Zap className="inline-icon" size={32} /> Voting Dashboard
            </h1>
            <p className="dashboard-subtitle">Real-time analytics & poll management</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="create-poll-btn"
            onClick={() => setShowCreateModal(true)}
          >
            <Award size={20} /> Create New Poll
          </motion.button>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="content-section"
          >
            {activeSection === 'overview' && (
              <OverviewSection stats={stats} overviewData={overviewData} polls={polls} />
            )}
            {activeSection === 'live-polls' && (
              <LivePollsSection polls={polls} onViewResults={(poll) => {
                setSelectedPoll(poll);
                setShowResultsModal(true);
              }} />
            )}
            {activeSection === 'results' && (
              <ResultsSection polls={polls} />
            )}
            {activeSection === 'analytics' && (
              <AnalyticsSection polls={polls} />
            )}
            {activeSection === 'users' && (
              <UsersSection />
            )}
            {activeSection === 'security' && (
              <SecuritySection />
            )}
            {activeSection === 'activity' && (
              <ActivitySection />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <ResultsModal
        poll={selectedPoll}
        open={showResultsModal}
        onClose={() => setShowResultsModal(false)}
      />
      <CreatePollModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onPollCreated={fetchPolls}
      />
    </div>
  );
};

// Sub-components for each section
const OverviewSection = ({ stats, overviewData, polls }) => (
  <div className="overview-grid">
    <div className="stats-grid">
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="stat-card"
          style={{ '--primary-color': stat.color }}
        >
          <div className="stat-icon">
            <stat.icon size={40} />
          </div>
          <div>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        </motion.div>
      ))}
    </div>

    <div className="chart-container">
      <div className="chart-card">
        <h3>📊 Poll Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={overviewData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="votes" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const LivePollsSection = ({ polls, onViewResults }) => (
  <div className="polls-grid">
    {polls.map((poll) => (
      <motion.div
        key={poll.pollid}
        whileHover={{ y: -5 }}
        className="poll-card"
      >
        <div className="poll-header">
          <h4>{poll.title}</h4>
          <div className={`status-badge ${poll.status}`}>
            {poll.status === 'active' ? 'Live' : 'Closed'}
          </div>
        </div>
        <div className="poll-stats">
          <span>{poll.total_votes || 0} votes</span>
          <span>{new Date(poll.startdate).toLocaleDateString()}</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="view-results-btn"
          onClick={() => onViewResults(poll)}
        >
          View Results <TrendingUp size={16} />
        </motion.button>
      </motion.div>
    ))}
  </div>
);

const ResultsSection = ({ polls }) => (
  <div className="results-section">
    <h3>🏆 Latest Results</h3>
    {polls.slice(0, 3).map((poll) => (
      <div key={poll.pollid} className="result-item">
        <h4>{poll.title}</h4>
        <div className="pie-chart-container">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={poll.options_data || []}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="votes"
                nameKey="optionname"
              >
                {poll.options_data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    ))}
  </div>
);

const AnalyticsSection = ({ polls }) => (
  <div className="analytics-section">
    <h3>📈 Advanced Analytics</h3>
    <div className="chart-grid">
      <div className="chart-card">
        <h4>Vote Trends</h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={polls}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="title" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total_votes" stroke="#8B5CF6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);

const UsersSection = () => (
  <div className="users-section">
    <h3>👥 User Management</h3>
    <div className="feature-grid">
      <FeatureCard icon={Users} title="500+" subtitle="Total Users" />
      <FeatureCard icon={Shield} title="100%" subtitle="Secure Auth" />
      <FeatureCard icon={CheckCircle} title="No Duplicates" subtitle="Vote Protection" />
    </div>
  </div>
);

const SecuritySection = () => (
  <div className="security-section">
    <h3>🔒 Security Features</h3>
    <div className="security-features">
      <SecurityFeature icon={Shield} title="JWT Authentication" />
      <SecurityFeature icon={CheckCircle} title="Duplicate Vote Prevention" />
      <SecurityFeature icon={Clock} title="Vote Timestamps" />
      <SecurityFeature icon={Download} title="Audit Logs" />
    </div>
  </div>
);

const ActivitySection = () => (
  <div className="activity-section">
    <h3>📋 Recent Activity</h3>
    <div className="activity-feed">
      {['User voted on poll', 'New poll created', 'Poll results updated'].map((activity, i) => (
        <ActivityItem key={i} activity={activity} />
      ))}
    </div>
  </div>
);

export default Dashboard;