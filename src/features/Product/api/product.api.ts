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

    getDetails: async (id: number) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/productDetails/${id}`);
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

    update: async (id: number, data: Partial<CreateProductData> | FormData) => {
        return apiRequest<ApiResponse<Product>>(`/api/products/update/${id}`, {
            method: 'PUT',
            body: data instanceof FormData ? data : JSON.stringify(data),
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

    getByCategoryWithStock: async (categoryName: string, page = 1, limit = 10) => {
        return apiRequest<ApiResponse<Product[]> & { pagination: PaginationInfo }>(
            `/api/products/category/${categoryName}/with-stock?page=${page}&limit=${limit}`
        );
    },

    getPresignedUrl: async (fileName: string, functionality: string, subFunctionality?: string) => {
        return apiRequest<{ presignedUrl: string; cdnUrl: string; filePath: string }>('/api/products/presigned-url', {
            method: 'POST',
            body: JSON.stringify({ fileName, functionality, subFunctionality }),
        });
    },
};
