// Auth utilities for managing JWT tokens and user state

import { authStateManager } from './authState';

const TOKEN_KEY = 'finmate_auth_token';
const USER_KEY = 'finmate_user';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

// Custom events for auth state changes
const AUTH_EVENTS = {
  USER_CHANGED: 'finmate:user-changed',
  USER_CLEARED: 'finmate:user-cleared',
} as const;

export const auth = {
  // Initialize auth state manager with existing user data
  init: () => {
    if (typeof window !== 'undefined') {
      const existingUser = auth.getUser();
      if (existingUser) {
        authStateManager.setUser(existingUser);
      }
    }
  },

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
    console.log('Auth: Setting user', user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    // Update global state manager
    authStateManager.setUser(user);
    // Emit event that user has changed
    const event = new CustomEvent(AUTH_EVENTS.USER_CHANGED, { detail: user });
    console.log('Auth: Dispatching USER_CHANGED event', event);
    window.dispatchEvent(event);
  },
  
  removeUser: (): void => {
    if (typeof window === 'undefined') return;
    console.log('Auth: Removing user');
    localStorage.removeItem(USER_KEY);
    // Update global state manager
    authStateManager.clearUser();
    // Emit event that user has been cleared
    const event = new CustomEvent(AUTH_EVENTS.USER_CLEARED);
    console.log('Auth: Dispatching USER_CLEARED event', event);
    window.dispatchEvent(event);
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
  },

  // Event constants for external use
  events: AUTH_EVENTS,
};
