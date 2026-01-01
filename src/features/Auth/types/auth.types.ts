// Auth API Types

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

export interface User {
    user_id: number;
    email: string;
    name: string;
    role: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}
