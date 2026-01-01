import apiRequest, { type ApiResponse, type PaginationInfo } from '@/services/api';

// ============================================
// WAREHOUSES API
// ============================================
export interface WarehouseDetails {
    warehouse_id?: number;
    room_id?: number;
    shelf_id?: number;
}

export interface Warehouse {
    warehouse_id: number;
    name: string;
    location?: string;
    created_at?: string;
    updated_at?: string;
}

export const warehousesApi = {
    getAll: async (page = 1, limit = 100) => {
        return apiRequest<ApiResponse<Warehouse[]> & { pagination: PaginationInfo }>(
            `/api/warehouses/get_all_warehouses?page=${page}&limit=${limit}`
        );
    },
    getDetailsByIds: async (ids: WarehouseDetails) => {
        return apiRequest<ApiResponse<unknown>>('/api/warehouses/manage/by-ids', {
            method: 'POST',
            body: JSON.stringify(ids),
        });
    },
};

// ============================================
// ROOMS API
// ============================================
export interface Room {
    room_id: number;
    name: string;
    warehouse_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateRoomData {
    name: string;
    warehouse_id?: number;
}

export const roomsApi = {
    getAll: async (page = 1, limit = 10) => {
        return apiRequest<{ success: boolean; rooms: Room[]; pagination: PaginationInfo; message: string }>(
            `/api/rooms/get_all_rooms?page=${page}&limit=${limit}`
        );
    },

    getById: async (id: number) => {
        return apiRequest<{ success: boolean; room: Room }>(`/api/rooms/get_room/${id}`);
    },

    create: async (data: CreateRoomData) => {
        return apiRequest<{ room: Room }>('/api/rooms/create_room', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: number, data: Partial<CreateRoomData>) => {
        return apiRequest<{ success: boolean; updated_room: Room }>(
            `/api/rooms/update_room/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    },

    delete: async (id: number) => {
        return apiRequest<{ success: boolean; deleted_room: Room; message: string }>(
            `/api/rooms/delete_room/${id}`,
            {
                method: 'DELETE',
            }
        );
    },
};

// ============================================
// SHELVES API
// ============================================
export interface Shelf {
    shelf_id: number;
    name: string;
    room_id?: number;
    created_at?: string;
    updated_at?: string;
}

export interface CreateShelfData {
    name: string;
    room_id?: number;
}

export const shelvesApi = {
    getAll: async (page = 1, limit = 10) => {
        return apiRequest<ApiResponse<Shelf[]> & { pagination: PaginationInfo }>(
            `/api/shelfs/get_all_shelfs?page=${page}&limit=${limit}`
        );
    },

    getById: async (id: number) => {
        return apiRequest<{ success: boolean; shelf: Shelf }>(`/api/shelfs/get_shelf/${id}`);
    },

    create: async (data: CreateShelfData) => {
        return apiRequest<{ success: boolean; shelf: Shelf; message: string }>(
            '/api/shelfs/create_shelf',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    update: async (id: number, data: Partial<CreateShelfData>) => {
        return apiRequest<{ success: boolean; updated_shelf: Shelf; message: string }>(
            `/api/shelfs/update_shelf/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    },

    delete: async (id: number) => {
        return apiRequest<{ success: boolean; deleted_shelf: Shelf; message: string }>(
            `/api/shelfs/delete_shelf/${id}`,
            {
                method: 'POST',
            }
        );
    },
};
