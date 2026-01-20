/**
 * OAuth Callback Page
 * Handles the redirect from OAuth providers and stores the token
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

const AuthCallback: React.FC = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Processing authentication...');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                const token = searchParams.get('token');
                const provider = searchParams.get('provider');
                const error = searchParams.get('error');

                if (error) {
                    setStatus('error');
                    setMessage(`Authentication failed: ${error}`);
                    setTimeout(() => navigate('/login'), 3000);
                    return;
                }

                if (token && provider) {
                    authService.setToken(token);
                    setStatus('success');
                    setMessage(`Successfully authenticated with ${provider}!`);

                    // Redirect to training page after short delay
                    setTimeout(() => {
                        navigate('/training');
                    }, 1500);
                } else {
                    setStatus('error');
                    setMessage('No authentication token received');
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (err) {
                setStatus('error');
                setMessage('Authentication processing failed');
                setTimeout(() => navigate('/login'), 3000);
            }
        };

        handleCallback();
    }, [searchParams, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0B0F19]">
            <div className="text-center p-8">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 dark:border-purple-500 mx-auto mb-4"></div>
                        <p className="text-slate-600 dark:text-slate-400">{message}</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-semibold">{message}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Redirecting...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                        <p className="text-red-600 dark:text-red-400 font-semibold">{message}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Redirecting to login...</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default AuthCallback;
