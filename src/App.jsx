import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8B5CF6', // Purple
    },
    secondary: {
      main: '#F3E8FF', // Light Purple
    },
    background: {
      default: '#0F0F23',
      paper: '#1A1A2E',
    },
  },
  typography: {
    fontFamily: "'Poppins', sans-serif",
    h1: { fontWeight: 800 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
  },
});

// Set the base URL for all API requests to the backend
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogin = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Toaster position="top-right" />
          <Routes>
            <Route 
              path="/login" 
              element={!token ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/dashboard" 
              element={token ? <Dashboard token={token} onLogout={handleLogout} /> : <Navigate to="/login" />} 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;