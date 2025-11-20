import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api.auth';
import { User, auth } from '@/lib/auth';
import { authStateManager } from '@/lib/authState';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  clearUser: () => void;
  setUserData: (user: User) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await authApi.me();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const clearUser = () => {
    setUser(null);
    setError(null);
    setLoading(false);
  };

  const setUserData = (user: User) => {
    setUser(user);
    setError(null);
    setLoading(false);
  };

  useEffect(() => {
    // Initialize auth system
    auth.init();
    
    // Check if user is already stored locally
    const storedUser = auth.getUser();
    if (storedUser) {
      setUser(storedUser);
      setLoading(false);
      // Refresh user data from server
      refreshUser();
    } else {
      setLoading(false);
    }

    // Subscribe to auth state manager
    const unsubscribe = authStateManager.subscribe((user) => {
      setUser(user);
      setLoading(false);
      setError(null);
    });

    // Listen for auth state changes
    const handleUserChanged = (event: CustomEvent<User>) => {
      setUser(event.detail);
      setLoading(false);
      setError(null);
    };

    const handleUserCleared = () => {
      setUser(null);
      setLoading(false);
      setError(null);
    };

    // Also listen for storage changes (for cases where localStorage is modified directly)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'finmate_user') {
        if (event.newValue) {
          try {
            const newUser = JSON.parse(event.newValue);
            setUser(newUser);
            setLoading(false);
            setError(null);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    };

    window.addEventListener(auth.events.USER_CHANGED, handleUserChanged as EventListener);
    window.addEventListener(auth.events.USER_CLEARED, handleUserCleared);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener(auth.events.USER_CHANGED, handleUserChanged as EventListener);
      window.removeEventListener(auth.events.USER_CLEARED, handleUserCleared);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: UserContextType = {
    user,
    loading,
    error,
    refreshUser,
    clearUser,
    setUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
