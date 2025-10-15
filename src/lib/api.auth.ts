import { httpClient } from './http';
import { auth, User } from './auth';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function getStringFromKeys(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function getUserFromKeys(obj: Record<string, unknown>, keys: string[]): User | undefined {
  for (const key of keys) {
    const value = obj[key];
    if (isRecord(value)) {
      // Perform minimal structural check for User
      const maybeEmail = value['email'];
      const maybeId = value['id'];
      if (typeof maybeEmail === 'string' && (typeof maybeId === 'number' || typeof maybeId === 'string')) {
        // Coerce id to number if it's a string
        const id = typeof maybeId === 'number' ? maybeId : Number(maybeId);
        if (!Number.isNaN(id)) {
          return {
            id,
            email: String(value['email'] ?? ''),
            firstName: String(value['firstName'] ?? ''),
            lastName: String(value['lastName'] ?? ''),
            role: String(value['role'] ?? '').toLowerCase(),
            status: String(value['status'] ?? ''),
            families: isRecord(value['families']) && typeof value['families']['id'] === 'number' ? { id: value['families']['id'] as number } : undefined,
            createdAt: typeof value['createdAt'] === 'string' ? value['createdAt'] as string : undefined,
            updatedAt: typeof value['updatedAt'] === 'string' ? value['updatedAt'] as string : undefined,
          };
        }
      }
    }
  }
  return undefined;
}

function extractAuthData(data: unknown): { accessToken: string; user: User } {
  if (!isRecord(data)) {
    throw new Error('Invalid response shape: expected object data');
  }

  // Try direct fields first
  const accessToken = getStringFromKeys(data, ['accessToken', 'token', 'access_token']);
  let user = getUserFromKeys(data, ['user', 'userDto', 'user_data']);

  // Try nested data.user if not found
  if (!user && isRecord(data.data)) {
    user = getUserFromKeys(data.data as Record<string, unknown>, ['user']);
  }

  if (!accessToken) {
    throw new Error('Login succeeded but no access token found in response');
  }
  if (!user) {
    throw new Error('Login succeeded but no user object found in response');
  }

  return { accessToken, user };
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<ApiResponse<LoginResponse>>(
        '/auth/login',
        credentials,
        { skipAuth: true }
      );

      // httpClient already returns parsed JSON body
      const res = response;

      if (res.success && res.data) {
        const { accessToken, user } = extractAuthData(res.data);
        auth.setToken(accessToken);
        auth.setUser(user);

        // tiny delay to ensure local storage events propagate
        await new Promise(resolve => setTimeout(resolve, 100));

        return res.data;
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (error) {
      auth.clear();
      throw error;
    }
  },

  // Get current user info
  async me(): Promise<User> {
    try {
      const response = await httpClient.get<ApiResponse<User>>('/auth/me');
      const res = response;

      if (res.success && res.data) {
        auth.setUser(res.data);
        return res.data;
      } else {
        throw new Error(res.message || res.error || 'Failed to get user info');
      }
    } catch (error) {
      auth.clear();
      throw error;
    }
  },

  // Logout user
  async logout(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      console.warn('Logout API call failed, clearing local data:', error);
    } finally {
      auth.clear();
    }
  },

  // Register new user, then log them in
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    inviteToken?: string;
  }): Promise<LoginResponse> {
    try {
      const response = await httpClient.post<ApiResponse<LoginResponse>>(
        '/auth/register',
        userData,
        { skipAuth: true }
      );

      const res = response;

      if (res.success && res.data) {
        const { accessToken, user } = extractAuthData(res.data);
        auth.setToken(accessToken);
        auth.setUser(user);

        await new Promise(resolve => setTimeout(resolve, 100));

        return res.data;
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (error) {
      auth.clear();
      throw error;
    }
  }
};
