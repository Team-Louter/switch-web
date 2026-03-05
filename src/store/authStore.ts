import { create } from 'zustand';
import type { LoginResponse } from '@/types/auth';
import type { User } from '@/types/user';
import { getUser } from '@/api/User';

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
  accessToken: string | null;

  setAuth: (data: LoginResponse) => void;
  setToken: (token: string) => void;
  setPendingToken: (token: string) => void;
  fetchUser: () => Promise<void>;
  clearAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: !!localStorage.getItem('accessToken'),
  user: null,
  accessToken: localStorage.getItem('accessToken'),

  setAuth: (data: LoginResponse) => {
    const { token } = data;
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true, accessToken: token });
    // user 정보는 fetchUser로 따로 취득
  },

  setToken: (token: string) => {
    localStorage.setItem('accessToken', token);
    set({ isLoggedIn: true, accessToken: token });
  },

  setPendingToken: (token: string) => {
    localStorage.setItem('pendingToken', token);
    set({ isLoggedIn: false, accessToken: token });
  },

  fetchUser: async () => {
    try {
      const user = await getUser();
      set({ user });
    } catch {
      set({ isLoggedIn: false, user: null, accessToken: null });
      localStorage.removeItem('accessToken');
    }
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('pendingToken');
    set({ isLoggedIn: false, user: null, accessToken: null });
  },
}));