import { create } from 'zustand';
import { User } from './types/user.types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (user: User) => void;
  purgeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  setAuth: (user: User) => {
    window.localStorage.setItem('jwtToken', user.token);
    set({ user, isAuthenticated: true });
  },

  purgeAuth: () => {
    window.localStorage.removeItem('jwtToken');
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
