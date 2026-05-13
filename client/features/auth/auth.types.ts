export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export interface User {
    id?: string;
    sub: string;
    name: string;
    email: string;
    role?: string;
    isActive?: boolean;
}

export interface TokenData {
    access_token: string;
    refresh_token: string;
}

// Format chung của API (envelope)
export interface ApiResponse<T> {
    status: string;
    statusCode: number;
    message: string;
    timestamp: string;
    path: string;
    data: T;
}

// Response cụ thể cho Login/Register
export type AuthResponse = ApiResponse<TokenData>;

// Response cụ thể cho Get Me
export type MeResponse = ApiResponse<User>;
