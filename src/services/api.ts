// Comprehensive API service for all backend endpoints
// All API functions handle authentication via token in localStorage

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// ============================================
// TOKEN MANAGEMENT
// ============================================
// Note: Token management has been moved to @/features/Auth/api
// This getToken is kept here for backward compatibility with other APIs
const getToken = (): string | null => {
    return localStorage.getItem('authToken');
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

    // If body is FormData, let browser set Content-Type
    if (fetchOptions.body instanceof FormData) {
        delete (headers as Record<string, string>)['Content-Type'];
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Request failed' }));

        // Extract specific validation message if available
        let errorMessage = error.message;
        if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
            const firstErrorGroup = error.errors[0];
            if (firstErrorGroup.body_error && Array.isArray(firstErrorGroup.body_error) && firstErrorGroup.body_error.length > 0) {
                errorMessage = firstErrorGroup.body_error[0].message;
            }
        }

        throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
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

// Default export for backward compatibility
export default apiRequest;

