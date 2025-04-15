// app/upgrade-to-host.tsx
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from 'expo-router';

export default function UpgradeToHostModal() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
        <Text style={styles.closeText}>Close</Text>
      </Pressable>
      <Text style={styles.title}>Upgrade to Business</Text>
      <Text style={styles.description}>
        Register as a Business location and offer discounts to Hosts.
      </Text>
      {/* Add form or onboarding steps here */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  closeButton: { marginBottom: 20 },
  closeText: { fontSize: 16, color: '#007aff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  description: { fontSize: 16, textAlign: 'center', color: '#555' },
});
