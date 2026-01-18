
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  isDarkMode: boolean;
}

const Footer: React.FC<FooterProps> = ({ isDarkMode }) => {
  const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

  const socialLinks = [
    { name: 'Twitter', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>, url: 'https://twitter.com' },
    { name: 'LinkedIn', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>, url: 'https://linkedin.com' },
    { name: 'GitHub', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>, url: 'https://github.com' },
    { name: 'Instagram', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>, url: 'https://instagram.com' },
    { name: 'YouTube', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>, url: 'https://youtube.com' },
    { name: 'Facebook', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z"/></svg>, url: 'https://facebook.com' },
  ];

  return (
    <footer className="relative w-full bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-300 overflow-hidden pt-8 pb-8 font-sans transition-colors duration-300">
      {/* --- BACKGROUND GRID PATTERN --- */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.4]"
           style={{
             backgroundImage: `linear-gradient(${gridColor} 1px, transparent 1px), linear-gradient(90deg, ${gridColor} 1px, transparent 1px)`,
             backgroundSize: '32px 32px'
           }} 
      />

      {/* --- MAIN HUD FRAME CONTAINER --- */}
      <div className="relative max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 py-12 my-2">
        
        {/* === DECORATIVE FRAME LAYERS === */}
        <div className="absolute inset-0 pointer-events-none select-none z-0">
            
          {/* 1. Main Border Shape (Thin Outlines) */}
          <div 
            className="absolute inset-0 border-l border-r border-slate-900 dark:border-white opacity-20 transform scale-[0.995]" 
            style={{ clipPath: 'polygon(40px 0, calc(100% - 40px) 0, 100% 40px, 100% calc(100% - 40px), calc(100% - 40px) 100%, 40px 100%, 0 calc(100% - 40px), 0 40px)' }}
          />

          {/* 2. Top Left Corner (Triangle + Chamfer Detail) */}
          <div className="absolute top-0 left-0 w-48 h-48">
             <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute top-0 left-0 w-24 h-24 text-black dark:text-white fill-current">
                <path d="M0 0 L40 0 L0 40 Z" />
             </svg>
             <svg className="absolute top-0 left-0 w-full h-full stroke-black dark:stroke-white stroke-[1] fill-none">
                 <path d="M0 45 L0 65 L20 85" />
                 <path d="M45 0 L140 0" />
                 <path d="M0 45 L15 30 L60 30" />
             </svg>
          </div>

          {/* 3. Top Right Corner (Chamfer + Tab) */}
          <div className="absolute top-0 right-0 w-48 h-48">
              <svg className="absolute top-0 right-0 w-full h-full stroke-black dark:stroke-white stroke-[1] fill-none">
                  <path d="M-40 0 L60 0 L100 40 L100 100" />
                  <path d="M40 0 L55 15 L95 15" />
              </svg>
              <div className="absolute top-0 right-0 w-8 h-8 bg-black dark:bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}></div>
          </div>

          {/* 4. Bottom Right Corner (Heavy Bar + Stripes Texture) */}
          <div className="absolute bottom-0 right-0 w-80 h-48">
              {/* Heavy bar */}
              <div className="absolute bottom-6 right-6 h-4 w-64 bg-black dark:bg-white"></div>
              {/* Thin detail line below it */}
              <div className="absolute bottom-3 right-6 h-[1.5px] w-72 bg-black dark:bg-white"></div>
               
              <svg className="absolute bottom-0 right-0 w-full h-full stroke-black dark:stroke-white stroke-[1] fill-none">
                  <path d="M100 100 L100 60 L60 20" />
                  <path d="M-20 100 L60 100 L100 60" />
              </svg>
              
              {/* Decorative stripes texture */}
              <div className="absolute bottom-20 right-12 w-32 h-16 flex space-x-3 opacity-10">
                  <div className="w-6 h-full bg-slate-400 dark:bg-slate-600 transform -skew-x-12"></div>
                  <div className="w-12 h-full bg-slate-400 dark:bg-slate-600 transform -skew-x-12"></div>
                  <div className="w-4 h-full bg-slate-400 dark:bg-slate-600 transform -skew-x-12"></div>
              </div>
          </div>

          {/* 5. Bottom Left Corner (Triangle + Skewed Trapezium) */}
          <div className="absolute bottom-0 left-0 w-48 h-48">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute bottom-8 left-0 w-20 h-20 text-black dark:text-white fill-current">
                  <path d="M0 100 L0 60 L40 100 Z" />
              </svg>
              {/* Detached skewed trapezium element below triangle */}
              <div className="absolute bottom-3 left-10 w-32 h-4 border-b-2 border-l-2 border-black dark:border-white transform skew-x-[45deg]"></div>
              
              <svg className="absolute bottom-0 left-0 w-full h-full stroke-black dark:stroke-white stroke-[1] fill-none">
                  <path d="M0 60 L20 80 L60 80" />
              </svg>
          </div>

          {/* System Connecting Lines */}
          <div className="absolute top-0 left-48 right-48 h-[1px] bg-black dark:bg-white opacity-10"></div>
          <div className="absolute bottom-0 left-48 right-80 h-[1px] bg-black dark:bg-white opacity-10"></div>
          <div className="absolute left-0 top-48 bottom-48 w-[1px] bg-black dark:bg-white opacity-10"></div>
          <div className="absolute right-0 top-48 bottom-100 w-[1px] bg-black dark:bg-white opacity-10"></div>

        </div>

        {/* === ACTUAL FOOTER CONTENT === */}
        <div className="relative z-10 px-6 md:px-16 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 lg:gap-12">
            
            {/* Logo and Status Section */}
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="w-10 h-10 bg-black dark:bg-white rounded-sm flex items-center justify-center p-1.5">
                    {/* SHIELD LOGO SVG */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-white dark:text-black fill-current">
                      <path d="M50 5 L89 27.5 L89 72.5 L50 95 L11 72.5 L11 27.5 Z" stroke="currentColor" strokeWidth="2" strokeOpacity="0.3" fill="none" />
                      <path d="M50 25 C50 25 30 28 30 45 C30 65 50 80 50 80 C50 80 70 65 70 45 C70 28 50 25 50 25Z" fill="currentColor" />
                      <path d="M40 48 L50 40 L60 48" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                      <path d="M40 56 L50 48 L60 56" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                      <path d="M40 64 L50 56 L60 64" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="dark:stroke-black" />
                    </svg>
                  </div>
                  <span className="text-black dark:text-white font-bold text-xl tracking-tighter uppercase font-mono">CyberGuardian AI</span>
                </div>
                <div className="space-y-4 font-mono">
                  <p className="text-xs text-slate-800 dark:text-slate-400 leading-tight">
                    // SYSTEM STATUS: ONLINE <br/>
                    Defending digital citizens through realistic AI simulation and active training sessions.
                  </p>
                </div>
            </div>

            {/* Quick Links Section */}
            <div>
                <h4 className="text-black dark:text-white font-bold uppercase tracking-widest mb-8 border-b-2 border-slate-200 dark:border-slate-800 inline-block pb-1 text-xs">Quick Links</h4>
                <ul className="space-y-5 text-sm font-medium text-slate-700 dark:text-slate-400">
                  <li><Link to="/" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Home</Link></li>
                  <li><Link to="/training" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Training Modules</Link></li>
                  <li><Link to="/about" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Our Mission</Link></li>
                  <li><Link to="/about" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Contact Support</Link></li>
                </ul>
            </div>

            {/* Resources Section */}
            <div>
                <h4 className="text-black dark:text-white font-bold uppercase tracking-widest mb-8 border-b-2 border-slate-200 dark:border-slate-800 inline-block pb-1 text-xs">Resources</h4>
                <ul className="space-y-5 text-sm font-medium text-slate-700 dark:text-slate-400">
                  <li><Link to="/resources" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Scam Encyclopedia</Link></li>
                  <li><Link to="/training" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Report a Scam</Link></li>
                  <li><Link to="/resources" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Security News</Link></li>
                  <li><Link to="/resources" className="hover:text-black dark:hover:text-white hover:translate-x-2 transition-transform duration-300 inline-block">Help Center</Link></li>
                </ul>
            </div>

            {/* Stay Safe & Socials Section */}
            <div>
                <h4 className="text-black dark:text-white font-bold uppercase tracking-widest mb-8 border-b-2 border-slate-200 dark:border-slate-800 inline-block pb-1 text-xs">Stay Safe</h4>
                <p className="text-sm text-slate-700 dark:text-slate-400 mb-6 font-medium">Join 50,000+ citizens training their human firewall.</p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {socialLinks.map((social) => (
                    <a 
                      key={social.name} 
                      href={social.url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 border border-slate-300 dark:border-slate-700 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black hover:border-black dark:hover:border-white rounded-none transition-all flex items-center justify-center group shadow-sm"
                      title={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
            </div>
          </div>
            
          {/* Bottom Dashboard / Copyright Bar */}
          <div className="border-t border-slate-200 dark:border-slate-800 mt-16 pt-8 flex flex-col md:flex-row justify-between text-[11px] lg:text-xs text-slate-500 font-mono tracking-tighter">
              <p>© 2024 CyberGuardian AI. // PROTOCOL: ACTIVE // ENCRYPTED</p>
              <div className="flex space-x-8 mt-6 md:mt-0 font-bold">
                  <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors uppercase">Privacy Policy</Link>
                  <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors uppercase">Terms of Service</Link>
                  <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors uppercase">Cookie Prefs</Link>
              </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
