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
import { useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function HostStep2() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const userId = user?.id;
  const idToken = user?.tokens.idToken;

  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  const navigation = useNavigation();

   useLayoutEffect(() => {
      navigation.setOptions({
        title: 'Become a Host',
        headerTitleAlign: 'center',
      });
    }, [navigation]);
  

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

    // Handle verification already approved (Stripe-specific)
    if (res.status === 200 && json.error === 'VERIFICATION_ALREADY_APPROVED') {
      setAlreadyVerified(true);
      return Promise.reject(new Error('VERIFICATION_ALREADY_APPROVED'));
    }

    // Handle host already verified (custom backend message)
    if (res.status === 200 && json.message === 'Host is already verified.') {
      setAlreadyVerified(true);
      return Promise.reject(new Error('HOST_ALREADY_VERIFIED'));
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
    present();
  }, [present]);

  const handleContinue = () => {
    router.push('/upgrade-to-host/step3');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.stepText}>Step 2 of 4</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '50%' }]} />
      </View>

      <Text style={styles.title}>Verify your identity</Text>

      {alreadyVerified ? (
        <>
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
          <Ionicons name="checkmark-circle" size={64} color="#0a0" />
          <Text style={styles.title}>Identity Verified</Text>
          <Text style={[styles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
            Your host application has been reviewed and approved. You're now ready to create your first experience and start welcoming guests.
          </Text>
        </View>

        <View style={styles.verifiedRow}>
          <View style={styles.statusTag}>
            <Ionicons name="shield-checkmark-outline" size={16} color="#444" />
            <Text style={styles.statusTagText}>Identity Verified</Text>
          </View>
          <View style={styles.statusTag}>
            <Ionicons name="person" size={16} color="#444" />
            <Text style={styles.statusTagText}>Host Approved</Text>
          </View>
        </View>

        <View style={styles.nextBox}>
          <Text style={styles.nextTitle}>What's Next?</Text>
          <Text style={styles.nextItem}>1. Create your first experience listing</Text>
          <Text style={styles.nextItem}>2. Set up your availability calendar</Text>
          <Text style={styles.nextItem}>3. Start accepting bookings</Text>
        </View>
          <TouchableOpacity
            style={styles.button}
            onPress={handleContinue}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.subtitle}>
            We’ll ask you to scan a government-issued ID and take a quick selfie.
          </Text>
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
        </>
      )}


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
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    marginRight: 12,
  },
  statusTagText: {
    fontSize: 14,
    color: '#444',
  },
  verifiedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  nextBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  nextTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  nextItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});