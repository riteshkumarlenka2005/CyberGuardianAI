
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Check for OAuth errors in URL
    useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            setError(`Authentication failed: ${errorParam}`);
        }
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate email/password auth (implement if needed)
        onLogin();
        navigate('/training');
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setError(null);
        authService.loginWithGoogle();
    };

    const handleGithubLogin = () => {
        setIsLoading(true);
        setError(null);
        authService.loginWithGithub();
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

                    {/* Corner decorations - keeping existing design */}
                    <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                        <div className="absolute top-0 left-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400 shadow-[0_0_10px_rgba(59,130,246,0.5)] dark:shadow-[0_0_10px_#A855F7]"></div>
                    </div>
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none">
                        <div className="absolute top-0 right-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400"></div>
                        <div className="absolute top-0 right-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400"></div>
                    </div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none">
                        <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400"></div>
                        <div className="absolute bottom-0 left-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400"></div>
                    </div>
                    <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none">
                        <div className="absolute bottom-0 right-0 w-full h-[2px] bg-blue-500 dark:bg-purple-400"></div>
                        <div className="absolute bottom-0 right-0 w-[2px] h-full bg-blue-500 dark:bg-purple-400"></div>
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

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                        {/* Email Input */}
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all outline-none placeholder-slate-300 dark:placeholder-slate-600 font-mono text-sm"
                                placeholder="OPERATOR@CYBER.AI"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 focus:ring-1 focus:ring-blue-500 dark:focus:ring-purple-500 transition-all outline-none placeholder-slate-300 dark:placeholder-slate-600 font-mono text-sm"
                                placeholder="ACCESS CODE"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-purple-300/80">
                            <label className="flex items-center hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors">
                                <input type="checkbox" className="mr-2 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-purple-900" />
                                <span>Keep Session Active</span>
                            </label>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors underline">Reset Key?</a>
                        </div>

                        {/* Primary Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-purple-700 dark:to-indigo-700 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-bold uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading ? 'Authenticating...' : 'Initiate Login'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-slate-400 dark:text-purple-500/50 font-mono">OR AUTHENTICATE VIA</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
                    </div>

                    {/* OAuth Buttons */}
                    <div className="space-y-3">
                        {/* Google Login Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={isLoading}
                            className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 transition-colors border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span>Continue with Google</span>
                        </button>

                        {/* GitHub Login Button */}
                        <button
                            onClick={handleGithubLogin}
                            disabled={isLoading}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center justify-center gap-3 transition-colors border border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span>Continue with GitHub</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-slate-500">
                            New User? <Link to="/signup" className="text-blue-600 dark:text-purple-400 hover:text-slate-900 dark:hover:text-white font-bold underline">Register Credentials</Link>
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

