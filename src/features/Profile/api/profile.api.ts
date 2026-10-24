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

    getPresignedUrl: async (fileName: string, functionality: string, subFunctionality?: string) => {
        return apiRequest<{
            uploadUrl: string;
            cdnUrl: string;
            signature: string;
            timestamp: number;
            cloud_name: string;
            api_key: string;
            folder: string;
            public_id: string;
        }>('/api/products/presigned-url', {
            method: 'POST',
            body: JSON.stringify({ fileName, functionality, subFunctionality }),
        });
    },
};

export default profileApi;
