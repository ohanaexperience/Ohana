import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Inquiry, Environment } from 'react-native-persona';

export default function VerifyIdentityScreen() {
  const startPersonaVerification = () => {
    Inquiry.fromTemplate('vtmpl_Fpq2jZmBBfSKXcFjVHNUErugfvYz') // Replace with your actual template ID
      .environment(Environment.SANDBOX) // Use Environment.PRODUCTION in production
      .referenceId('user_12345') // Optional: link inquiry to your user
      .onComplete((inquiryId, status, fields) => {
        Alert.alert('Success', `Verification completed with status: ${status}`);
      })
      .onCanceled((inquiryId, sessionToken) => {
        Alert.alert('Cancelled', 'Verification was cancelled.');
      })
      .onError(error => {
        console.error('Persona Error:', error);
        Alert.alert('Error', 'Verification failed.');
      })
      .build()
      .start();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Identity</Text>
      <Text style={styles.subtitle}>Take a photo of your government ID and scan your face</Text>

      <TouchableOpacity style={styles.button} onPress={startPersonaVerification}>
        <Text style={styles.buttonText}>Start Verification</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 24 },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});