
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import TrustedPartners from '../components/TrustedPartners';
import Home from '../pages/Home';
import Training from '../pages/Training';
import Dashboard from '../pages/Dashboard';
import About from '../pages/About';
import Resources from '../pages/Resources';
import Gallery from '../pages/Gallery';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ScrollToTop from '../components/ScrollToTop';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar
          isAuthenticated={isAuthenticated}
          onLogout={() => setIsAuthenticated(false)}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route path="/signup" element={<Signup onSignup={() => setIsAuthenticated(true)} />} />

            {/* Protected Routes */}
            <Route
              path="/training"
              element={isAuthenticated ? <Training /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
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
