import { create } from 'zustand';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { router } from 'expo-router';

type AuthUser = {
  provider: 'google' | 'facebook';
  idToken: string;
  id: string;
  email: string;
  name: string;
  photo: string | null;
};

type AuthState = {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,

  setUser: (user) => set({ user }),

  signOut: async () => {
    const { user } = get();
    try {
      if (user?.provider === 'google') {
        await GoogleSignin.signOut();
      } else if (user?.provider === 'facebook') {
        await LoginManager.logOut();
      }

      set({ user: null });
      router.replace('/'); // return to login screen
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  },
}));