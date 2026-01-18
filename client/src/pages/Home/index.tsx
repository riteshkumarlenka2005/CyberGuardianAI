
import React from 'react';
import { Link } from 'react-router-dom';
import CyberNetworkVisual from '../../components/CyberNetworkVisual';
import BinaryStreamVisual from '../../components/BinaryStreamVisual';

// --- CUSTOM HUD TECH CARD COMPONENT (Updated Layout) ---
const TechCard = ({ title, desc, icon, color, stat, level }: { title: string, desc: string, icon: string, color: string, stat: string, level: number }) => {
  return (
    <div className="relative group h-full select-none">
      {/* 1. Main Container with Clip Path for the shape */}
      <div
        className="relative h-full bg-white dark:bg-slate-900 transition-all duration-300 group-hover:-translate-y-2"
        style={{
          // The specific chamfered shape: Cut Top-Left, Cut Bottom-Right
          clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0 100%, 0 20px)'
        }}
      >
        {/* 2. The Gradient Border Layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-orange-500 to-yellow-500 p-[2px]">
          {/* Inner Mask to create the "Border" effect */}
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
        <div className="relative z-20 p-8 pt-10 flex flex-col h-full">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-800 rounded-lg text-2xl border border-slate-100 dark:border-slate-700">
              {icon}
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 block mb-1">Impact</span>
              <p className="font-bold font-mono text-slate-900 dark:text-white">{stat}</p>
            </div>
          </div>

          <h3 className="text-lg font-bold uppercase tracking-wider mb-3 text-slate-900 dark:text-white">{title}</h3>

          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 flex-grow">
            {desc}
          </p>

          {/* Threat Meter (Segmented Style) */}
          <div className="mt-auto relative z-30">
            <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest mb-2 text-slate-400">
              <span>Threat Level</span>
              <span className={level > 80 ? 'text-red-500' : 'text-orange-500'}>{level}%</span>
            </div>
            <div className="flex gap-[3px] h-2 w-full">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 transform -skew-x-[20deg] ${(i + 1) * 10 <= level
                      ? color // Active Color
                      : 'bg-slate-100 dark:bg-slate-800' // Inactive Color
                    }`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

// --- CIRCULAR INFOGRAPHIC COMPONENT ---
const CybercrimeCircle = () => {
  const crimes = [
    { name: "CSAM", icon: "👶", color: "border-slate-800" },
    { name: "Stalking", icon: "🕵️", color: "border-slate-800" },
    { name: "Bullying", icon: "💬", color: "border-slate-800" },
    { name: "Grooming", icon: "🤝", color: "border-slate-800" },
    { name: "Job Fraud", icon: "💼", color: "border-slate-800" },
    { name: "Sextortion", icon: "📱", color: "border-slate-800" },
    { name: "Vishing", icon: "📞", color: "border-slate-800" },
    { name: "Phishing", icon: "🎣", color: "border-slate-800" },
    { name: "Data Breach", icon: "🔓", color: "border-slate-800" },
    { name: "Trafficking", icon: "💊", color: "border-slate-800" },
    { name: "Squatting", icon: "🏠", color: "border-slate-800" },
  ];

  return (
    <div className="relative w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
      {/* Background Rings */}
      <div className="absolute inset-0 border-[1px] border-slate-200 dark:border-slate-800 rounded-full"></div>
      <div className="absolute inset-8 border-[1px] border-slate-200 dark:border-slate-800 rounded-full"></div>

      {/* Center Figure */}
      <div className="relative z-20 w-28 h-28 sm:w-40 sm:h-40 bg-white dark:bg-slate-900 rounded-full shadow-2xl flex items-center justify-center border-4 border-slate-100 dark:border-slate-800 overflow-hidden">
        <img
          src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
          alt="Hacker Avatar"
          className="w-20 h-20 sm:w-32 sm:h-32 opacity-90 dark:invert"
        />
      </div>

      {/* Categories (Calculated positions) */}
      {crimes.map((crime, idx) => {
        const angle = (idx * (360 / crimes.length)) - 90;
        const radius = 180; // Distance from center - reduced to fit laptop screen better
        return (
          <div
            key={idx}
            className="absolute z-10 flex flex-col items-center group transition-transform duration-300 hover:scale-110"
            style={{
              transform: `rotate(${angle}deg) translate(${radius}px) rotate(-${angle}deg)`
            }}
          >
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-900 dark:border-white p-1.5 sm:p-3 rounded-xl shadow-lg flex flex-col items-center justify-center min-w-[60px] sm:min-w-[90px]">
              <span className="text-lg sm:text-xl mb-0.5">{crime.icon}</span>
              <span className="text-[7px] sm:text-[9px] font-bold uppercase tracking-tighter text-slate-800 dark:text-slate-200 text-center leading-none">
                {crime.name}
              </span>
            </div>
          </div>
        );
      })}

      {/* Rotating Arrow Indicator */}
      <div className="absolute inset-0 animate-[spin_60s_linear_infinite] pointer-events-none opacity-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 50 2 A 48 48 0 1 1 50 98" fill="none" stroke="black" strokeWidth="0.5" strokeDasharray="2 2" className="dark:stroke-white" />
          <path d="M 48 2 L 50 0 L 52 2" fill="none" stroke="black" strokeWidth="1" className="dark:stroke-white" />
        </svg>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300 font-sans">

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[calc(100vh-5rem)] flex items-center pt-20 pb-4 bg-[#f8f9fb] dark:bg-slate-950 overflow-hidden">

        {/* Background Graphic Accents */}
        <div className="absolute top-0 right-0 w-[40%] h-full bg-slate-100 dark:bg-slate-900/40 transform -skew-x-12 translate-x-1/2 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 w-full flex flex-col lg:flex-row items-center relative z-10">

          {/* Left Side: Content */}
          <div className="lg:w-1/2 text-left mb-6 lg:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-[4.8rem] font-bold text-slate-900 dark:text-white leading-[1.05] mb-5 tracking-tighter">
              Modern <br />
              Cyber Threats <br />
              Are Designed To <br />
              <span className="text-red-600 drop-shadow-[2px_2px_0_rgba(0,0,0,0.1)] relative inline-block">
                Manipulate You!!
                <div className="absolute -bottom-2 left-0 w-full h-2 bg-slate-800 dark:bg-slate-700 -rotate-1"></div>
              </span>
            </h1>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-6 max-w-lg leading-relaxed font-medium">
              Social engineering and digital manipulation are evolving. Train your internal firewall against modern threats with realistic AI simulations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/training"
                className="inline-block px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold text-base shadow-xl hover:-translate-y-1 transition-all duration-300 uppercase tracking-widest text-center"
              >
                Start Training
              </Link>
              <Link
                to="/about"
                className="inline-block px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-900 dark:border-white font-bold text-base hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300 uppercase tracking-widest text-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Side: Circular Infographic */}
          <div className="lg:w-1/2 relative flex items-center justify-center p-4">
            <CybercrimeCircle />

            {/* Branding detail */}
            <div className="absolute top-0 right-0 hidden lg:block text-right opacity-30">
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">CGAI</span>
              <p className="text-[7px] uppercase font-bold tracking-[0.4em] text-slate-500">Security • Education • Defense</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROBLEM SECTION --- */}
      <section className="py-8 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold dark:text-white tracking-tight mb-2 uppercase text-slate-900">Threat Analysis</h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg italic">"Understanding the vector is the first step to neutralising the threat."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Banking Fraud', desc: 'Unauthorized withdrawals and fake verification alerts attempting to steal credentials.', icon: '🏦', color: 'bg-red-500', stat: '$4.2B Lost', level: 90 },
              { title: 'Job Scams', desc: 'Fake recruiters offering "too good to be true" remote roles to harvest personal identity data.', icon: '💼', color: 'bg-blue-500', stat: 'Rise by 18%', level: 60 },
              { title: 'Gov Impersonation', desc: 'Criminals posing as tax authorities or police demanding immediate crypto payment.', icon: '🏛️', color: 'bg-purple-500', stat: 'High Vol', level: 75 },
              { title: 'Family Emergency', desc: 'AI-voice cloning used to mimic loved ones in distress to extract quick transfers.', icon: '🚨', color: 'bg-orange-500', stat: 'Target: 60+', level: 85 },
            ].map((item, idx) => (
              <TechCard key={idx} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* --- NETWORK VISUAL --- */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="w-full lg:w-1/2 order-2 lg:order-1">
              <CyberNetworkVisual />
            </div>
            <div className="w-full lg:w-1/2 order-1 lg:order-2 text-center lg:text-left">
              <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                Visualizing Digital <br /> <span className="text-blue-600 dark:text-blue-400">Threat Intelligence</span>
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-4 max-w-xl mx-auto lg:mx-0">
                Every connection tells a story. CyberGuardian AI maps how scams move, evolve, and spread through the global network.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- SOLUTION SECTION --- */}
      <section className="py-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2 order-2 lg:order-1 relative">
              <div className="absolute inset-0 bg-blue-100/50 dark:bg-blue-900/20 transform translate-x-4 translate-y-4 z-0 rounded-[2.5rem]"></div>
              <img src="https://picsum.photos/seed/safety/800/600" alt="AI Mentor" className="rounded-[2.5rem] shadow-2xl w-full border border-slate-100 dark:border-slate-800 relative z-10" />
            </div>
            <div className="lg:w-1/2 order-1 lg:order-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold tracking-wider text-xs uppercase mb-2 block">Building Digital Immunity</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight dark:text-white uppercase">The AI Advantage</h2>
              <p className="text-slate-600 dark:text-slate-400 mb-5 leading-relaxed text-lg">
                Traditional security tools block links, but they don't train your brain. CyberGuardian AI prepares you for the moment technology fails.
              </p>
              <ul className="space-y-2">
                {['Realistic conversational AI', 'Context-aware risk detection', 'Instant mentor feedback'].map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-4 p-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl hover:border-blue-500 transition-colors">
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- PSYCHOLOGY OF ATTACK SECTION --- */}
      <section className="py-8 bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="lg:w-1/2 text-left order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">
                The Psychology <br />
                <span className="text-red-600 dark:text-red-500">Of Deception</span>
              </h2>
              <div className="space-y-3">
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Behind every fake email, job offer, bank alert, or government message is not just malware, but psychology. Today’s attackers use AI, automation, and social engineering to pressure people into making decisions quickly — before logic has time to respond.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  Traditional security tools can block links and flag files, but they cannot prepare humans for deception that arrives through conversation, emotion, and impersonation. Most victims are not careless; they are simply untrained for scenarios designed to bypass human judgment.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-bold border-l-4 border-red-500 pl-6 py-2 bg-red-50 dark:bg-red-900/10">
                  CyberGuardian AI exists to train people for these moments — safely, interactively, and before real damage happens.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full order-1 lg:order-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-slate-900 rounded-[3rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <img
                  src="https://img.freepik.com/free-photo/hacker-with-laptop-cyber-security-concept_23-2148533161.jpg?t=st=1740050000&exp=1740053600&hmac=7a5b6c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f"
                  alt="Manipulation Tactic Illustration"
                  className="relative rounded-[3rem] shadow-2xl w-full border border-slate-100 dark:border-slate-800 object-cover aspect-video lg:aspect-square"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- ALTERNATING PROTOCOLS SECTION --- */}
      <section className="py-8 bg-white dark:bg-slate-950 transition-colors duration-500 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 relative z-10">
          <header className="mb-6 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight uppercase leading-none">
              Protocols for <br /><span className="text-purple-600 dark:text-purple-400">Digital Resilience</span>
            </h2>
            <div className="h-1.5 w-24 bg-purple-600 dark:bg-purple-400 mx-auto rounded-full" />
          </header>

          <div className="space-y-6 md:space-y-8">
            {[
              "Digital threats have changed dramatically in recent years. Cybercrime is no longer limited to technical exploits or malicious software—it now targets human attention, emotions, and trust. Scammers impersonate banks, employers, relatives, and authorities with alarming realism, often pressuring people into quick decisions before logic and caution have a chance to intervene.",
              "What makes modern scams particularly dangerous is not their complexity, but their familiarity. Messages arrive through everyday channels like email, messaging apps, and phone calls, blending seamlessly into normal communication. Even careful and educated users can be caught off guard when urgency, fear, or authority is expertly applied at the wrong moment.",
              "Most existing security solutions focus on blocking links, flagging files, or reacting after something suspicious is detected. While these tools are important, they do little to prepare individuals for real-world conversations where no obvious warning appears. Digital safety today requires more than detection—it requires human readiness and awareness.",
              "CyberGuardian AI introduces a different approach by turning digital safety into an active learning experience. Instead of simply warning users, the platform simulates realistic scam scenarios in a controlled environment, allowing people to experience how manipulation unfolds step by step—without any real-world risk or consequences.",
              "At critical moments, the system pauses the simulation and explains exactly what is happening: which psychological tactic is being used, why the situation is risky, and how a safer response would look. This guided intervention transforms mistakes into understanding, helping users build instinctive awareness rather than memorized rules.",
              "Over time, CyberGuardian AI helps users develop confidence and resilience in digital interactions. By tracking learning progress, recognizing improvement, and reinforcing safe behavior, the platform empowers individuals to navigate online spaces calmly and independently—ensuring that as digital threats evolve, people are not left unprepared or dependent on last-minute warnings."
            ].map((para, idx) => (
              <div
                key={idx}
                className={`flex w-full ${idx % 2 === 0 ? 'justify-start' : 'justify-end'} animate-fade-in`}
              >
                <div className={`max-w-2xl group transition-all duration-300 hover:scale-[1.005]`}>
                  <div className={`flex items-center gap-4 mb-2 ${idx % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <span className="text-6xl font-black text-purple-600/40 dark:text-purple-400/40 transition-all duration-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:scale-110 leading-none">
                      {idx + 1}
                    </span>
                    <div className="h-px w-12 bg-purple-500/30" />
                  </div>
                  <p className={`text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium transition-colors duration-300 group-hover:text-slate-900 dark:group-hover:text-slate-100 ${idx % 2 === 0 ? 'text-left' : 'text-right'}`}>
                    {para}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BINARY SIGNAL VISUALIZATION SECTION --- */}
      <section className="py-8 bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="lg:w-1/2 text-left">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tighter uppercase">
                Core Intelligence <br />
                <span className="text-blue-600 dark:text-blue-400">Signal Stream</span>
              </h2>
              <div className="space-y-3">
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  At the core of CyberGuardian AI, every digital interaction is reduced to its most fundamental form—binary signals. These streams of 0s and 1s represent real-time data flowing through the system, capturing user decisions, threat patterns, and behavioral responses as they happen.
                </p>
                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                  As this data rises through multiple intelligence layers, the platform continuously analyzes intent, detects manipulation techniques, and refines its understanding of scam behavior. Each signal strengthens the system’s ability to guide users toward safer decisions, transforming raw digital noise into meaningful human defense.
                </p>
              </div>
            </div>
            <div className="lg:w-1/2 w-full">
              <BinaryStreamVisual />
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA --- */}
      <section className="py-8 bg-slate-900 dark:bg-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white dark:text-slate-900 mb-6 uppercase tracking-tighter">Ready to Build Your Digital Immunity?</h2>
          <Link to="/signup" className="px-10 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-none font-bold text-lg hover:scale-105 transition-all inline-block shadow-2xl uppercase tracking-widest border-2 border-white dark:border-slate-900">
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
