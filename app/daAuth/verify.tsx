// app/auth/verify.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { confirmSignUp } from 'aws-amplify/auth';
import { useAuth } from '../store/auth';

export default function VerifyScreen() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { phone } = useLocalSearchParams();
  const setAuthenticated = useAuth((s) => s.setAuthenticated);

  const confirmCode = async () => {
    try {
      await confirmSignUp({ username: phone as string, confirmationCode: code });
      setAuthenticated(true);
      router.replace('/(tabs)');
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter verification code</Text>
      <TextInput
        style={styles.input}
        placeholder="123456"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Verify" onPress={confirmCode} disabled={!code} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  error: { color: 'red', marginBottom: 10 },
});
