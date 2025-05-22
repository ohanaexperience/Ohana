import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripeIdentity } from '@stripe/stripe-identity-react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/auth';

export default function HostStep2() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const idToken = user?.tokens.idToken;

  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  if (!userId || !idToken) {
    throw new Error('Must be signed in to verify identity');
  }

  const fetchOptions = async () => {
    const res = await fetch(
      'https://ikfwakanfh.execute-api.us-east-1.amazonaws.com/dev/v1/auth/id/verify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const json = await res.json();

    if (res.status === 200 && json.error === 'VERIFICATION_ALREADY_APPROVED') {
      setAlreadyVerified(true);
      return Promise.reject(new Error('VERIFICATION_ALREADY_APPROVED'));
    }

    if (!res.ok) {
      throw new Error(json.message || 'Failed to fetch clientSecret');
    }

    return {
      sessionId: json.clientSecret.split('_secret')[0],
      ephemeralKeySecret: json.ephemeralKey,
      brandLogo: Image.resolveAssetSource(
        require('../../assets/images/react-logo.png')
      ),
    };
  };

  const { status, present, loading } = useStripeIdentity(fetchOptions);

  const handleVerify = useCallback(() => {
    present()
      // .then((result) => {
      //   if (result?.error) {
      //     Alert.alert('Verification failed', result.error.message);
      //   } else if (result?.status === 'completed') {
      //     router.push('/upgrade-to-host/step3');
      //   }
      // })
      // .catch((err) => {
      //   if (err.message !== 'VERIFICATION_ALREADY_APPROVED') {
      //     console.error('💥', err);
      //     Alert.alert('Error', err.message);
      //   }
      // });
  }, [present]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.stepText}>Step 2 of 4</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '50%' }]} />
      </View>

      <Text style={styles.title}>Verify your identity</Text>

      {alreadyVerified ? (
        <Text style={styles.subtitle}>
          You’ve already verified your identity. You may proceed to the next step.
        </Text>
      ) : (
        <Text style={styles.subtitle}>
          We’ll ask you to scan a government-issued ID and take a quick selfie.
        </Text>
      )}

      {!alreadyVerified && (
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Start Verification</Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.statusText}>Status: {alreadyVerified ? 'Verified' : status}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  stepText: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  progressBar: {
    height: 4,
    backgroundColor: '#eee',
    borderRadius: 2,
    marginBottom: 24,
  },
  progressFill: { height: 4, backgroundColor: '#000', borderRadius: 2 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 32 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  statusText: { fontSize: 14, color: '#333' },
});