// Profile API Types

export interface UserProfile {
    user_id: number;
    name: string;
    gender: string;
    phone: string;
    profile_picture_url: string;
    email: string;
    password_hash: string;
    role_id: number | null;
    created_by: number | null;
    last_modified_by: number | null;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    status_id: number | null;
    address: string;
    location: string;
    date_of_birth: string;
    postal_code: number;
}

export interface ProfileResponse {
    success: boolean;
    data: UserProfile;
    message: string;
}

export interface UpdateProfileData {
    email?: string;
    name?: string;
    phone?: string;
    gender?: string;
    address?: string;
    location?: string;
    date_of_birth?: string; // Format: YYYY-MM-DD
    postal_code?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
}
