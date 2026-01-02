// Profile API Client
import type { ProfileResponse, UpdateProfileData, ApiResponse } from '../types';
import apiRequest from '@/services/api';

// ============================================
// PROFILE API
// ============================================
export const profileApi = {
    /**
     * Get user profile by user ID
     */
    getProfile: async (userId: number): Promise<ProfileResponse> => {
        const response = await apiRequest<ProfileResponse>(`/api/users/profile/${userId}`, {
            method: 'GET',
        });
        return response;
    },

    /**
     * Update user profile
     */
    updateProfile: async (userId: number, data: UpdateProfileData): Promise<ApiResponse<any>> => {
        const response = await apiRequest<ApiResponse<any>>(`/api/users/profile/update/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
        return response;
    },
};

export default profileApi;
