import { create } from 'zustand';

export type GoogleUser = {
  idToken: string | null;
  id: string;
  email: string;
  name: string | null;
  photo: string | null;
};

type AuthState = {
  user: GoogleUser | null;
  setUser: (user: GoogleUser) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  signOut: async () => {
    try {
      set({ user: null });
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  },
}));
