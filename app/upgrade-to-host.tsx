// upgrade-to-host.tsx (finalized with requested changes)

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function UpgradeToHostScreen() {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      const file = result.assets[0];
      if (file.fileSize && file.fileSize > 5 * 1024 * 1024) {
        Alert.alert('Image too large', 'Please select an image smaller than 5MB.');
        return;
      }
      setPhotoUri(file.uri);
    }
  };

  const submitApplication = () => {
    if (!agreed) {
      Alert.alert('Agreement required', 'You must agree to the terms to submit.');
      return;
    }
    // TODO: Submit data to backend
    Alert.alert('Application Submitted', 'Your application has been received!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Become a Host</Text>
      <Text style={styles.subHeader}>Share your experiences with others</Text>

      {/* Profile Photo */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.photoUpload} onPress={pickImage}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.profileImage} />
          ) : (
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
          )}
          <Text style={styles.uploadText}>Upload Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={styles.section}>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="your@email.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="+1 (555) 000-0000"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
      </View>

      {/* Languages */}
      <View style={styles.section}>
        <Text style={styles.label}>Languages Spoken</Text>
        {['English', 'Thai', 'Japanese'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.languageButton,
              languages.includes(lang) && styles.languageSelected,
            ]}
            onPress={() => toggleLanguage(lang)}>
            <Text
              style={{ color: languages.includes(lang) ? '#fff' : '#000' }}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Instagram Placeholder */}
      <View style={styles.section}>
        <Text style={styles.label}>Connect Instagram (Coming Soon)</Text>
        <TouchableOpacity style={styles.inactiveButton}>
          <Text style={{ color: '#aaa' }}>Connect</Text>
        </TouchableOpacity>
      </View>

      {/* Agreement */}
      <View style={styles.section}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setAgreed(!agreed)}>
          <Ionicons
            name={agreed ? 'checkbox' : 'square-outline'}
            size={24}
            color="black"
          />
          <Text style={styles.checkboxLabel}>
            I agree to Ohana's Terms of Service, Community Guidelines, and Privacy Policy
          </Text>
        </TouchableOpacity>
      </View>

      {/* Submit */}
      <TouchableOpacity style={styles.submitButton} onPress={submitApplication}>
        <Text style={styles.submitButtonText}>Continue to Step 2</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, backgroundColor: '#fff' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 14, color: '#555', marginBottom: 24 },
  section: { marginBottom: 24 },
  photoUpload: { alignItems: 'center' },
  uploadText: { marginTop: 8, color: '#007AFF', fontWeight: '600' },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  label: { fontWeight: '600', marginBottom: 8 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center' },
  checkboxLabel: { marginLeft: 8, flex: 1 },
  submitButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  languageButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ccc',
    marginRight: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  languageSelected: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  inactiveButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
});