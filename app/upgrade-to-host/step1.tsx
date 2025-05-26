import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';

export default function HostStep1() {
  const router = useRouter();
  const navigation = useNavigation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Become a Host',
      headerTitleAlign: 'center',
      headerBackTitle: 'Back',
    });
  }, [navigation]);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleContinue = () => {

     // if (!fullName.trim()) {
    //   Alert.alert('Invalid Full Name', 'Full name must be at least 1 character.');
    //   return;
    // }
    // if (!validateEmail(email)) {
    //   Alert.alert('Invalid Email', 'Please enter a valid email address.');
    //   return;
    // }
    router.push({
      pathname: './step2',
      params: { fullName, email, phone },
    });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.stepText}>Step 1 of 3</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '33%' }]} />
        </View>

        <Text style={styles.title}>Let's start with the basics</Text>
        <Text style={styles.subtitle}>
          Tell us a bit about yourself. This information will be visible to potential guests.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#D3D3D3"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          placeholderTextColor="#D3D3D3"
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue to Step 2</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  progressFill: {
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    
  },
  button: {
    marginTop: 'auto',
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});