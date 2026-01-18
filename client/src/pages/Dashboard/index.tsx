import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { BADGES } from '../../constants';

const data = [
  { name: 'Mon', mistakes: 8, correct: 2 },
  { name: 'Tue', mistakes: 6, correct: 4 },
  { name: 'Wed', mistakes: 5, correct: 7 },
  { name: 'Thu', mistakes: 3, correct: 9 },
  { name: 'Fri', mistakes: 2, correct: 11 },
  { name: 'Sat', mistakes: 1, correct: 14 },
  { name: 'Sun', mistakes: 1, correct: 15 },
];

// --- REUSED FRAME: TechStatCard (Clean Rounded Style) ---
const TechStatCard = ({ label, value, trend, color, accentColor }: { label: string, value: string, trend: string, color: string, accentColor: string }) => (
  <div className="relative group h-full select-none">
    <div
      className="relative h-full bg-white dark:bg-slate-900 transition-all duration-300 group-hover:-translate-y-1 shadow-sm hover:shadow-lg border border-slate-200 dark:border-slate-800"
      style={{
        clipPath: 'polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px)'
      }}
    >
      <div className={`absolute top-0 left-0 w-full h-1 ${accentColor}`}></div>
      <div className="p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{label}</p>
        <div className="flex items-end justify-between">
          <span className={`text-4xl font-black ${color}`}>{value}</span>
          <span className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">{trend}</span>
        </div>
      </div>
    </div>
  </div>
);

// --- REUSED FRAME: MechaContainer (Purple Border) ---
const MechaContainer = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="relative w-full h-full bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-900/30 p-1">
    {/* Corner Accents */}
    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-purple-500"></div>
    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-purple-500"></div>
    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-500"></div>
    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-purple-500"></div>

    <div className="h-full bg-slate-50 dark:bg-[#0B1221] p-6 relative">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h3 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">{title}</h3>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-75"></div>
          <div className="w-1 h-1 bg-purple-500 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
      {children}
    </div>
  </div>
);

// --- REUSED FRAME: CyanBracketContainer ---
const CyanBracketContainer = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div className="relative w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-cyan-900/30 p-8 shadow-sm">
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500 dark:border-cyan-500"></div>
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500 dark:border-cyan-500"></div>

    <h3 className="text-lg font-bold mb-8 dark:text-white uppercase tracking-widest text-center">{title}</h3>
    {children}
  </div>
);


const Dashboard: React.FC = () => {
  return (
    <div className="pt-24 pb-12 bg-slate-50 dark:bg-[#02040a] min-h-screen transition-colors duration-300 font-sans">

      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="text-center md:text-left">
            <span className="text-blue-600 dark:text-blue-400 font-mono text-xs tracking-widest uppercase mb-2 block">// USER_METRICS_V3.1</span>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Personal Safety Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Tracking evolution from passive user to active defender.</p>
          </div>
          <div className="hidden md:block text-right">
            <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-900/50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-[10px] font-bold text-green-700 dark:text-green-400 uppercase tracking-widest">System Online</span>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Scenarios Completed', value: '12', trend: '+2 this week', color: 'text-blue-600 dark:text-blue-400', accent: 'bg-blue-500' },
            { label: 'Patterns Learned', value: '24', trend: 'Expert level', color: 'text-purple-600 dark:text-purple-400', accent: 'bg-purple-500' },
            { label: 'Mistakes Avoided', value: '48', trend: '94% improvement', color: 'text-emerald-600 dark:text-emerald-400', accent: 'bg-emerald-500' },
            { label: 'Safety Score', value: '820', trend: 'Top 5%', color: 'text-orange-600 dark:text-orange-400', accent: 'bg-orange-500' },
          ].map((stat, idx) => (
            <TechStatCard key={idx} label={stat.label} value={stat.value} trend={stat.trend} color={stat.color} accentColor={stat.accent} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

          <div className="h-[400px]">
            <MechaContainer title="Learning Curve (7 Days)">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip
                      cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                      contentStyle={{ borderRadius: '0px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px' }}
                    />
                    <Bar dataKey="correct" fill="#3b82f6" radius={[2, 2, 0, 0]} barSize={20} />
                    <Bar dataKey="mistakes" fill="#cbd5e1" className="dark:fill-slate-700" radius={[2, 2, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 flex justify-center space-x-8 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500"></div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Correct Decisions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-slate-300 dark:bg-slate-700"></div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Potential Mistakes</span>
                </div>
              </div>
            </MechaContainer>
          </div>

          <div className="h-[400px]">
            <MechaContainer title="Threat Recognition Accuracy">
              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '0px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff', fontSize: '12px' }}
                    />
                    <Line type="step" dataKey="correct" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3, strokeWidth: 1, fill: '#0f172a', stroke: '#8b5cf6' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30">
                <p className="text-center text-xs text-purple-600 dark:text-purple-300 font-mono">"Your ability to spot urgency tactics has increased by 40% this month."</p>
              </div>
            </MechaContainer>
          </div>

        </div>

        {/* Badges Section */}
        <CyanBracketContainer title="Achievements Unlocked">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 text-center">
            {BADGES.map((badge) => (
              <div key={badge.id} className="group cursor-help relative">
                <div className="w-16 h-16 mx-auto bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4 border border-slate-200 dark:border-slate-700 group-hover:border-blue-500 transition-all rounded-lg transform group-hover:scale-110">
                  {badge.icon}
                </div>
                <h4 className="text-[10px] font-bold text-slate-800 dark:text-white uppercase tracking-widest">{badge.name}</h4>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 bg-black text-white text-[9px] p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                  {badge.description}
                </div>
              </div>
            ))}
            {/* Locked Badges */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="opacity-30 grayscale">
                <div className="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-3xl mb-4 border border-slate-200 dark:border-slate-700 rounded-lg border-dashed">
                  🔒
                </div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">Locked</h4>
              </div>
            ))}
          </div>
        </CyanBracketContainer>

      </div>
    </div>
  );
};

export default Dashboard;