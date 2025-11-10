import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from 'react';

import {
    authService,
    type LoginParams,
    type SignupParams,
} from './authService';
import { User } from '@/types/User';
import { UserContext } from '../../contexts/UserContext';
import axios from 'axios';

type AuthContextType = {
    user: User;
    login: (params: LoginParams) => Promise<{ success: boolean; error?: any }>;
    signup: (
        params: SignupParams
    ) => Promise<{ success: boolean; error?: any }>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);

    const userContext = useContext(UserContext);

    const clearSession = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('accessToken');
        delete axios.defaults.headers.common['Authorization'];
        setUser(null);
        userContext?.setUser(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('accessToken');

        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    const login = async (params: LoginParams) => {
        try {
            // const loginData = await authService.login(params);

            // const { accessToken, email, roles, username } = loginData;
            const { accessToken, email, roles, username } = {
                accessToken: '1234567890',
                email: 'test@gmail.com',
                roles: [{ id: 1, name: 'MANAGER' }],
                username: 'deepan_user',
            };

            const userData: User = {
                email: email,
                username: username,
                role: roles.length > 0 ? roles[0].name : 'USER',
            };

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('user', JSON.stringify(userData));

            axios.defaults.headers.common[
                'Authorization'
            ] = `Bearer ${accessToken}`;

            setUser(userData);
            userContext?.setUser(userData);

            return { success: true };
        } catch (error: any) {
            clearSession();
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed',
            };
        }
    };

    const signup = async (params: SignupParams) => {
        try {
            await authService.signup(params);

            return { success: true };
        } catch (error: any) {
            return {
                success: false,
                error: error.response?.data?.message || 'Signup failed',
            };
        }
    };

    const logout = clearSession;

    const value = {
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
