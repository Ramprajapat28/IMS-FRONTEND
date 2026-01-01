import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';

// ============================================
// PRODUCTS API
// ============================================
export interface Product {
    product_id: number;
    name: string;
    sku: string;
    category?: string;
    description?: string;
    reorder_level?: number;
    stock_quantity?: number;
    location?: string;
    stock_details?: {
        item_id: number;
        product_id: number;
        warehouse_name: string;
        room_name: string;
        shelf_name: string;
        status: string;
    }[];
    product_image?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateProductData {
    name: string;
    sku: string;
    category?: string;
    description?: string;
    reorder_level?: number;
}

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
