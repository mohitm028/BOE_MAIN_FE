import axios from 'axios';

interface AuthResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface LoginData {
    accessToken: string;
    expiresIn: string;
    username: string;
    email: string;
    roles: Role[];
}

interface Role {
    id: number;
    name: 'CUSTOMER' | 'ADMIN';
}

export interface LoginParams {
    username: string;
    password: string;
}

export interface SignupParams {
    email: string;
    username: string;
    password: string;
}

const API_BASE = 'http://localhost:8080/api/auth';

export const authService = {
    login: async (params: LoginParams) => {
        const response = await axios.post<AuthResponse<LoginData>>(
            `${API_BASE}/signin`,
            params
        );
        return response.data.data;
    },

    signup: (params: SignupParams) => {
        const url = `${API_BASE}/signup`;
        return axios.post(url, params);
    },
};
