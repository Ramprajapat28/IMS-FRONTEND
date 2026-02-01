import apiRequest, { type ApiResponse } from '@/services/api';

export interface Category {
    category_id: number;
    category_name: string;
    global_category_id?: number | null;
    logo_url?: string | null;
    sizes?: string[] | null;
}

export interface GlobalCategory {
    global_category_id: number;
    category_name: string;
    logo_url?: string | null;
}

export const categoriesApi = {
    getAll: async () => {
        return apiRequest<ApiResponse<Category[]>>('/api/category/list');
    },

    getListWithCounts: async () => {
        return apiRequest<ApiResponse<(Category & { total_products: number })[]>>('/api/category/list-with-counts', {
            method: 'POST'
        });
    },

    getAllGlobal: async () => {
        return apiRequest<ApiResponse<GlobalCategory[]>>('/api/category/list_global');
    },

    createGlobal: async (data: { category_name: string, logo_url?: string | null }) => {
        return apiRequest<ApiResponse<GlobalCategory>>('/api/category/createGlobal', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    createCategory: async (data: { category_name: string, global_category_id: number, logo_url?: string | null, sizes?: string[] | null }) => {
        return apiRequest<ApiResponse<Category>>('/api/category/create', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    updateGlobal: async (id: number, data: { category_name: string, logo_url?: string | null }) => {
        return apiRequest<ApiResponse<GlobalCategory>>(`/api/category/update_global/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteGlobal: async (id: number) => {
        return apiRequest<ApiResponse<any>>(`/api/category/delete_global/${id}`, {
            method: 'POST'
        });
    },

    updateCategory: async (id: number, data: { category_name: string, global_category_id: number, logo_url?: string | null, sizes?: string[] | null }) => {
        return apiRequest<ApiResponse<Category>>(`/api/category/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    deleteCategory: async (id: number) => {
        return apiRequest<ApiResponse<any>>(`/api/category/delete/${id}`, {
            method: 'POST'
        });
    }
};
