
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import authService from '../../services/authService';

const VerifyEmail: React.FC = () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const emailParam = searchParams.get('email');
        if (emailParam) setEmail(emailParam);
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setIsLoading(true);

        try {
            await authService.verifyEmail(email, code);
            setIsVerified(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/v1/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('New verification code sent! Check your email.');
            } else {
                setError(data.detail || data.message || 'Failed to resend code');
            }
        } catch (err: any) {
            setError('Failed to resend verification code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Success state
    if (isVerified) {
        return (
            <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-[#0B0F19] relative overflow-hidden font-sans pt-32 pb-24 transition-colors duration-500">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/50 via-white dark:via-[#0B0F19] to-white dark:to-[#0B0F19]"></div>

                <div className="relative w-full max-w-lg mx-4 z-10">
                    <div className="absolute -inset-[2px] bg-gradient-to-b from-green-400 dark:from-green-600 via-transparent to-green-400 dark:to-green-600 opacity-20 dark:opacity-50 blur-sm rounded-lg"></div>

                    <div className="relative bg-slate-50 dark:bg-[#0F1623] border border-green-100 dark:border-green-900/30 p-10 pt-16 pb-20 shadow-2xl backdrop-blur-sm transition-colors duration-500 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Email Verified!</h1>
                        <p className="text-slate-500 dark:text-green-300/60 mb-8">
                            Your account has been successfully activated. You can now log in and start your cybersecurity training.
                        </p>

                        <Link
                            to="/login"
                            className="inline-block w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white font-bold uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.01]"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white dark:bg-[#0B0F19] relative overflow-hidden font-sans pt-32 pb-24 transition-colors duration-500">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50/50 dark:from-slate-900/50 via-white dark:via-[#0B0F19] to-white dark:to-[#0B0F19]"></div>

            <div className="relative w-full max-w-lg mx-4 z-10">
                <div className="absolute -inset-[2px] bg-gradient-to-b from-blue-400 dark:from-purple-600 via-transparent to-blue-400 dark:to-purple-600 opacity-20 dark:opacity-50 blur-sm rounded-lg"></div>

                <div className="relative bg-slate-50 dark:bg-[#0F1623] border border-blue-100 dark:border-purple-900/30 p-10 pt-16 pb-20 shadow-2xl backdrop-blur-sm transition-colors duration-500">

                    {/* Corner Decorations */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-blue-500 dark:border-purple-400"></div>
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-blue-500 dark:border-purple-400"></div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Verify Your Email</h1>
                        <p className="text-slate-500 dark:text-purple-300/60 text-sm">
                            Enter the 6-digit code sent to your email
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm rounded-none">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-sm rounded-none">
                            {success}
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
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="group">
                            <label className="block text-xs font-bold text-slate-500 dark:text-purple-400 uppercase tracking-wider mb-2">6-Digit Verification Code</label>
                            <input
                                type="text"
                                required
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-4 py-4 bg-white dark:bg-[#1A202C] border border-slate-200 dark:border-purple-900 text-slate-900 dark:text-white rounded-none focus:border-blue-500 dark:focus:border-purple-500 outline-none font-mono text-2xl tracking-[0.5em] text-center"
                                placeholder="000000"
                                maxLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || code.length !== 6}
                            className="w-full py-4 bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-purple-700 dark:to-indigo-700 text-white font-bold uppercase tracking-widest shadow-xl transition-all transform hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={handleResendCode}
                            disabled={isLoading}
                            className="text-blue-600 dark:text-purple-400 hover:underline text-sm font-medium disabled:opacity-50"
                        >
                            Didn't receive the code? Resend
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-slate-500 dark:text-purple-300/60 hover:text-slate-900 dark:hover:text-white text-sm">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
