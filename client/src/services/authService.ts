/**
 * Authentication Service for CyberGuardian AI
 * Handles OAuth authentication with Google and GitHub
 */

const API_URL = 'http://localhost:8000';

export interface User {
    id: string;
    email: string;
    name: string;
    picture: string;
    provider: 'google' | 'github';
}

export interface AuthTokens {
    token: string;
    provider: string;
}

class AuthService {
    private tokenKey = 'cyberguardian_token';
    private userKey = 'cyberguardian_user';

    /**
     * Initiate Google OAuth login
     */
    loginWithGoogle(): void {
        window.location.href = `${API_URL}/api/v1/auth/google/login`;
    }

    /**
     * Initiate GitHub OAuth login
     */
    loginWithGithub(): void {
        window.location.href = `${API_URL}/api/v1/auth/github/login`;
    }

    /**
     * Handle OAuth callback - extract and store token
     */
    handleCallback(): AuthTokens | null {
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const provider = params.get('provider');

        if (token && provider) {
            this.setToken(token);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
            return { token, provider };
        }

        return null;
    }

    /**
     * Get stored JWT token
     */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Store JWT token
     */
    setToken(token: string): void {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Remove stored token and user data
     */
    clearAuth(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated(): boolean {
        const token = this.getToken();
        if (!token) return false;

        // Check if token is expired
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            return Date.now() < expiry;
        } catch {
            return false;
        }
    }

    /**
     * Get current user from token
     */
    getCurrentUser(): User | null {
        const token = this.getToken();
        if (!token) return null;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return {
                id: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                provider: payload.provider
            };
        } catch {
            return null;
        }
    }

    /**
     * Fetch user info from backend (to verify token)
     */
    async fetchUserInfo(): Promise<User | null> {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/api/v1/auth/me?token=${token}`);
            if (!response.ok) {
                this.clearAuth();
                return null;
            }
            return await response.json();
        } catch {
            return null;
        }
    }

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        try {
            await fetch(`${API_URL}/api/v1/auth/logout`, { method: 'POST' });
        } catch {
            // Ignore errors, clear local storage anyway
        }
        this.clearAuth();
    }
}

export const authService = new AuthService();
export default authService;
