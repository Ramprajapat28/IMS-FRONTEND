// Comprehensive API service for all backend endpoints
// All API functions handle authentication via token in localStorage

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// ============================================
// TOKEN MANAGEMENT
// ============================================
export const getToken = (): string | null => {
    return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
    localStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
    localStorage.removeItem('authToken');
};

export const isAuthenticated = (): boolean => {
    return !!getToken();
};

// ============================================
// API REQUEST HELPER
// ============================================
interface ApiRequestOptions extends RequestInit {
    skipAuth?: boolean;
}

const apiRequest = async <T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<T> => {
    const { skipAuth, ...fetchOptions } = options;
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
    };

    if (token && !skipAuth) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    // Handle image/binary responses
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('image/')) {
        return response.blob() as unknown as T;
    }

    return response.json();
};

// ============================================
// COMMON TYPES
// ============================================
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    offset?: number;
    previous?: number | null;
    next?: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: PaginationInfo;
}

// ============================================
// AUTH API
// ============================================
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    jwt_token: string;
    user: {
        user_id: number;
        email: string;
        name: string;
        role: string;
    };
}

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await apiRequest<LoginResponse>('/open/api/auth/login_user', {
            method: 'POST',
            body: JSON.stringify(credentials),
            skipAuth: true,
        });

        // Backend returns jwt_token, not token
        if (response.success && response.jwt_token) {
            setToken(response.jwt_token);
        }

        return response;
    },

    logout: (): void => {
        removeToken();
    },

    getProfile: async () => {
        return apiRequest<ApiResponse<{ user: unknown }>>('/api/auth/profile');
    },
};

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

    create: async (data: CreateProductData) => {
        return apiRequest<ApiResponse<Product>>('/api/products/create', {
            method: 'POST',
            body: JSON.stringify(data),
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
    shelf_id: number;
    quantity: number;
}

export interface RemoveStockData {
    product_id: number;
    shelf_id: number;
    quantity: number;
    status?: string;
    order_id?: number; // Required for returns to update existing order
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
};

// ============================================
// ORDERS API
// ============================================
export interface Order {
    order_id: number;
    product_id: number;
    shelf_id: number;
    quantity: number;
    status: string;
    product_name?: string;
    product_sku?: string;
    warehouse_name?: string;
    room_name?: string;
    shelf_name?: string;
    created_at?: string;
    updated_at?: string;
}

export interface OrderFilters {
    product_id?: number;
    shelf_id?: number;
    status?: string;
}

export const ordersApi = {
    getAll: async (page = 1, limit = 10, filters?: OrderFilters) => {
        let url = `/api/orders/all?page=${page}&limit=${limit}`;
        if (filters?.product_id) url += `&product_id=${filters.product_id}`;
        if (filters?.shelf_id) url += `&shelf_id=${filters.shelf_id}`;
        if (filters?.status) url += `&status=${filters.status}`;

        return apiRequest<ApiResponse<Order[]> & { pagination: PaginationInfo }>(url);
    },

    getById: async (orderId: number) => {
        return apiRequest<ApiResponse<Order>>(`/api/orders/orderId/${orderId}`);
    },

    updateStatus: async (orderId: number, status: string) => {
        return apiRequest<ApiResponse<Order>>(`/api/orders/status/${orderId}`, {
            method: 'PUT',
            body: JSON.stringify({ status }),
        });
    },
};

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

// ============================================
// WAREHOUSES API
// ============================================
export interface WarehouseDetails {
    warehouse_id?: number;
    room_id?: number;
    shelf_id?: number;
}

export const warehousesApi = {
    getDetailsByIds: async (ids: WarehouseDetails) => {
        return apiRequest<ApiResponse<unknown>>('/api/warehouses/manage/by-ids', {
            method: 'POST',
            body: JSON.stringify(ids),
        });
    },
};

// Default export for backward compatibility
export default apiRequest;
