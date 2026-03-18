import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  UserID: string;
  Name: string;
  Email: string;
  Role: 'Super Admin' | 'Admin' | 'Agent' | 'Client';
  PermissionsJSON: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  selection: { plan: string | null; service: string | null };
  setAuth: (user: User | null, token: string | null) => void;
  setSelection: (plan: string | null, service: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      selection: { plan: null, service: null },
      setAuth: (user, token) => set({ user, token }),
      setSelection: (plan, service) => set({ selection: { plan, service } }),
      logout: () => set({ user: null, token: null, selection: { plan: null, service: null } }),
    }),
    {
      name: 'dsc-auth-storage',
    }
  )
);
