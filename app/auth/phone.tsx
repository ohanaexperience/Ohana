// app/auth/phone.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { signUp } from 'aws-amplify/auth';

export default function PhoneInputScreen() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const sendCode = async () => {
    try {
      await signUp({
        username: phone,
        password: 'TempPass123!',
        options: {
          userAttributes: { phone_number: phone },
        },
      });
      router.push({ pathname: '/auth/verify', params: { phone } });
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your phone number</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. +15551234567"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Send Code" onPress={sendCode} disabled={!phone} />
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