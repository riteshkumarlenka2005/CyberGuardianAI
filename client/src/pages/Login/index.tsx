
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth
    onLogin();
    navigate('/training');
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    console.log("Logging in with Google...");
    onLogin();
    navigate('/training');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-[#0B0F19] relative overflow-hidden font-sans transition-colors duration-500 pt-28 pb-20">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/50 via-white dark:via-[#0B0F19] to-white dark:to-[#0B0F19]"></div>
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-purple-900/50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-200 dark:via-purple-900/50 to-transparent"></div>

      {/* === THE MECHA CARD CONTAINER === */}
      <div className="relative w-full max-w-lg mx-4 z-10">
        
        {/* 1. GLOWING OUTER BORDER EFFECTS */}
        <div className="absolute -inset-[2px] bg-gradient-to-b from-blue-400 dark:from-purple-600 via-transparent to-blue-400 dark:to-purple-600 opacity-20 dark:opacity-50 blur-sm rounded-lg"></div>
        
        {/* 2. MAIN CARD BODY */}
        <div className="relative bg-slate-50 dark:bg-[#0F1623] border border-blue-100 dark:border-purple-900/30 p-10 pt-16 pb-20 shadow-2xl backdrop-blur-sm transition-colors duration-500">
            
            {/* === CORNER DECORATIONS === */}
            
            {/* Top Left */}
            <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute top-0 left-12 w-16 h-4 bg-blue-600 dark:bg-purple-700 transform -skew-x-[45deg] origin-top-left flex items-center justify-center gap-1 overflow-hidden border-b border-blue-400 dark:border-purple-400">
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                </div>
                <div className="absolute top-12 left-0 w-4 h-12 bg-blue-600 dark:bg-purple-700 transform -skew-y-[45deg] origin-top-left flex flex-col items-center justify-center gap-1 border-r border-blue-400 dark:border-purple-400">
                     <div className="w-4 h-1 bg-white transform skew-y-[45deg]"></div>
                     <div className="w-4 h-1 bg-white transform skew-y-[45deg]"></div>
                </div>
            </div>

            {/* Top Right */}
            <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
                <div className="absolute top-0 right-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute top-0 right-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute top-0 right-12 w-16 h-4 bg-blue-600 dark:bg-purple-700 transform skew-x-[45deg] origin-top-right flex items-center justify-center gap-1 overflow-hidden border-b border-blue-400 dark:border-purple-400">
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                </div>
                <div className="absolute top-12 right-0 w-4 h-12 bg-blue-600 dark:bg-purple-700 transform skew-y-[45deg] origin-top-right flex flex-col items-center justify-center gap-1 border-l border-blue-400 dark:border-purple-400">
                     <div className="w-4 h-1 bg-white transform -skew-y-[45deg]"></div>
                     <div className="w-4 h-1 bg-white transform -skew-y-[45deg]"></div>
                </div>
            </div>

            {/* Bottom Left */}
            <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute bottom-0 left-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                 <div className="absolute bottom-0 left-12 w-16 h-4 bg-blue-600 dark:bg-purple-700 transform skew-x-[45deg] origin-bottom-left flex items-center justify-center gap-1 overflow-hidden border-t border-blue-400 dark:border-purple-400">
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform -skew-x-[45deg]"></div>
                </div>
                <div className="absolute bottom-12 left-0 w-4 h-12 bg-blue-600 dark:bg-purple-700 transform skew-y-[45deg] origin-bottom-left flex flex-col items-center justify-center gap-1 border-r border-blue-400 dark:border-purple-400">
                     <div className="w-4 h-1 bg-white transform -skew-y-[45deg]"></div>
                     <div className="w-4 h-1 bg-white transform -skew-y-[45deg]"></div>
                </div>
            </div>

            {/* Bottom Right */}
            <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
                <div className="absolute bottom-0 right-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                <div className="absolute bottom-0 right-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                 <div className="absolute bottom-0 right-12 w-16 h-4 bg-blue-600 dark:bg-purple-700 transform -skew-x-[45deg] origin-bottom-right flex items-center justify-center gap-1 overflow-hidden border-t border-blue-400 dark:border-purple-400">
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                    <div className="w-1 h-6 bg-white transform skew-x-[45deg]"></div>
                </div>
                <div className="absolute bottom-12 right-0 w-4 h-12 bg-blue-600 dark:bg-purple-700 transform -skew-y-[45deg] origin-bottom-right flex flex-col items-center justify-center gap-1 border-l border-blue-400 dark:border-purple-400">
                     <div className="w-4 h-1 bg-white transform skew-y-[45deg]"></div>
                     <div className="w-4 h-1 bg-white transform skew-y-[45deg]"></div>
                </div>
            </div>

            {/* === BOTTOM CENTER TAB === */}
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-48 h-10 bg-slate-50 dark:bg-[#0F1623] border border-blue-500 dark:border-purple-500 flex items-center justify-center z-20 transition-colors"
                 style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
                <span className="text-blue-600 dark:text-purple-300 font-bold tracking-widest text-xs uppercase glow-text">Secure Access</span>
            </div>


            {/* === LOGIN FORM CONTENT === */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Identity Verification</h1>
                <p className="text-slate-500 dark:text-purple-300/60 text-sm font-mono tracking-tighter uppercase">// Enter credentials to proceed</p>
            </div>
          
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Input 1 */}
                <div className="group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-white transition-colors">Email Address</label>
                    <div className="relative">
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all outline-none placeholder-slate-300 dark:placeholder-slate-600 font-mono text-sm"
                            placeholder="OPERATOR@CYBER.AI"
                        />
                        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400 dark:border-purple-500 opacity-50"></div>
                        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-400 dark:border-purple-500 opacity-50"></div>
                    </div>
                </div>

                {/* Input 2 */}
                <div className="group">
                    <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2 group-focus-within:text-blue-600 dark:group-focus-within:text-white transition-colors">Password</label>
                    <div className="relative">
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all outline-none placeholder-slate-300 dark:placeholder-slate-600 font-mono text-sm"
                            placeholder="ACCESS CODE"
                        />
                         <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400 dark:border-purple-500 opacity-50"></div>
                         <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-blue-400 dark:border-purple-500 opacity-50"></div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/80">
                    <label className="flex items-center hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
                        <input type="checkbox" className="mr-2 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-purple-900 text-blue-600 dark:text-purple-600 focus:ring-blue-500 dark:focus:ring-purple-500" />
                        <span>Keep Session Active</span>
                    </label>
                    <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors underline decoration-blue-500/50 dark:decoration-purple-500/50">Reset Key?</a>
                </div>

                {/* Primary Button */}
                <button 
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-purple-700 dark:to-indigo-700 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-bold uppercase tracking-widest shadow-xl dark:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all transform hover:scale-[1.01] border border-blue-400/30 dark:border-purple-400/30"
                    style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                >
                    Initiate Login
                </button>
            </form>

            {/* Divider */}
            <div className="relative flex py-6 items-center">
                <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
                <span className="flex-shrink-0 mx-4 text-xs text-slate-400 dark:text-purple-500/50 font-mono">OR AUTHENTICATE VIA</span>
                <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
            </div>

            {/* Google Login Button */}
            <button 
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 transition-colors border border-slate-200"
                style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
            >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                <span>Continue with Google</span>
            </button>

            <div className="mt-8 text-center">
                <p className="text-xs text-slate-500">
                    New User? <Link to="/signup" className="text-blue-600 dark:text-purple-400 hover:text-slate-900 dark:hover:text-white font-bold underline decoration-blue-500/30 dark:decoration-purple-500/30">Register Credentials</Link>
                </p>
            </div>

        </div>
      </div>

      <style>{`
        .glow-text {
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.4);
        }
        .dark .glow-text {
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.7);
        }
      `}</style>
    </div>
  );
};

export default Login;
