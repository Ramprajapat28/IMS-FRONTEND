import apiRequest, { type PaginationInfo } from '@/services/api';

// ============================================
// VENDORS API
// ============================================
export interface Vendor {
    vendor_id: number;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateVendorData {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export const vendorsApi = {
    getAll: async (page = 1, limit = 10) => {
        return apiRequest<{ success: boolean; vendors: Vendor[]; pagination: PaginationInfo }>(
            `/api/vendors/get_all_vendors?page=${page}&limit=${limit}`
        );
    },

    getById: async (id: number) => {
        return apiRequest<{ success: boolean; vendor: Vendor }>(`/api/vendors/get_vendor/${id}`);
    },

    create: async (data: CreateVendorData) => {
        return apiRequest<{ success: boolean; vendor: Vendor; message: string }>(
            '/api/vendors/create_vendor',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    update: async (id: number, data: Partial<CreateVendorData>) => {
        return apiRequest<{ success: boolean; updated_vendor: Vendor; message: string }>(
            `/api/vendors/update_vendor/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    },

    delete: async (id: number) => {
        return apiRequest<{ success: boolean; deleted_vendor: Vendor; message: string }>(
            `/api/vendors/delete_vendor/${id}`,
            {
                method: 'DELETE',
            }
        );
    },
};
