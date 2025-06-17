// app/store/auth.tsx
import { create } from 'zustand';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager } from 'react-native-fbsdk-next';
import { router } from 'expo-router';

type AuthTokens = {
  idToken: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
};

type AuthUser = {
  provider: 'google' | 'facebook';
  id: string;
  email: string;
  name: string;
  photo: string | null;
  tokens: AuthTokens;
};

type AuthState = {
  user: AuthUser | null;
  isHost: boolean;
  setUser: (user: AuthUser) => void;
  setIsHost: (isHost: boolean) => void;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isHost: false,

  setUser: (user) => set({ user }),

  setIsHost: (isHost) => set({ isHost }),

  signOut: async () => {
    const { user } = get();
    try {
      if (user?.provider === 'google') {
        await GoogleSignin.signOut();
      } else if (user?.provider === 'facebook') {
        await LoginManager.logOut();
      }
      set({ user: null, isHost: false });
      router.replace('/signin');
    } catch (err) {
      console.error('Sign out failed:', err);
    }
  },
}));

// Selector hook to use login status safely
export const useIsLoggedIn = () => useAuthStore((state) => !!state.user);