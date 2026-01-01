// Auth API Client
import type { LoginCredentials, LoginResponse, ApiResponse, User } from '../types';
import { getToken, setToken, removeToken } from './token.utils';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ============================================
// API REQUEST HELPER
// ============================================
interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean;
}

const apiRequest = async <T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> => {
    const { skipAuth, ...fetchOptions } = options;
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    if (token && !skipAuth) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
};

// ============================================
// AUTH API
// ============================================
export const authApi = {
    /**
     * Login user with email and password
     */
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiRequest<LoginResponse>('/open/api/auth/login_user', {
            method: 'POST',
            body: JSON.stringify(credentials),
            skipAuth: true,
        });

        // Backend returns jwt_token, not token
        if (response.success && response.jwt_token) {
            setToken(response.jwt_token);
        }

        return response;
    },

    /**
     * Logout user and clear token
     */
    logout: (): void => {
        removeToken();
    },

    /**
     * Get current user profile
     */
    getProfile: async () => {
        return apiRequest<ApiResponse<{ user: User }>>('/api/auth/profile');
    },
};

export default authApi;
