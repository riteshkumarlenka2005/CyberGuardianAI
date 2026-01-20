import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { SCENARIOS } from '../../constants';
import { ScenarioType, UserIdentity, AgeGroup, Message, RiskAnalysis } from '../../types';
import { GeminiService, ApiService } from '../../services/geminiService';
import { UserDataService } from '../../services/userDataService';
import MessageBubble from '../../components/Chat/MessageBubble';

const IDENTITY_OPTIONS = [
  { id: UserIdentity.STUDENT, label: 'Student', icon: '🎓' },
  { id: UserIdentity.JOB_SEEKER, label: 'Job Seeker', icon: '💼' },
  { id: UserIdentity.SENIOR_CITIZEN, label: 'Senior Citizen', icon: '👴' },
  { id: UserIdentity.TEENAGER, label: 'Teenager', icon: '📱' },
  { id: UserIdentity.GENERAL_USER, label: 'General User', icon: '👥' },
];

const AGE_GROUP_OPTIONS = [
  { id: AgeGroup.TEEN, label: 'Teen', subtitle: '13-19 years', icon: '🧑' },
  { id: AgeGroup.YOUNG_ADULT, label: 'Young Adult', subtitle: '20-35 years', icon: '👨' },
  { id: AgeGroup.ADULT, label: 'Adult', subtitle: '36-55 years', icon: '🧔' },
  { id: AgeGroup.SENIOR, label: 'Senior', subtitle: '56+ years', icon: '👴' },
];

