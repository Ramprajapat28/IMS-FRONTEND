import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';

// ============================================
// ITEMS API
// ============================================
export interface Item {
    item_id: number;
    product_id: number;
    shelf_id: number;
    status: string;
    created_at?: string;
    updated_at?: string;
}

export interface AddStockData {
    product_id: number;
    shelf_id?: number;
    rack_id?: number;
    quantity: number;
    remark?: string;
}

export interface RemoveStockData {
    product_id: number;
    shelf_id?: number;
    rack_id?: number;
    quantity: number;
    status?: string;
    mode?: string; // 🆕 Added mode
    order_id?: number; // Required for returns to update existing order
    remark?: string;
}

export interface OutwardScanData {
    item_id: number;
    status: string;
}

export const itemsApi = {
    getAll: async (productId: number, page = 1, limit = 10) => {
        return apiRequest<ApiResponse<Item[]> & { pagination: PaginationInfo }>(
            `/api/items/all?product_id=${productId}&page=${page}&limit=${limit}`
        );
    },

    getCount: async (productId: number) => {
        return apiRequest<ApiResponse<{ product_id: number; count: number }>>(
            `/api/items/count/${productId}`
        );
    },

    addStock: async (data: AddStockData) => {
        return apiRequest<ApiResponse<Item[]>>('/api/items/addStock', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    removeStock: async (data: RemoveStockData) => {
        return apiRequest<ApiResponse<Item>>('/api/items/removeStock', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    outwardScan: async (data: OutwardScanData) => {
        return apiRequest<ApiResponse<Item>>('/api/items/outward-scan', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    returnStock: async (data: { product_id: number; quantity: number; shelf_id?: number; rack_id?: number }) => {
        return apiRequest<ApiResponse<{ affected: number }>>('/api/items/return-stock', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    transferStock: async (data: {
        product_id: number;
        quantity: number;
        source: { shelf_id?: number; rack_id?: number };
        destination: { shelf_id?: number; rack_id?: number };
        remark?: string;
    }) => {
        return apiRequest<ApiResponse<{ affected: number }>>('/api/items/transfer-stock', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
};
