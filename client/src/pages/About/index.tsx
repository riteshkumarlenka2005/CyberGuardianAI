
import React from 'react';

// --- REUSED TECH CARD COMPONENT (Matches Home Page Layout) ---
const TechCard = ({ title, desc, icon, color }: { title: string, desc: string, icon: string, color: string }) => {
  return (
    <div className="relative group h-full select-none">
      {/* 1. Main Container with Clip Path */}
      <div 
        className="relative h-full bg-white dark:bg-slate-900 transition-all duration-300 group-hover:-translate-y-2"
        style={{ 
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0 100%, 0 20px)' 
        }}
      >
        {/* 2. Gradient Border Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 p-[2px]">
           <div className="h-full w-full bg-white dark:bg-slate-900" 
                style={{ 
                   clipPath: 'polygon(19px 0, 100% 0, 100% calc(100% - 34px), calc(100% - 34px) 100%, 0 100%, 0 19px)' 
                }}
           ></div>
        </div>

        {/* 3. Top "Hashed" Stripes Decor */}
        <div className="absolute top-0 left-16 w-20 h-[4px] bg-white dark:bg-slate-900 flex gap-[4px] items-center justify-center z-10 px-2">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="w-[3px] h-[6px] bg-black dark:bg-slate-200 transform -skew-x-[30deg] mt-[-2px]"></div>
           ))}
        </div>

        {/* 4. Bottom Right Solid Black Tab */}
        <div className="absolute bottom-0 right-0 w-32 h-12 bg-black z-10"
             style={{ clipPath: 'polygon(30px 0, 100% 0, 100% 100%, 0% 100%)' }}>
        </div>

        {/* 5. Content Area */}
        <div className="relative z-20 p-8 pt-12 flex flex-col h-full">
          <div className="w-12 h-12 mb-6 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
             {icon}
          </div>

          <h3 className="text-xl font-bold uppercase tracking-wider mb-4 text-slate-900 dark:text-white">{title}</h3>
          
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed flex-grow">
            {desc}
          </p>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
             <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full w-1/3 ${color}`}></div>
             </div>
             <p className="text-[10px] text-right mt-2 font-mono uppercase text-slate-400">System Module Active</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="pt-24 pb-20 bg-white dark:bg-slate-950 transition-colors duration-300 overflow-hidden font-sans">

      {/* --- HERO SECTION --- */}
      <section className="max-w-7xl mx-auto px-6 mb-16 relative z-10 text-left">
        <div className="inline-block px-4 py-1 mb-6 border border-blue-500/30 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono text-xs tracking-widest uppercase">
            // Mission Statement: Validated
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
          Transforming Citizens <br />
          Into <span className="text-slate-800 dark:text-slate-300">Resilient</span> <br />
          <span className="text-red-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] relative inline-block">
            Human Firewalls!!
            <div className="absolute -bottom-2 left-0 w-full h-2 bg-slate-800 dark:bg-slate-700 -rotate-1"></div>
          </span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl font-medium">
          CyberGuardian AI exists to address the most dangerous gap in today’s cybersecurity landscape: the lack of practical, experiential training for humans themselves. We don't just teach rules; we train instinct.
        </p>
      </section>

      {/* --- PHILOSOPHY SECTION (Grid of Tech Cards) --- */}
      <section className="bg-slate-50 dark:bg-slate-900/50 py-16 relative">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]"
             style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
             <h2 className="text-3xl font-bold dark:text-white uppercase tracking-widest mb-4">Core Philosophy</h2>
             <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             <TechCard 
               title="Simulation First"
               desc="Just as pilots train in flight simulators, we believe true digital safety comes from training pattern recognition in the brain. We simulate real-world scams exactly as they occur—bank fraud, job scams, and emergency impersonation—allowing users to experience threats firsthand."
               icon="✈️"
               color="bg-blue-500"
             />
             <TechCard 
               title="Mentor Intervention"
               desc="Learning happens at the moment of mistake. When a user makes a risky decision, our AI Mentor Panel pauses the simulation to explain the manipulation tactic, the psychological lever used (fear, urgency, greed), and how to craft a safer response."
               icon="🎓"
               color="bg-purple-500"
             />
             <TechCard 
               title="Psychological Defense"
               desc="Modern scams are social engineering operations, not just technical attacks. We focus on inoculating users against emotional hijacking—fear, trust, and authority—transforming vulnerability into critical thinking and judgment."
               icon="🧠"
               color="bg-pink-500"
             />
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS (Split Layout) --- */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
                <div className="relative p-8 border-l-4 border-blue-600 bg-slate-50 dark:bg-slate-900">
                    <h3 className="text-2xl font-bold mb-4 dark:text-white uppercase tracking-wider">The Adversary & The Teacher</h3>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                        CyberGuardian AI is not a generic chatbot. It is a guided training system where the AI alternates roles:
                    </p>
                    <ul className="space-y-6">
                        <li className="flex gap-4">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xl rounded-lg">A</div>
                            <div>
                                <h4 className="font-bold dark:text-white">The Adversary</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Adapts dynamically, escalates pressure, and mirrors authentic scammer behavior to test your limits.</p>
                            </div>
                        </li>
                        <li className="flex gap-4">
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 flex items-center justify-center font-bold text-xl rounded-lg">M</div>
                            <div>
                                <h4 className="font-bold dark:text-white">The Mentor</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">Intervenes instantly to deconstruct threats, converting risks into pattern recognition skills.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            
            {/* Visual Representation of the "System" */}
            <div className="lg:w-1/2 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-3xl opacity-20"></div>
                <div className="relative bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-2xl">
                    <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <span className="font-mono text-xs text-slate-400 uppercase">Live Training Session</span>
                        <div className="flex gap-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-mono text-xs text-red-500 uppercase">Attack Sim Active</span>
                        </div>
                    </div>
                    <div className="space-y-4 font-mono text-sm">
                        <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-tl-xl rounded-tr-xl rounded-br-xl text-slate-600 dark:text-slate-300 border-l-4 border-red-500">
                            [SCAMMER]: "Your account has been compromised. Verify immediately or we lock your funds within 15 minutes."
                        </div>
                        <div className="text-center text-xs text-slate-400 py-2">-- USER HESITATES (DETECTED) --</div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800 text-slate-700 dark:text-blue-100">
                            <strong>[MENTOR INTERVENTION]:</strong> Pause. Notice the urgency ("15 minutes") and the threat ("lock funds"). This is a classic Fear Hijack. Do not verify. Check the official banking app directly.
                        </div>
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* --- IMPACT & VISION (Grid of Tech Cards) --- */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-16 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold dark:text-white uppercase tracking-widest mb-4">Societal Impact</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-yellow-500 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <TechCard 
                   title="Democratization"
                   desc="We make advanced scam-awareness training accessible to everyone—students, seniors, and job seekers. By removing technical jargon and using intuitive feedback, we empower those most frequently targeted but least equipped."
                   icon="🌍"
                   color="bg-green-500"
                />
                <TechCard 
                   title="Responsible AI"
                   desc="We demonstrate how generative AI can be a force for safety. We repurpose the same capabilities used by scammers to create an immunization tool, proving that smarter people, not just smarter algorithms, are the future of security."
                   icon="🤖"
                   color="bg-cyan-500"
                />
                <TechCard 
                   title="Proof of Concept"
                   desc="CyberGuardian AI serves as a blueprint for human-centric cybersecurity systems. We are building a production-grade platform to prove that cultivating judgment and emotional awareness is practical, scalable, and impactful."
                   icon="🚀"
                   color="bg-indigo-500"
                />
            </div>
        </div>
      </section>

    </div>
  );
};

export default About;
