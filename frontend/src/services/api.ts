const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface ApiResponse<T> {
    success: boolean;
    message: string;
    user?: T;
}

export interface User {
    id: string;
    username: string;
    createdAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
}

class ApiService {
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        const url = `${API_BASE_URL}${endpoint}`;
        const config: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
            ...options,
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! status: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async signup(userData: SignupRequest): Promise<ApiResponse<User>> {
        return this.makeRequest<User>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(credentials: LoginRequest): Promise<ApiResponse<User>> {
        return this.makeRequest<User>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }

    async healthCheck(): Promise<ApiResponse<{ status: string; timestamp: string }>> {
        return this.makeRequest<{ status: string; timestamp: string }>('/health');
    }
}

export const apiService = new ApiService();
