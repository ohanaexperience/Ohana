import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useAuthStore } from './store/auth';

GoogleSignin.configure({
  webClientId: '1066232646154-6l2ujgt1vj65onuku5for4ec8pi5no6u.apps.googleusercontent.com',
  iosClientId: '1066232646154-qhk20dva6guf5r30dqoakbafnka5icv1.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function IndexScreen() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();

      if (response.type === 'success') {
        const { idToken, user } = response.data;

        setUser({
          idToken,
          id: user.id,
          email: user.email,
          name: user.name,
          photo: user.photo,
        });

        router.replace('/(tabs)');
      } else {
        console.warn('Sign-in was cancelled or failed.');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ohana</Text>
      <TouchableOpacity style={styles.button} onPress={signInWithGoogle}>
        <Image
          source={{
            uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png',
          }}
          style={styles.googleIcon}
        />
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 },
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
  },
  googleIcon: { width: 20, height: 20, marginRight: 12 },
  buttonText: { fontSize: 16, fontWeight: '600', color: '#000' },
});