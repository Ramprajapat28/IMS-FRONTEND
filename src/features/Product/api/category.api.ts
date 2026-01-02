import apiRequest, { type ApiResponse } from '@/services/api';

export interface Category {
    category_id: number;
    category_name: string;
    parent_category_id?: number | null;
}

export const categoriesApi = {
    getAll: async () => {
        return apiRequest<ApiResponse<Category[]>>('/api/category/list');
    },
};
