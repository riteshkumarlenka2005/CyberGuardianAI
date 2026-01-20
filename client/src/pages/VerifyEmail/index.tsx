
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyEmail: React.FC = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        const tokenParam = searchParams.get('token');
        if (emailParam) setEmail(emailParam);
        if (tokenParam) setToken(tokenParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            await authService.verifyEmail(email, token);
            navigate('/login?message=verified');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-[#0B0F19] relative overflow-hidden font-sans pt-32 pb-24 transition-colors duration-500">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/50 via-white dark:via-[#0B0F19] to-white dark:to-[#0B0F19]"></div>

            <div className="relative w-full max-w-lg mx-4 z-10">
                <div className="absolute -inset-[2px] bg-gradient-to-b from-blue-400 dark:from-purple-600 via-transparent to-blue-400 dark:to-purple-600 opacity-20 dark:opacity-50 blur-sm rounded-lg"></div>

                <div className="relative bg-slate-50 dark:bg-[#0F1623] border border-blue-100 dark:border-purple-900/30 p-10 pt-16 pb-20 shadow-2xl backdrop-blur-sm transition-colors duration-500">

                    {/* Corner Decorations (Simplified for brevity but maintaining style) */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500 dark:border-purple-400"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Verify Identity</h1>
                        <p className="text-slate-500 dark:text-purple-300/60 text-sm font-mono tracking-tighter uppercase">// Enter the activation code sent to your email</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-none font-mono uppercase tracking-widest text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 outline-none font-mono text-sm"
                                placeholder="OPERATOR@CYBER.AI"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2">Activation Token</label>
                            <input
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                className="w-full px-4 py-3 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 outline-none font-mono text-sm tracking-[0.2em]"
                                placeholder="TOKEN_HERE"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-purple-700 dark:to-indigo-700 text-white font-bold uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.01] disabled:opacity-50"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading ? 'Processing...' : 'Verify & Activate'}
                        </button>
                    </form>

                    <div className="mt-8 text-center font-mono text-[10px] text-blue-500 dark:text-purple-400/50 uppercase tracking-widest">
                        Check your server console for the token
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
