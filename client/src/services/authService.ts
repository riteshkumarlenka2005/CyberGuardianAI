/**
 * Authentication Service for CyberGuardian AI
 * Handles Local and OAuth authentication
 */

const API_URL = 'http://127.0.0.1:8000';

export interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    picture: string;
    email_verified: boolean;
    provider: 'local' | 'google' | 'github';
}

export interface AuthTokens {
    token: string;
    provider: string;
}

class AuthService {
    private tokenKey = 'cyberguardian_token';
    private userKey = 'cyberguardian_user';

    /**
     * Local Email/Password Login
     */
    async login(email: string, password: string): Promise<AuthTokens> {
        const response = await fetch(`${API_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            let errorMessage = 'Authentication failed';

            if (error.detail) {
                if (typeof error.detail === 'string') {
                    errorMessage = error.detail;
                } else if (Array.isArray(error.detail)) {
                    errorMessage = error.detail
                        .map((d: any) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
                        .join(', ');
                }
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        this.setToken(data.access_token);
        return { token: data.access_token, provider: 'local' };
    }

    /**
     * Local Account Registration
     */
    async signup(userData: any): Promise<void> {
        const response = await fetch(`${API_URL}/api/v1/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            let errorMessage = 'Registration failed';

            if (error.detail) {
                if (typeof error.detail === 'string') {
                    errorMessage = error.detail;
                } else if (Array.isArray(error.detail)) {
                    // FastAPI validation errors are often a list of objects
                    errorMessage = error.detail
                        .map((d: any) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
                        .join(', ');
                }
            }
            throw new Error(errorMessage);
        }
    }

    /**
     * Verify Email Token
     */
    async verifyEmail(email: string, token: string): Promise<void> {
        const response = await fetch(`${API_URL}/api/v1/auth/verify-email-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token })
        });

        if (!response.ok) {
            const error = await response.json();
            let errorMessage = 'Verification failed';

            if (error.detail) {
                if (typeof error.detail === 'string') {
                    errorMessage = error.detail;
                } else if (Array.isArray(error.detail)) {
                    errorMessage = error.detail
                        .map((d: any) => `${d.loc[d.loc.length - 1]}: ${d.msg}`)
                        .join(', ');
                }
            }
            throw new Error(errorMessage);
        }
    }

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
                id: parseInt(payload.sub),
                email: payload.email,
                name: payload.name,
                picture: payload.picture,
                provider: payload.provider
            } as any;
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
