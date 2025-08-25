import { httpClient } from './http';
import { auth, User } from './auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<ApiResponse<LoginResponse>>('/auth/login', credentials, { skipAuth: true });
      
      if (response.success && response.data) {
        // Store token and user data
        auth.setToken(response.data.accessToken);
        auth.setUser(response.data.user);
        return response.data;
      } else {
        throw new Error(response.message || response.error || 'Login failed');
      }
    } catch (error) {
      // Clear any existing auth data on error
      auth.clear();
      throw error;
    }
  },
  
  // Get current user info
  async me(): Promise<User> {
    try {
      const response = await httpClient.get<ApiResponse<User>>('/auth/me');
      
      if (response.success && response.data) {
        // Update stored user data
        auth.setUser(response.data);
        return response.data;
      } else {
        throw new Error(response.message || response.error || 'Failed to get user info');
      }
    } catch (error) {
      // If getting user info fails, clear auth data
      auth.clear();
      throw error;
    }
  },
  
  // Logout user
  async logout(): Promise<void> {
    try {
      // Call logout endpoint if available
      await httpClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails, clear local auth data
      console.warn('Logout API call failed, clearing local data:', error);
    } finally {
      auth.clear();
    }
  },
  
  // Register new user, then log them in
  async register(userData: {
    email: string;
    password: string;
    name: string;
  }): Promise<LoginResponse> {
    try {
      const registerResponse = await httpClient.post<ApiResponse<User>>('/auth/register', userData, { skipAuth: true });
      
      if (!registerResponse.success) {
        throw new Error(registerResponse.message || registerResponse.error || 'Registration failed');
      }
      
      // Immediately login to obtain token
      const loginData = await authApi.login({ email: userData.email, password: userData.password });
      return loginData;
    } catch (error) {
      // Clear any existing auth data on error
      auth.clear();
      throw error;
    }
  }
};
