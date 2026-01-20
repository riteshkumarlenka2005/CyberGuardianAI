/**
 * Auth Context for CyberGuardian AI
 * Provides authentication state throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    loginWithGoogle: () => void;
    loginWithGithub: () => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state
    useEffect(() => {
        initializeAuth();
    }, []);

    const initializeAuth = async () => {
        try {
            // Check if this is an OAuth callback
            const callback = authService.handleCallback();

            if (callback) {
                // New login, fetch user info
                const userData = authService.getCurrentUser();
                setUser(userData);
            } else if (authService.isAuthenticated()) {
                // Existing session
                const userData = authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.error('Auth initialization error:', error);
            authService.clearAuth();
        } finally {
            setIsLoading(false);
        }
    };

    const loginWithGoogle = () => {
        authService.loginWithGoogle();
    };

    const loginWithGithub = () => {
        authService.loginWithGithub();
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    const refreshUser = async () => {
        const userData = await authService.fetchUserInfo();
        setUser(userData);
    };

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        loginWithGoogle,
        loginWithGithub,
        logout,
        refreshUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
