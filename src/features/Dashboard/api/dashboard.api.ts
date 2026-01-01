import apiRequest, { type ApiResponse } from '@/services/api';
import type { SellingProduct } from '../types';

export const dashboardApi = {
    getTopSelling: async () => {
        return apiRequest<ApiResponse<SellingProduct[]>>('/api/dashboard/top-selling');
    },

    getLeastSelling: async () => {
        return apiRequest<ApiResponse<SellingProduct[]>>('/api/dashboard/least-selling');
    },
};
