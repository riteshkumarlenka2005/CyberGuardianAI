
import React from 'react';
import { RiskAnalysis } from '../../types';
import HUDFrame from '../HUDFrame';

interface MentorOverlayProps {
  risk: RiskAnalysis;
  onRetry: () => void;
  onContinue: () => void;
}

const MentorOverlay: React.FC<MentorOverlayProps> = ({ risk, onRetry, onContinue }) => {
  return (
    <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="max-w-3xl w-full animate-fade-in">
        <HUDFrame className="dark:hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">MENTOR DIAGNOSTIC</h3>
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">System Pause: Risk Detected</p>
              </div>
            </div>
            <div className="px-4 py-1.5 bg-red-600 text-white text-[10px] font-bold uppercase tracking-tighter">
              Alert: Critical
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-5 bg-orange-50 border-l-4 border-orange-500 rounded-r-lg">
                <h4 className="text-[10px] font-bold text-orange-800 uppercase tracking-widest mb-2">Manipulation Tactic</h4>
                <p className="text-slate-800 font-bold text-lg leading-tight uppercase">{risk.manipulationTactic}</p>
              </div>
              
              <div className="space-y-2">
                <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Assessment</h5>
                <p className="text-slate-700 text-sm leading-relaxed font-medium">
                  {risk.explanation}
                </p>
              </div>
            </div>

            <div className="space-y-8 flex flex-col justify-between">
              <div className="p-6 border border-slate-200 bg-white rounded-lg shadow-sm">
                <h5 className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-3">Counter-Measure Protocol</h5>
                <p className="text-slate-600 text-sm italic font-medium leading-relaxed">
                  "{risk.guidance}"
                </p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={onRetry}
                  className="flex-1 px-4 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center border border-black"
                >
                  Apply Correction
                </button>
                <button 
                  onClick={onContinue}
                  className="flex-1 px-4 py-4 bg-transparent border border-slate-300 text-slate-500 text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center"
                >
                  Accept Risk
                </button>
              </div>
            </div>
          </div>
        </HUDFrame>

        {/* Dark Mode Fallback (Original Card Style) */}
        <div className="hidden dark:block max-w-xl mx-auto w-full bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-800">
          <div className="bg-blue-600 p-6 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <h3 className="text-lg font-bold">CyberGuardian Mentor</h3>
                <p className="text-xs text-blue-100">Interaction Frozen • Risk Detected</p>
              </div>
            </div>
            <div className="px-3 py-1 bg-red-500 rounded-full text-white text-[10px] font-bold uppercase">Critical Warning</div>
          </div>

          <div className="p-8">
            <div className="mb-6 p-4 bg-orange-900/20 border-l-4 border-orange-500 rounded-r-xl">
              <h4 className="text-orange-400 font-bold text-sm mb-1 uppercase tracking-tight">Manipulation Tactic: {risk.manipulationTactic}</h4>
              <p className="text-slate-300 text-sm leading-relaxed">{risk.explanation}</p>
            </div>

            <div className="space-y-6">
              <div>
                <h5 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Safe Response Guidance</h5>
                <div className="bg-slate-800 p-4 rounded-xl text-sm border border-slate-700 text-slate-300 italic">
                  "{risk.guidance}"
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  onClick={onRetry}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md flex items-center justify-center"
                >
                  Retry Response
                </button>
                <button 
                  onClick={onContinue}
                  className="flex-1 px-6 py-4 bg-slate-800 text-slate-400 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center justify-center"
                >
                  Accept Risk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorOverlay;
