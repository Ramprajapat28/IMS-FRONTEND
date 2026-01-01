import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';
import type { Order, OrderFilters } from '../types';

export type { Order, OrderFilters };

// ============================================
// ORDERS API
// ============================================

export const ordersApi = {
    getAll: async (page = 1, limit = 10, filters?: OrderFilters) => {
        let url = `/api/orders/all?page=${page}&limit=${limit}`;
        if (filters?.product_id) url += `&product_id=${filters.product_id}`;
        if (filters?.shelf_id) url += `&shelf_id=${filters.shelf_id}`;
        if (filters?.status) url += `&status=${filters.status}`;

        return apiRequest<ApiResponse<Order[]> & { pagination: PaginationInfo }>(url);
    },

    getById: async (orderId: number) => {
        return apiRequest<ApiResponse<Order>>(`/api/orders/orderId/${orderId}`);
    },

    updateStatus: async (orderId: number, status: string) => {
        return apiRequest<ApiResponse<Order>>(`/api/orders/status/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};