const Training: React.FC = () => {
  const [step, setStep] = useState<'identity' | 'age' | 'scenario' | 'active'>('identity');
  const [selectedIdentity, setSelectedIdentity] = useState<UserIdentity | null>(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<AgeGroup | null>(null);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioType | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [risk, setRisk] = useState<RiskAnalysis | null>(null);
  const [showMentor, setShowMentor] = useState(false);

  // Session tracking state
  const [sessionStartTime, setSessionStartTime] = useState<number>(0);
  const [mentorInterventions, setMentorInterventions] = useState<number>(0);
  const [tacticsEncountered, setTacticsEncountered] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleIdentitySelect = (id: UserIdentity) => {
    setSelectedIdentity(id);
    setStep('age');
  };

  const handleAgeSelect = (id: AgeGroup) => {
    setSelectedAgeGroup(id);
    setStep('scenario');
  };

  const startScenario = async (type: ScenarioType) => {
    setSelectedScenario(type);
    setStep('active');
    setIsLoading(true);
    setMessages([]);
    setShowMentor(false);
    setRisk(null);

    // Reset session tracking
    setSessionStartTime(Date.now());
    setMentorInterventions(0);
    setTacticsEncountered([]);

    const firstMsg = await GeminiService.getScammerResponse(type, selectedIdentity!, [], selectedAgeGroup || undefined);
    const newMsg: Message = {
      id: Date.now().toString(),
      role: 'scammer',
      content: firstMsg,
      timestamp: Date.now()
    };
    setMessages([newMsg]);
    setIsLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !selectedScenario || !selectedIdentity || isLoading || showMentor) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const analysis = await GeminiService.analyzeRisk(selectedScenario, selectedIdentity, inputValue, selectedAgeGroup || undefined);

    if (analysis.isAtRisk) {
      setRisk(analysis);
      setShowMentor(true);
      setIsLoading(false);

      // Track mentor intervention and tactic
      setMentorInterventions(prev => prev + 1);
      if (analysis.manipulationTactic && !tacticsEncountered.includes(analysis.manipulationTactic)) {
        setTacticsEncountered(prev => [...prev, analysis.manipulationTactic]);
      }
      return;
    }

    const scammerMsg = await GeminiService.getScammerResponse(selectedScenario, selectedIdentity, [...messages, userMsg], selectedAgeGroup || undefined);
    const responseMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'scammer',
      content: scammerMsg,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, responseMsg]);
    setIsLoading(false);
  };

  // Save session data and return to scenario selection
  const saveAndExitSession = () => {
    if (selectedScenario && selectedIdentity && sessionStartTime > 0) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      const userMessages = messages.filter(m => m.role === 'user').length;

      UserDataService.saveSession({
        scenarioType: selectedScenario,
        identity: selectedIdentity,
        ageGroup: selectedAgeGroup || undefined,
        messagesCount: userMessages,
        mentorInterventions: mentorInterventions,
        tacticsEncountered: tacticsEncountered,
        completed: true,
        duration: duration
      });
    }
    ApiService.clearSession(); // Clear backend session
    setStep('scenario');
  };

  const restartScenario = async () => {
    // Save incomplete session before restarting
    if (selectedScenario && selectedIdentity && sessionStartTime > 0 && messages.length > 1) {
      const duration = Math.floor((Date.now() - sessionStartTime) / 1000);
      const userMessages = messages.filter(m => m.role === 'user').length;

      UserDataService.saveSession({
        scenarioType: selectedScenario,
        identity: selectedIdentity,
        ageGroup: selectedAgeGroup || undefined,
        messagesCount: userMessages,
        mentorInterventions: mentorInterventions,
        tacticsEncountered: tacticsEncountered,
        completed: false,
        duration: duration
      });
    }
    // Notify backend to retry
    try {
      await ApiService.retrySimulation();
    } catch (e) {
      // Session might not exist yet, that's ok
    }
    if (selectedScenario) startScenario(selectedScenario);
  };

  const continueScenario = async () => {
    // Notify backend to continue
    try {
      await ApiService.continueSimulation();
    } catch (e) {
      // Ignore if no active session
    }
    setShowMentor(false);
    setRisk(null);
  };

  // --- SELECTION SCREEN: IDENTITY (Using Clean Card Style) ---
  if (step === 'identity') {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 dark:bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-5xl w-full text-center relative z-10">
          <span className="text-blue-600 dark:text-blue-400 font-mono text-xs tracking-widest uppercase mb-4 block">// INITIALIZATION_PHASE_1</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">Select Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-16 max-w-lg mx-auto font-medium">Configure the simulation parameters based on your real-world persona.</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {IDENTITY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleIdentitySelect(opt.id)}
                className="group relative h-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all shadow-sm hover:shadow-2xl overflow-hidden flex flex-col items-center justify-center"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                {/* Hover Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-blue-500 transition-colors"></div>

                <span className="text-5xl mb-6 group-hover:scale-110 transition-transform filter grayscale group-hover:grayscale-0">{opt.icon}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider">{opt.label}</span>

                {/* Corner Decor */}
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-colors"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- SELECTION SCREEN: AGE GROUP ---
  if (step === 'age') {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 dark:bg-[#02040a] flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-4xl w-full text-center relative z-10">
          <button onClick={() => setStep('identity')} className="text-blue-500 text-xs font-mono mb-4 hover:underline">← BACK_TO_PROFILE</button>
          <span className="text-blue-600 dark:text-blue-400 font-mono text-xs tracking-widest uppercase mb-4 block">// INITIALIZATION_PHASE_2</span>
          <h1 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 dark:text-white uppercase tracking-tighter">Select Your Age Group</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-16 max-w-lg mx-auto font-medium">This helps tailor scam scenarios and mentor guidance to your age-specific vulnerabilities.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {AGE_GROUP_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleAgeSelect(opt.id)}
                className="group relative h-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 dark:hover:border-purple-500 transition-all shadow-sm hover:shadow-2xl overflow-hidden flex flex-col items-center justify-center"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
              >
                {/* Hover Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-purple-500 transition-colors"></div>

                <span className="text-5xl mb-4 group-hover:scale-110 transition-transform filter grayscale group-hover:grayscale-0">{opt.icon}</span>
                <span className="font-bold text-sm text-slate-900 dark:text-white uppercase tracking-wider mb-2">{opt.label}</span>
                <span className="text-xs text-slate-400 font-mono">{opt.subtitle}</span>

                {/* Corner Decor */}
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-200 dark:border-slate-700 group-hover:border-purple-500 transition-colors"></div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
              <p className="text-xs font-mono text-slate-400">PROFILE: <span className="text-blue-500 uppercase">{selectedIdentity}</span></p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- SELECTION SCREEN: SCENARIO (Using Alert Card Style) ---
  if (step === 'scenario') {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 dark:bg-[#02040a] flex items-center justify-center p-6 relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-6xl w-full relative z-10">
          <div className="flex justify-between items-end mb-12 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
              <button onClick={() => setStep('age')} className="text-blue-500 text-xs font-mono mb-2 hover:underline">← BACK_TO_AGE</button>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Mission Select</h1>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs font-mono text-slate-400">IDENTITY: <span className="text-blue-500 uppercase">{selectedIdentity}</span></p>
              <p className="text-xs font-mono text-slate-400">AGE: <span className="text-purple-500 uppercase">{selectedAgeGroup}</span></p>
              <p className="text-xs font-mono text-slate-400">STATUS: <span className="text-green-500">READY</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => startScenario(s.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 dark:hover:border-red-500 transition-all text-left h-64 flex flex-col"
                style={{ clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0% 100%, 0 20px)' }}
              >
                {/* Left Stripe */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-800 group-hover:bg-red-500 transition-colors"></div>

                <div className="p-6 flex flex-col h-full pl-8">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all">{s.icon}</span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-red-500">LVL_0{Math.floor(Math.random() * 5) + 1}</span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-3 uppercase tracking-tight group-hover:text-red-500 transition-colors">{s.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4 flex-grow font-medium">{s.description}</p>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center group-hover:border-red-500/30">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 group-hover:text-red-500">Initialize</span>
                    <span className="text-slate-400 group-hover:text-red-500 group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- ACTIVE CHAT UI ---
  return (
    <div className="pt-20 min-h-screen bg-slate-100 dark:bg-[#050914] flex overflow-hidden font-sans">

      {/* LEFT SIDEBAR (Console Style) */}
      <aside className="w-72 bg-white dark:bg-[#0B1221] border-r border-slate-200 dark:border-slate-800/50 flex flex-col relative z-20 shadow-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800/50">
          <button onClick={() => setStep('scenario')} className="w-full py-3 px-4 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white rounded-none font-bold text-xs uppercase tracking-widest transition-all mb-6" style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}>
            + New Simulation
          </button>
          <div className="space-y-1">
            <Link to="/dashboard" className="flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-blue-500">
              <span className="text-lg">📊</span>
              <span className="text-xs font-bold uppercase tracking-wider">Dashboard</span>
            </Link>
            <button className="w-full flex items-center gap-4 p-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-blue-500 text-left">
              <span className="text-lg">⚙️</span>
              <span className="text-xs font-bold uppercase tracking-wider">Config</span>
            </button>
          </div>
        </div>

        <div className="mt-4 px-6 overflow-y-auto flex-grow">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Session Logs</p>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-blue-900/10 border border-slate-200 dark:border-blue-500/20 text-xs font-medium dark:text-blue-200 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-blue-500"></div>
              <span className="block text-[8px] text-blue-400 mb-1">ACTIVE NOW</span>
              {selectedScenario}
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-[#080c17] border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm border border-slate-300 dark:border-slate-600">OP</div>
            <div>
              <p className="text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest">Operator</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-[8px] text-slate-500 font-mono">LINK_ESTABLISHED</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* CENTER STAGE */}
      <div className="flex-grow flex flex-col relative h-[calc(100vh-5rem)]">

        {/* HEADER BAR (Purple Mecha Style) */}
        <div className="h-16 bg-white dark:bg-[#0B1221] border-b border-slate-200 dark:border-purple-900/30 flex items-center justify-between px-8 z-30 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center rounded-lg border border-purple-200 dark:border-purple-500/30">
              {SCENARIOS.find(s => s.id === selectedScenario)?.icon}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{SCENARIOS.find(s => s.id === selectedScenario)?.title}</h2>
              <p className="text-[10px] text-purple-500 font-mono">ENCRYPTION: AES-256 // MODE: SIMULATION</p>
            </div>
          </div>
          <button onClick={saveAndExitSession} className="px-4 py-1.5 border border-red-200 dark:border-red-900/50 text-red-500 text-[10px] font-bold uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            Abort Mission
          </button>
        </div>

        {/* CHAT AREA */}
        <div className="flex-grow flex relative overflow-hidden">

          {/* Messages */}
          <div ref={scrollRef} className={`flex-grow overflow-y-auto p-8 space-y-8 bg-slate-100 dark:bg-[#050914] transition-all duration-500 ${showMentor ? 'w-1/2' : 'w-full'}`}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pl-4 animate-pulse">
                <span>INCOMING_TRANSMISSION</span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
              </div>
            )}
          </div>

          {/* MENTOR PANEL (Right Side Slide-in) */}
          {showMentor && risk && (
            <div className="w-1/2 bg-white dark:bg-[#0B1221] border-l border-slate-200 dark:border-slate-800 flex flex-col relative shadow-2xl animate-slide-in-right z-20">
              {/* Pink/Yellow Gradient Top Border */}
              <div className="h-1 w-full bg-gradient-to-r from-pink-500 via-orange-500 to-yellow-500"></div>

              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-500 text-white flex items-center justify-center font-bold text-lg rounded shadow-lg shadow-pink-500/30">!</div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-sm">Critical Intervention</h3>
                </div>
                <div className="text-[10px] font-mono text-pink-500 animate-pulse">THREAT DETECTED</div>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-8">
                <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Vulnerability Analysis</p>
                  <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{risk.explanation}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 border border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10 rounded">
                    <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mb-1">Attack Vector</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{risk.manipulationTactic}</p>
                  </div>
                  <div className="p-4 border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 rounded">
                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">Risk Level</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">CRITICAL</p>
                  </div>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Recommended Protocol</p>
                  <p className="text-blue-800 dark:text-blue-200 font-medium italic">"{risk.guidance}"</p>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex gap-4 bg-slate-50 dark:bg-[#080c17]">
                <button onClick={restartScenario} className="flex-1 py-3 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">Retry</button>
                <button onClick={continueScenario} className="flex-1 py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-pink-600/20">Proceed</button>
              </div>
            </div>
          )}
        </div>

        {/* INPUT AREA (Cyan Bracket Style) */}
        <div className="p-6 bg-white dark:bg-[#0B1221] border-t border-slate-200 dark:border-slate-800 z-30">
          <div className="max-w-4xl mx-auto relative group">
            {/* Frame Brackets */}
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-slate-300 dark:border-cyan-500/50 group-focus-within:border-cyan-500 transition-colors"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-slate-300 dark:border-cyan-500/50 group-focus-within:border-cyan-500 transition-colors"></div>

            <form onSubmit={handleSendMessage} className="relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={showMentor || isLoading}
                placeholder={showMentor ? "AWAITING USER DECISION..." : "ENTER RESPONSE..."}
                className="w-full bg-slate-100 dark:bg-[#050914] border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white px-6 py-4 text-sm font-mono focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={showMentor || isLoading}
                className="absolute right-2 top-2 bottom-2 px-6 bg-slate-900 dark:bg-cyan-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-slate-800 dark:hover:bg-cyan-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-all"
              >
                Transmit
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Training;