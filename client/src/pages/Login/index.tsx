
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
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Check for OAuth errors or messages in URL
    useEffect(() => {
        const errorParam = searchParams.get('error');
        const messageParam = searchParams.get('message');

        if (errorParam) {
            setError(`Authentication failed: ${errorParam}`);
        }

        if (messageParam === 'verified') {
            setMessage('Email verified successfully! You can now log in.');
        } else if (messageParam === 'email_verified') {
            setMessage('Email verified! Terminal access granted.');
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading('email');

        try {
            await authService.login(email, password);
            onLogin();
            navigate('/training');
        } catch (err: any) {
            setError(err.message);
            if (err.message.includes('Account not found')) {
                navigate(`/signup?email=${encodeURIComponent(email)}&error=not_found`);
            }
        } finally {
            setIsLoading(null);
        }
    };

    const handleGoogleLogin = () => {
        setIsLoading('google');
        setError(null);
        authService.loginWithGoogle();
    };

    const handleGithubLogin = () => {
        setIsLoading('github');
        setError(null);
        authService.loginWithGithub();
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-[#0B0F19] relative overflow-hidden font-sans pt-32 pb-24 transition-colors duration-500">

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
                    <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-56 h-10 bg-slate-50 dark:bg-[#0F1623] border border-blue-500 dark:border-purple-500 flex items-center justify-center z-20 transition-colors"
                        style={{ clipPath: 'polygon(15% 0, 85% 0, 100% 50%, 85% 100%, 15% 100%, 0% 50%)' }}>
                        <span className="text-blue-600 dark:text-purple-300 font-bold tracking-widest text-xs uppercase glow-text">Identity Verification</span>
                    </div>


                    {/* === LOGIN FORM CONTENT === */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Access Terminal</h1>
                        <p className="text-slate-500 dark:text-purple-300/60 text-sm font-mono tracking-tighter uppercase">// Enter credentials to proceed</p>
                    </div>

                    {/* Success Message */}
                    {message && (
                        <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-sm rounded-none font-mono uppercase tracking-widest text-center">
                            {message}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-none font-mono uppercase tracking-widest">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        {/* Email Input */}
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

                        {/* Password Input */}
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
                                <input type="checkbox" className="mr-2 rounded bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-purple-900" />
                                <span>Keep Session Active</span>
                            </label>
                            <a href="#" className="hover:text-slate-900 dark:hover:text-white transition-colors underline decoration-blue-500/30 dark:decoration-purple-500/30 font-bold">Reset Key?</a>
                        </div>

                        {/* Primary Button */}
                        <button
                            type="submit"
                            disabled={!!isLoading}
                            className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-purple-700 dark:to-indigo-700 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-purple-600 dark:hover:to-indigo-600 text-white font-bold uppercase tracking-widest shadow-xl dark:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all transform hover:scale-[1.01] border border-blue-400/30 dark:border-purple-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading === 'email' ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                    <span>Establishing Connection...</span>
                                </div>
                            ) : 'Initiate Login'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative flex py-6 items-center">
                        <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
                        <span className="flex-shrink-0 mx-4 text-xs text-slate-400 dark:text-purple-500/50 font-mono">OR AUTHENTICATE VIA</span>
                        <div className="flex-grow border-t border-slate-200 dark:border-purple-900/50"></div>
                    </div>

                    {/* Social Login Buttons Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={!!isLoading}
                            className={`w-full py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold flex items-center justify-center gap-3 transition-colors border border-slate-200 ${isLoading === 'google' ? 'opacity-70 cursor-wait' : ''}`}
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading === 'google' ? (
                                <div className="w-5 h-5 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                            ) : (
                                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                            )}
                            <span className="text-sm">Google</span>
                        </button>

                        {/* GitHub Login Button */}
                        <button
                            type="button"
                            onClick={handleGithubLogin}
                            disabled={!!isLoading}
                            className={`w-full py-3 bg-[#24292e] hover:bg-[#2c3238] text-white font-bold flex items-center justify-center gap-3 transition-colors border border-[#30363d] ${isLoading === 'github' ? 'opacity-70 cursor-wait' : ''}`}
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading === 'github' ? (
                                <div className="w-5 h-5 border-2 border-slate-600 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <img src="https://www.svgrepo.com/show/447222/github-fill.svg" alt="GitHub" className="w-5 h-5 filter invert" />
                            )}
                            <span className="text-sm">GitHub</span>
                        </button>
                    </div>

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
