interface User {
    id: string;
    name: string;
    mbkId: string;
    role: string;
    exp: number;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

class AuthService {
    private readonly TOKEN_KEY = 'auth_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';

    async login(credentials: {
        mbkId: string;
        password: string;
    }): Promise<AuthState> {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': this.getCSRFToken(),
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                throw new Error('Authentication failed');
            }

            const { token, refreshToken, user } = await response.json();

            // Store tokens securely
            this.setToken(token);
            this.setRefreshToken(refreshToken);

            return {
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
            };
        } catch (error) {
            throw new Error(
                `Login failed: ${
                    error instanceof Error ? error.message : 'Unknown error'
                }`
            );
        }
    }

    async refreshToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${refreshToken}`,
                    'X-CSRF-Token': this.getCSRFToken(),
                },
            });

            const { token } = await response.json();
            this.setToken(token);
            return token;
        } catch {
            this.logout();
            return null;
        }
    }

    logout(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        window.location.href = '/login';
    }

    private getCSRFToken(): string {
        return (
            document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content') || ''
        );
    }

    private setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    private setRefreshToken(token: string): void {
        localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    isTokenValid(): boolean {
        const token = this.getToken();
        if (!token) return false;

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp * 1000 > Date.now();
        } catch {
            return false;
        }
    }

    // Mock login for development (remove in production)
    async mockLogin(credentials: {
        mbkId: string;
        name: string;
    }): Promise<AuthState> {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const mockUser: User = {
            id: '1',
            name: credentials.name,
            mbkId: credentials.mbkId,
            role: '',
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
        };

        if (mockUser.name === 'manager' && mockUser.mbkId === '123') {
            mockUser.role === 'approval';
            localStorage.setItem('role', 'approval');
            console.log('Role set to approval');
        } else if (mockUser.name === 'admin' && mockUser.mbkId === '456') {
            mockUser.role == 'admin';
            localStorage.setItem('role', 'admin');
            console.log('Role set to admin');
        } else {
            mockUser.role === 'user';
            console.log('Role set to user');
            localStorage.setItem('role', 'user');
        }
        const mockToken = btoa(
            JSON.stringify({
                sub: mockUser.id,
                exp: mockUser.exp,
                iat: Math.floor(Date.now() / 1000),
            })
        );

        this.setToken(mockToken);

        return {
            user: mockUser,
            token: mockToken,
            isAuthenticated: true,
            isLoading: false,
        };
    }
}

export const authService = new AuthService();
export type { User, AuthState };
