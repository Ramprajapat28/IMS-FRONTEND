import apiRequest, { type ApiResponse } from '@/services/api';
import type { SellingProduct } from '../types';

export const dashboardApi = {
    getTopSelling: async () => {
        return apiRequest<ApiResponse<SellingProduct[]>>('/api/dashboard/top-selling');
    },

    getLeastSelling: async () => {
        return apiRequest<ApiResponse<SellingProduct[]>>('/api/dashboard/least-selling');
    },
    getStockStatus: async (lowStockLimit: number = 10) => {
        return apiRequest<ApiResponse<import('../types').StockStatusResponse>>(`/api/dashboard/stock-status?lowStock=${lowStockLimit}`);
    },
    getTotalProducts: async () => {
        return apiRequest<ApiResponse<{ totalProducts: number }>>('/api/dashboard/total_products');
    },
    getTotalOrders: async () => {
        return apiRequest<ApiResponse<{ totalOrder: number }>>('/api/dashboard/total_order');
    },
};
