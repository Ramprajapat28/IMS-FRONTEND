import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';
import type { Product, CreateProductData } from '../types';

export type { Product, CreateProductData };

// ============================================
// PRODUCTS API
// ============================================

export const productsApi = {
    getAll: async (page = 1, limit = 100) => {
        return apiRequest<ApiResponse<Product[]> & { pagination: PaginationInfo }>(
            `/api/products/all?page=${page}&limit=${limit}`
        );
    },

    getById: async (id: number) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/${id}`);
    },

    getBySku: async (sku: string) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/sku/${sku}`);
    },

    create: async (data: CreateProductData | FormData) => {
        return apiRequest<ApiResponse<Product>>('/api/products/create', {
            method: 'POST',
            body: data instanceof FormData ? data : JSON.stringify(data),
        });
    },

    update: async (id: number, data: Partial<CreateProductData>) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: number) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/delete/${id}`, {
            method: 'POST',
        });
    },

    getBarcode: async (barcode: string): Promise<Blob> => {
        return apiRequest<Blob>(`/api/products/barcode/${barcode}`);
    },
};
