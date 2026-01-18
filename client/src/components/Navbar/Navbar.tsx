
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  onLogout,
  isDarkMode,
  toggleTheme,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Threat Intel', path: '/training' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Resources', path: '/resources' },
    { name: 'About', path: '/about' },
  ];

  const gridColor = isDarkMode ? '#1e293b' : '#e5e7eb';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 font-sans">
      {/* BACKGROUND GRID (HUD STYLE) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px),
                              linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.25,
          }}
        />
      </div>

      {/* TOP & BOTTOM SYSTEM LINES */}
      <div className="absolute top-0 left-0 w-full h-px bg-black/40 dark:bg-white/40" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-black/40 dark:bg-white/40" />

      {/* CORNER HUD BRACKETS */}
      <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-black dark:border-white" />
      <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-black dark:border-white" />
      <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-black dark:border-white" />
      <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-black dark:border-white" />

      {/* MAIN NAV STRIP */}
      <div className="relative z-10 w-full h-20 flex items-stretch bg-white dark:bg-slate-950">

        {/* LEFT — CIRCULAR LOGO & BRAND TEXT */}
        <div className="relative flex-shrink-0 flex items-center pl-4 sm:pl-8">
          <Link to="/" className="flex items-center gap-3 sm:gap-5 group">
            <div className="relative flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-black dark:bg-white rounded-full border-4 border-white dark:border-slate-900 shadow-2xl transition-transform group-hover:scale-105">
              {/* SHIELD LOGO SVG */}
              <svg viewBox="0 0 100 100" className="w-9 h-9 sm:w-11 sm:h-11 text-white dark:text-black fill-current relative z-10">
                <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="none" />
                <path d="M50 25 C50 25 30 28 30 45 C30 65 50 80 50 80 C50 80 70 65 70 45 C70 28 50 25 50 25Z" fill="currentColor" />
                <path d="M40 48 L50 40 L60 48" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                <path d="M40 56 L50 48 L60 56" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                <path d="M40 64 L50 56 L60 64" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
              </svg>

              {/* Rotating ring */}
              <svg
                className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite] opacity-30"
                viewBox="0 0 100 100"
              >
                <path
                  d="M50 10a40 40 0 1 1 0 80a40 40 0 1 1 0-80"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="6 6"
                  className="text-white dark:text-black"
                />
              </svg>
            </div>
            <span className="text-black dark:text-white font-black text-sm sm:text-xl uppercase tracking-tighter">
              CyberGuardian AI
            </span>
          </Link>
        </div>

        {/* CENTER — NAV LINKS */}
        <div className="flex-grow flex items-center justify-center border-y-2 border-black dark:border-white">
          <div className="hidden md:flex items-center gap-10 relative">
            <div className="absolute -inset-x-6 top-1/2 h-6 -mt-3 border-l border-r border-black/20 dark:border-white/20" />

            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-xs uppercase tracking-[0.18em] font-bold py-2
                  ${
                    location.pathname === link.path
                      ? 'text-black dark:text-white'
                      : 'text-slate-500 dark:text-slate-400 hover:text-black dark:hover:text-white'
                  }`}
              >
                {link.name}
                <span
                  className={`absolute left-0 -bottom-1 h-[2px] bg-black dark:bg-white transition-all duration-300
                    ${
                      location.pathname === link.path
                        ? 'w-full'
                        : 'w-0 group-hover:w-full'
                    }`}
                />
              </Link>
            ))}
          </div>

          {/* MOBILE TOGGLE (HAMBURGER / CROSS) */}
          <div className="md:hidden flex items-center gap-4 px-4">
            <button
              className="text-black dark:text-white text-2xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* RIGHT — ANGLED ACTION BLOCK (DESKTOP) */}
        <div className="relative flex-shrink-0 hidden sm:block">
          <div
            className="h-full bg-black dark:bg-white flex items-center px-8 sm:px-12 gap-6 min-w-[280px]"
            style={{
              clipPath: 'polygon(2rem 0, 100% 0, 100% 100%, 0% 100%)',
            }}
          >
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="text-white dark:text-black text-lg hover:opacity-70"
            >
              {isDarkMode ? '☀' : '☾'}
            </button>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-xs font-bold uppercase tracking-widest text-white dark:text-black hover:underline"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="text-xs font-bold uppercase tracking-widest text-white/70 dark:text-black/70 hover:text-white dark:hover:text-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-widest text-white dark:text-black hover:underline"
                >
                  Log In
                </Link>
                <div className="w-px h-4 bg-white/30 dark:bg-black/30" />
                <Link
                  to="/signup"
                  className="text-xs font-bold uppercase tracking-widest text-white dark:text-black hover:scale-105 transition-transform"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={`fixed inset-0 z-40 bg-white dark:bg-slate-950 pt-28 px-8 transition-transform duration-500 md:hidden flex flex-col
          ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        {/* Mobile Header / Controls inside Drawer */}
        <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-4">
             <span className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400">Settings</span>
             <button
                onClick={toggleTheme}
                className="w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-slate-900 dark:text-white"
              >
                {isDarkMode ? '☀' : '☾'}
              </button>
          </div>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <span className="text-3xl font-light">✕</span>
          </button>
        </div>

        {/* Links List */}
        <div className="flex flex-col gap-6 overflow-y-auto pb-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-2xl font-bold uppercase text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center group"
            >
              <span>{link.name}</span>
              <span className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </Link>
          ))}

          <div className="pt-4 space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block w-full py-4 px-6 bg-blue-600 text-white font-bold uppercase text-center shadow-lg rounded-none"
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="w-full py-4 bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white font-bold uppercase"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full py-4 border-2 border-slate-900 dark:border-white text-slate-900 dark:text-white font-bold uppercase text-center"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="block w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-bold uppercase text-center shadow-2xl"
                >
                  Sign Up Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
