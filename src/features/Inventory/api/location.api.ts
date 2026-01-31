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
    getById: async (id: number) => {
        return apiRequest<ApiResponse<Warehouse>>(`/api/warehouses/${id}`);
    },
    create: async (data: { name: string; location?: string }) => {
        return apiRequest<ApiResponse<Warehouse>>('/api/warehouses/create', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },
    update: async (id: number, data: { name?: string; location?: string }) => {
        return apiRequest<ApiResponse<Warehouse>>(`/api/warehouses/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },
    delete: async (id: number) => {
        return apiRequest<ApiResponse<any>>(`/api/warehouses/delete/${id}`, {
            method: 'DELETE',
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
    room_name: string;
    warehouse_id: number;
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
    shelf_name: string;
    room_id: number;
    warehouse_id: number;
    capacity?: number;
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

// ============================================
// RACKS API
// ============================================
export interface Rack {
    rack_id: number;
    rack_name: string;
    name?: string;
    warehouse_id?: number;
    room_id?: number;
    capacity?: number;
    warehouse_name?: string;
    room_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateRackData {
    rack_name: string;
    warehouse_id: number;
    room_id: number;
    capacity?: number;
}

export const racksApi = {
    getAll: async (filters?: { warehouse_id?: number; room_id?: number; rack_name?: string }, page = 1, limit = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString(),
            ...(filters?.warehouse_id && { warehouse_id: filters.warehouse_id.toString() }),
            ...(filters?.room_id && { room_id: filters.room_id.toString() }),
            ...(filters?.rack_name && { rack_name: filters.rack_name }),
        });

        return apiRequest<{ success: boolean; data: Rack[]; total: number; page: number; limit: number }>(
            `/api/racks/list?${params.toString()}`
        );
    },

    getById: async (id: number) => {
        return apiRequest<{ success: boolean; data: Rack }>(`/api/racks/${id}`);
    },

    create: async (data: CreateRackData) => {
        return apiRequest<{ success: boolean; data: Rack; message: string }>(
            '/api/racks/create',
            {
                method: 'POST',
                body: JSON.stringify(data),
            }
        );
    },

    update: async (id: number, data: Partial<CreateRackData>) => {
        return apiRequest<{ success: boolean; data: Rack; message: string }>(
            `/api/racks/${id}`,
            {
                method: 'PUT',
                body: JSON.stringify(data),
            }
        );
    },

    delete: async (id: number) => {
        return apiRequest<{ success: boolean; data: { rack_id: number; deleted: boolean; message: string } }>(
            `/api/racks/${id}`,
            {
                method: 'DELETE',
            }
        );
    },
};

