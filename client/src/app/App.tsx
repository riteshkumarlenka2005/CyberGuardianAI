
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import TrustedPartners from '../components/TrustedPartners';
import Home from '../pages/Home';
import Training from '../pages/Training';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import About from '../pages/About';
import Resources from '../pages/Resources';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import AuthCallback from '../pages/AuthCallback';
import VerifyEmail from '../pages/VerifyEmail';
import ScrollToTop from '../components/ScrollToTop';
import authService from '../services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return authService.isAuthenticated();
  });
  const [userRole, setUserRole] = useState<string>(() => {
    const user = authService.getCurrentUser();
    return (user as any)?.role || 'user';
  });
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleLogin = () => {
    setIsAuthenticated(true);
    const user = authService.getCurrentUser();
    setUserRole((user as any)?.role || 'user');
  };

  const handleLogout = () => {
    authService.clearAuth();
    setIsAuthenticated(false);
    setUserRole('user');
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* OAuth Callback Route */}
            <Route path="/auth/callback" element={<AuthCallback onLogin={handleLogin} />} />

            {/* Protected Routes */}
            <Route
              path="/training"
              element={isAuthenticated ? <Training /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated
                ? (userRole === 'admin' ? <AdminDashboard /> : <Dashboard />)
                : <Navigate to="/login" />}
            />
            <Route
              path="/admin"
              element={isAuthenticated && userRole === 'admin'
                ? <AdminDashboard />
                : <Navigate to="/dashboard" />}
            />
          </Routes>
        </main>
        <TrustedPartners />
        <Footer isDarkMode={isDarkMode} />
      </div>
    </Router>
  );
};

export default App;
