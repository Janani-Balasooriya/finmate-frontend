import { User } from './auth';

type AuthStateListener = (user: User | null) => void;

class AuthStateManager {
  private listeners: Set<AuthStateListener> = new Set();
  private currentUser: User | null = null;

  subscribe(listener: AuthStateListener) {
    this.listeners.add(listener);
    // Immediately call with current state
    listener(this.currentUser);
    
    return () => {
      this.listeners.delete(listener);
    };
  }

  setUser(user: User) {
    this.currentUser = user;
    this.notifyListeners();
  }

  clearUser() {
    this.currentUser = null;
    this.notifyListeners();
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener(this.currentUser);
      } catch (error) {
        console.error('Error in auth state listener:', error);
      }
    });
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export const authStateManager = new AuthStateManager();
