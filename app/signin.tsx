// app/signin.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { AccessToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import { useAuthStore } from './store/auth';
import Constants from 'expo-constants';

import {
  GOOGLE_IOS_CLIENT_ID,
  GOOGLE_WEB_CLIENT_ID,
  BACKEND_URL,
} from './env';


console.log('GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID);
console.log('GOOGLE_IOS_CLIENT_ID:', GOOGLE_IOS_CLIENT_ID);
console.log('process.env 📣',process.env);

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
  iosClientId: GOOGLE_IOS_CLIENT_ID,
  offlineAccess: true,
});


export default function SignInScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const setIsHost = useAuthStore((s) => s.setIsHost);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success') {
        const { idToken: googleIdToken, user } = response.data;
        console.log('googleIdToken',googleIdToken)
        const backendResponse = await fetch(
          BACKEND_URL+'/v1/auth/google/sign-in',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken: googleIdToken }),
          }
        );
        if (!backendResponse.ok)
          throw new Error('Backend verification failed');

        const {
          AccessToken,
          ExpiresIn,
          IdToken,
          RefreshToken,
          TokenType,
        } = await backendResponse.json();

        setUser({
          provider: 'google',
          id: user.id,
          email: user.email,
          name: user.name ?? '',
          photo: user.photo,
          tokens: {
            idToken: IdToken,
            accessToken: AccessToken,
            refreshToken: RefreshToken,
            expiresIn: ExpiresIn,
            tokenType: TokenType,
          },
        });

        const hostRes = await fetch(
        BACKEND_URL+'/v1/host/profile',
        {
          headers: { Authorization: `Bearer ${IdToken}` },
        }
      );
      const hostJson = await hostRes.json();
      console.log('Host profile 🙋‍♂️:', hostJson);
      setIsHost(hostJson.isActive === true);
        router.replace('/(tabs)');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    }
  };

  // const signInWithFacebook = async () => {
  //   try {
  //     const result = await LoginManager.logInWithPermissions([
  //       'public_profile',
  //     ]);
  //     if (result.isCancelled) return;

  //     const tokenData = await AccessToken.getCurrentAccessToken();
  //     if (!tokenData) throw new Error('Missing token');
  //     const profile = await Profile.getCurrentProfile();
  //     if (!profile) throw new Error('Missing profile');

  //     useAuthStore.getState().setUser({
  //       provider: 'facebook',
  //       id: profile.userID ?? '',
  //       email: '',
  //       name: profile.name ?? '',
  //       photo: profile.imageURL ?? '',
  //       tokens: {
  //         idToken: tokenData.accessToken,
  //         accessToken: tokenData.accessToken,
  //         refreshToken: '',
  //         expiresIn: 0,
  //         tokenType: '',
  //       },
  //     });

  //     router.replace('/(tabs)');
  //   } catch (err) {
  //     console.error('Facebook Sign-In Error:', err);
  //   }
  // };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dismissButton}
        onPress={() => router.replace('/(tabs)')}
      >
        <AntDesign name="close" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Welcome to Ohana</Text>

      <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
        <AntDesign name="google" size={20} color="#000" style={styles.icon} />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.button} onPress={signInWithFacebook}>
        <AntDesign
          name="facebook-square"
          size={20}
          color="#000"
          style={styles.icon}
        />
        <Text style={styles.buttonText}>Continue with Facebook</Text>
      </TouchableOpacity> */}
    </View>
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
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
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
    width: '100%',
    maxWidth: 300,
  },
  icon: { marginRight: 12 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#000' },
  dismissButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 1,
  },
});