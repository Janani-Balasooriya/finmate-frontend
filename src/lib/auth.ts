// Auth utilities for managing JWT tokens and user state

const TOKEN_KEY = 'finmate_auth_token';
const USER_KEY = 'finmate_user';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const auth = {
  // Token management
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },
  
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
  },
  
  // User management
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem(USER_KEY);
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },
  
  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  
  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },
  
  // Auth state
  isAuthenticated: (): boolean => {
    const token = auth.getToken();
    if (!token) return false;
    
    // Basic token validation (you might want to add JWT expiration check)
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Date.now() / 1000;
      return payload.exp > now;
    } catch {
      return false;
    }
  },
  
  // Logout
  logout: (): void => {
    auth.removeToken();
    auth.removeUser();
    // Note: Navigation is handled by the component calling this method
  },
  
  // Clear all auth data
  clear: (): void => {
    auth.removeToken();
    auth.removeUser();
  }
};
