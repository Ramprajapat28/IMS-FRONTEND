import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';
import type { Product } from '@/features/Product/types';

export const inventoryApi = {
    getCategoryProducts: async (categoryName: string, page = 1, limit = 10) => {
        return apiRequest<ApiResponse<Product[]> & { pagination: PaginationInfo }>(
            `/api/products/category/${categoryName}/with-stock?page=${page}&limit=${limit}`
        );
    },
};
