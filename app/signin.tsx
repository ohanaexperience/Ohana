// app/signin.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import { useAuthStore } from './store/auth';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

GoogleSignin.configure({
  webClientId: '1066232646154-6l2ujgt1vj65onuku5for4ec8pi5no6u.apps.googleusercontent.com',
  iosClientId: '1066232646154-qhk20dva6guf5r30dqoakbafnka5icv1.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function SignInScreen() {
  const router = useRouter();

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success') {
        const { idToken, user } = response.data;
        const backendResponse = await fetch(
          'https://ikfwakanfh.execute-api.us-east-1.amazonaws.com/dev/v1/auth/google/sign-in',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
          }
        );

        if (!backendResponse.ok) {
          throw new Error('Failed to verify token with backend');
        }

        const data = await backendResponse.json();

        useAuthStore.getState().setUser({
          provider: 'google',
          id: user.id,
          email: user.email,
          name: user.name ?? '',
          photo: user.photo,
          tokens: {
            idToken: data.IdToken,
            accessToken: data.AccessToken,
            refreshToken: data.RefreshToken,
          },
        });

        router.replace('/(tabs)');
      } else {
        console.warn('Sign-in was cancelled or failed.');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    }
  };

  const signInWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile']);
      if (result.isCancelled) {
        console.warn('Facebook login cancelled');
        return;
      }

      const tokenData = await AccessToken.getCurrentAccessToken();
      if (!tokenData) throw new Error('Failed to get access token');

      const profile = await Profile.getCurrentProfile();
      if (!profile) throw new Error('Failed to get profile');

      router.replace('/(tabs)');
    } catch (err) {
      console.error('Facebook Login Error:', err);
    }
  };

  return (
    <>
      <Stack.Screen options={{ presentation: 'modal', title: 'Sign In' }} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to Ohana</Text>

        <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
          <AntDesign name="google" size={20} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={signInWithFacebook}>
          <FontAwesome name="facebook" size={20} color="black" style={styles.icon} />
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginTop: 16,
    minWidth: 260,
    justifyContent: 'center',
  },
  icon: {
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
});
