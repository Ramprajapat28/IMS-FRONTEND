// Auth API Client
import type { LoginCredentials, LoginResponse, ApiResponse, User } from '../types';
import {  setToken, removeToken } from './token.utils';
import apiRequest from '@/services/api';



// ============================================
// API REQUEST HELPER
// ============================================


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
