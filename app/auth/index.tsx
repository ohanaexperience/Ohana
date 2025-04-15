// app/auth/index.tsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthLanding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Ohana</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/auth/phone')}>
        <Text style={styles.buttonText}>Create Accounts</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonOutline} onPress={() => router.push('/auth/phone')}>
        <Text style={styles.buttonOutlineText}>Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 16,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  buttonOutline: {
    borderColor: '#000',
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  buttonOutlineText: { color: '#000', fontSize: 16 },
});