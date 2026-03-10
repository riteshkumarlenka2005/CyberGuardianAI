
import React, { useState, useEffect } from 'react';
import type { ResourceAlert as AlertType, ResourceVideo, ResourceLink } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// --- REUSED FRAME COMPONENT: FrameTypeA (Cyan Brackets) ---
const FrameTypeA = ({ children, label }: { children: React.ReactNode, label: string }) => (
  <div className="relative w-full h-full group overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-cyan-900/30 shadow-lg transition-colors duration-300">
    <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-600 dark:border-cyan-500 z-20"></div>
    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-600 dark:border-cyan-500 z-20"></div>
    <div className="absolute inset-2 z-10 overflow-hidden">
        {children}
    </div>
    <div className="absolute bottom-4 left-4 z-30 bg-blue-600 dark:bg-cyan-900/90 px-2 py-0.5 text-[10px] font-mono text-white dark:text-cyan-100 uppercase tracking-widest">
        {label}
    </div>
  </div>
);

// --- REUSED FRAME COMPONENT: AlertCard (Chamfered Card) ---
const AlertCard = ({ title, date, tag }: { title: string, date: string, tag: string }) => (
    <div className="relative group select-none">
      <div 
        className="relative bg-white dark:bg-slate-900 transition-all duration-300 group-hover:-translate-x-2 border border-slate-200 dark:border-slate-800"
        style={{ 
          clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' 
        }}
      >
        {/* Left Accent Bar */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 group-hover:bg-red-500 transition-colors"></div>
        
        <div className="p-5 sm:p-6 pl-6 sm:pl-8">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0 mb-2">
                <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider border border-blue-200 dark:border-blue-800 px-2 py-0.5 rounded-sm w-fit">{tag}</span>
                <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{date}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">{title}</h3>
        </div>
      </div>
    </div>
);


const Resources: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertType[]>([]);
  const [videos, setVideos] = useState<ResourceVideo[]>([]);
  const [links, setLinks] = useState<ResourceLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_URL}/api/v1/resources/alerts`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/api/v1/resources/videos`).then(r => r.json()).catch(() => []),
      fetch(`${API_URL}/api/v1/resources/links`).then(r => r.json()).catch(() => []),
    ]).then(([a, v, l]) => {
      setAlerts(a);
      setVideos(v);
      setLinks(l);
      setLoading(false);
    });
  }, []);

  return (
    <div className="pt-24 pb-20 bg-slate-50 dark:bg-[#02040a] min-h-screen transition-colors duration-300 font-sans">
      
      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <header className="mb-16 border-b border-slate-200 dark:border-slate-800 pb-8">
          <h1 className="text-5xl md:text-6xl lg:text-[4.8rem] font-bold text-slate-900 dark:text-white leading-[1.05] mb-6 tracking-tighter">
            Digital <span className="text-slate-800 dark:text-slate-300">Defense</span> <br />
            <span className="text-red-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] relative inline-block">
              Intelligence Hub!!
              <div className="absolute -bottom-2 left-0 w-full h-2 bg-slate-800 dark:bg-slate-700"></div>
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium border-l-4 border-blue-500 pl-6">
            Stay informed with the latest threat intelligence, government advisories, and educational content direct from the CyberGuardian network.
          </p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* === MAIN CONTENT AREA (Left 8 Cols) === */}
            <div className="lg:col-span-8 space-y-16">
              
              {/* SECTION 1: SCAM ALERTS */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center rounded-lg font-bold text-xl shrink-0">!</div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Priority Threat Alerts</h2>
                </div>
                {alerts.length === 0 ? (
                  <p className="text-slate-500 font-mono text-sm">No threat alerts at this time.</p>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {alerts.map(item => (
                      <AlertCard key={item.id} title={item.title} date={item.date_text} tag={item.tag} />
                    ))}
                  </div>
                )}
              </section>

              {/* SECTION 2: VIDEOS */}
              <section>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center rounded-lg font-bold text-xl shrink-0">▶</div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white uppercase tracking-wider">Tactical Briefings</h2>
                </div>
                {videos.length === 0 ? (
                  <p className="text-slate-500 font-mono text-sm">No tactical briefings available.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {videos.map(v => (
                      <div key={v.id} className="h-64">
                          <FrameTypeA label={v.label || 'VIDEO'}>
                              <a href={v.video_url || '#'} target="_blank" rel="noopener noreferrer" className="w-full h-full relative group/vid block cursor-pointer">
                                 {v.thumbnail_url ? (
                                   <img src={v.thumbnail_url} alt={v.title} className="w-full h-full object-cover opacity-60 dark:opacity-80 group-hover/vid:opacity-100 transition-opacity" />
                                 ) : (
                                   <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                                     <span className="text-4xl">🎬</span>
                                   </div>
                                 )}
                                 <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="w-12 h-12 bg-blue-600/90 rounded-full flex items-center justify-center text-white pl-1 shadow-[0_0_20px_rgba(37,99,235,0.6)] group-hover/vid:scale-110 transition-transform">▶</div>
                                 </div>
                                 <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-black/80 p-4 transition-colors">
                                     <h4 className="text-slate-900 dark:text-white font-bold text-sm uppercase truncate">{v.title}</h4>
                                     {v.duration && <p className="text-blue-600 dark:text-blue-400 text-[10px] font-mono">DURATION: {v.duration}</p>}
                                 </div>
                              </a>
                          </FrameTypeA>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* === SIDEBAR AREA (Right 4 Cols) === */}
            <div className="lg:col-span-4 space-y-8">
              
              {/* WIDGET 1: OFFICIAL CHANNELS (dynamic links) */}
              <div className="relative p-[2px] group" style={{ clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0% 100%)' }}>
                 <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 opacity-20 dark:opacity-100"></div>
                 <div className="relative bg-white dark:bg-slate-900 p-8 transition-colors duration-300" style={{ clipPath: 'polygon(19px 0, 100% 0, 100% 100%, 0% 100%)' }}>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">Official Channels</h3>
                    {links.length === 0 ? (
                      <p className="text-slate-500 font-mono text-xs">No links available.</p>
                    ) : (
                      <ul className="space-y-4">
                        {links.map(link => (
                          <li key={link.id}>
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center group/link p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded transition-colors">
                              <span className="text-pink-500 mr-3 text-xs">●</span>
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-300 group-hover/link:text-slate-900 dark:group-hover/link:text-white transition-colors">{link.name}</span>
                              <span className="ml-auto text-slate-400 group-hover/link:text-pink-500 text-xs">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                 </div>
              </div>

              {/* WIDGET 2: THREAT GEOGRAPHY */}
              <div className="relative border border-slate-200 dark:border-blue-900/50 bg-white dark:bg-[#0B1221] p-1 shadow-lg transition-colors">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-blue-600 dark:border-blue-500"></div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-blue-600 dark:border-blue-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-blue-600 dark:border-blue-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-blue-600 dark:border-blue-500"></div>
                  
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-6 transition-colors">
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2">Threat Geography</h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 font-mono">LIVE PREVALENCE MAPPING</p>
                      
                      <div className="h-40 bg-white dark:bg-[#050914] border border-slate-200 dark:border-blue-900/30 rounded flex flex-col items-center justify-center text-center p-4 relative overflow-hidden group/map cursor-pointer transition-colors">
                          <div className="absolute inset-0 opacity-10 dark:opacity-20" style={{ backgroundImage: 'radial-gradient(#1e3a8a 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                          <div className="relative z-10">
                              <span className="text-blue-500 text-2xl mb-2 block group-hover/map:scale-110 transition-transform">🌐</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Initialize Map View</span>
                          </div>
                      </div>

                      <button className="w-full mt-4 py-3 bg-blue-600 dark:bg-blue-900/20 border border-blue-600 dark:border-blue-500/30 text-white dark:text-blue-300 font-mono text-xs uppercase hover:bg-blue-700 dark:hover:bg-blue-600 transition-all">
                          Launch Local Search
                      </button>
                  </div>
              </div>

               {/* WIDGET 3: NEWSLETTER */}
               <div className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 rounded-xl text-center">
                  <span className="text-3xl mb-2 block">📩</span>
                  <h3 className="font-bold text-slate-900 dark:text-white uppercase mb-2">Intel Briefing</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Weekly digests of the top threats.</p>
                  <input type="email" placeholder="ENTER EMAIL" className="w-full bg-white dark:bg-black border border-slate-300 dark:border-slate-700 px-3 py-2 text-xs mb-2 text-center font-mono dark:text-white" />
                  <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-bold py-2 uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors">Subscribe</button>
               </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Resources;
