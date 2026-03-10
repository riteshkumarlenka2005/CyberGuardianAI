
import React, { useState, useEffect } from 'react';
import type { GalleryItem } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- FRAME 1: The "Cyan Bracket" Layout ---
const FrameTypeA = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="relative w-full h-full group overflow-hidden bg-slate-900 dark:bg-slate-900 border border-cyan-900/30">
    {/* Corner Brackets */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-cyan-500 z-20"></div>
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-cyan-500 z-20"></div>
    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500/50 z-20"></div>
    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500/50 z-20"></div>
    
    {/* Image Container */}
    <div className="absolute inset-2 z-10 overflow-hidden">
        {children}
    </div>
    
    {/* Label Tag */}
    <div className="absolute bottom-4 left-4 z-30 bg-cyan-900/90 px-2 py-0.5 text-[8px] sm:text-[10px] font-mono text-cyan-100 uppercase tracking-widest hidden sm:block">
        {label}
    </div>
  </div>
);

// --- FRAME 2: The "Pink/Yellow Gradient" Layout ---
const FrameTypeB = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="relative w-full h-full p-[2px] z-10" 
       style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
    {/* Gradient Border Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500"></div>
    
    {/* Inner Content Mask */}
    <div className="absolute inset-[2px] bg-slate-100 dark:bg-slate-950 z-10" 
         style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
        {children}
    </div>

    {/* Top Decor Hashed Lines */}
    <div className="absolute top-0 right-8 w-12 h-1 bg-white dark:bg-slate-950 z-20 flex gap-1">
        {[1,2,3].map(i => <div key={i} className="w-1 h-full bg-yellow-500"></div>)}
    </div>

     {/* Label Tag */}
     <div className="absolute top-2 left-2 z-30 text-[8px] font-bold text-pink-500 uppercase tracking-tighter sm:block hidden">
        // {label}
    </div>
  </div>
);

// --- FRAME 3: The "Purple Mecha" Layout ---
const FrameTypeC = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="relative w-full h-full group">
    {/* Main Border with Glow */}
    <div className="absolute inset-0 border border-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.2)] z-20 pointer-events-none"></div>
    
    {/* Corner Accents */}
    <div className="absolute -top-[1px] -left-[1px] w-6 h-6 border-t-2 border-l-2 border-purple-400 z-30"></div>
    <div className="absolute -top-[1px] -right-[1px] w-6 h-6 border-t-2 border-r-2 border-purple-400 z-30"></div>
    <div className="absolute -bottom-[1px] -left-[1px] w-6 h-6 border-b-2 border-l-2 border-purple-400 z-30"></div>
    <div className="absolute -bottom-[1px] -right-[1px] w-6 h-6 border-b-2 border-r-2 border-purple-400 z-30"></div>

    {/* Center Bottom Tab */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-4 bg-slate-50 dark:bg-slate-900 border-t border-purple-500 z-30 flex items-center justify-center"
          style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }}>
          <span className="text-[6px] text-purple-600 dark:text-purple-200 uppercase tracking-widest sm:block hidden">{label}</span>
    </div>

    <div className="absolute inset-2 bg-slate-100 dark:bg-slate-900 overflow-hidden">
        {children}
    </div>
  </div>
);

// --- FRAME 4: The "Blue Diagonal" Layout ---
const FrameTypeD = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="relative w-full h-full overflow-hidden">
    {/* Left Blue Angle */}
    <div className="absolute top-2 bottom-2 left-0 w-2 bg-blue-700 transform -skew-x-12 z-20"></div>
    {/* Right Blue Angle */}
    <div className="absolute top-2 bottom-2 right-0 w-4 flex gap-1 transform -skew-x-12 z-20">
        <div className="w-1.5 h-full bg-blue-700"></div>
        <div className="w-1.5 h-full bg-blue-700"></div>
    </div>
    
    {/* Top/Bottom Lines */}
    <div className="absolute top-4 left-4 right-4 h-[1px] bg-blue-500/50 z-20"></div>
    <div className="absolute bottom-4 left-4 right-4 h-[1px] bg-blue-500/50 z-20"></div>

    <div className="absolute inset-0 bg-slate-100 dark:bg-slate-900 clip-path-slant overflow-hidden">
        {children}
    </div>
    
    <div className="absolute bottom-2 right-6 z-30 text-blue-600 dark:text-blue-400 text-[8px] font-mono sm:block hidden">
        {label}
    </div>
  </div>
);


const Gallery: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/v1/gallery/`)
      .then(r => r.json())
      .then(data => { setItems(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const renderFrame = (item: GalleryItem, index: number, children: React.ReactNode, label: string) => {
    const frameMap: Record<string, number> = { A: 0, B: 1, C: 2, D: 3 };
    const type = frameMap[item.frame_type] ?? (index % 4);
    switch (type) {
        case 0: return <FrameTypeA label={label}>{children}</FrameTypeA>;
        case 1: return <FrameTypeB label={label}>{children}</FrameTypeB>;
        case 2: return <FrameTypeC label={label}>{children}</FrameTypeC>;
        case 3: return <FrameTypeD label={label}>{children}</FrameTypeD>;
        default: return <FrameTypeA label={label}>{children}</FrameTypeA>;
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white dark:bg-[#02040a] min-h-screen transition-colors duration-300">
      
      {/* Background Industrial Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] dark:opacity-[0.05]"
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
              <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-slate-900 dark:text-white leading-[1.1] mb-4 tracking-tighter">
                Visual <span className="text-slate-800 dark:text-slate-300">Threat</span> <br />
                <span className="text-red-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] relative inline-block">
                  Intelligence!!
                  <div className="absolute -bottom-2 left-0 w-full h-2 bg-slate-800 dark:bg-slate-700"></div>
                </span>
              </h1>
          </div>
          <div className="text-right hidden md:block self-end pb-8">
              <p className="text-slate-500 font-mono text-xs uppercase tracking-tight">SYSTEM STATUS: <span className="text-green-600 dark:text-green-500 font-bold">ONLINE</span></p>
              <p className="text-slate-500 font-mono text-xs uppercase tracking-tight">NODES ACTIVE: <span className="text-slate-900 dark:text-white font-bold">{items.length}</span></p>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-mono text-sm">NO VISUAL DATA AVAILABLE</div>
        ) : (
          <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {items.map((item, idx) => (
              <div key={item.id} 
                   className="relative h-[115px] lg:h-[300px] w-full transition-all duration-300 hover:scale-[1.02] hover:z-50 cursor-pointer"
              >
                  {renderFrame(item, idx, (
                      <div className="w-full h-full relative">
                          <img 
                              src={item.image_url} 
                              alt={item.title} 
                              className="w-full h-full object-cover filter grayscale hover:grayscale-0 transition-all duration-500 opacity-80 hover:opacity-100"
                          />
                          {/* Overlay Scanline Effect */}
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-scan.png')] opacity-20 pointer-events-none"></div>
                      </div>
                  ), item.title)}
              </div>
            ))}
          </div>
        )}

        {/* Footer Data Line */}
        <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-4 flex justify-between text-[10px] text-slate-500 dark:text-slate-600 font-mono uppercase tracking-widest">
            <span>SECURE CONNECTION ESTABLISHED</span>
            <span>CYBERGUARDIAN AI © 2024</span>
        </div>

      </div>
    </div>
  );
};

export default Gallery;
