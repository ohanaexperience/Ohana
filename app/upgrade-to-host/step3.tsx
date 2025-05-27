import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../store/auth';

export default function HostStep4() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = useAuthStore((s) => s.user);
  const idToken = user?.tokens?.idToken;

  const [aboutMe, setAboutMe] = useState('');
  const [instagramConnected, setInstagramConnected] = useState(true);
  const [facebookConnected, setFacebookConnected] = useState(false);
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Become a Host',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const handlePhotoUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (result.canceled) return;

      const asset = result.assets[0];
      console.log('Selected asset:', asset);
      const uri = asset.uri;
      const fileExt = uri.split('.').pop()?.toLowerCase();
      const mimeType =
        fileExt === 'png'
          ? 'image/png'
          : fileExt === 'webp'
          ? 'image/webp'
          : 'image/jpeg'; // default to jpeg
      console.log('File extension:', fileExt, 'MIME type:', mimeType);
      // Get signed upload URL
      const response = await fetch(
        `https://ikfwakanfh.execute-api.us-east-1.amazonaws.com/dev/v1/user/profile/image/upload-url?mimeType=${mimeType}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      const { uploadUrl } = await response.json();

      const imageBlob = await (await fetch(uri)).blob();
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': mimeType },
        body: imageBlob,
      });

      if (!uploadResponse.ok) throw new Error('Upload failed');

      setProfileImageUri(uri);
    } catch (err) {
      console.error('Upload error:', err);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <SafeAreaView style={styles.container}>
      <Text style={styles.stepText}>Step 4 of 4</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      <Text style={styles.title}>Become a Host</Text>
      <Text style={styles.sectionHeader}>Profile Setup</Text>

      <TouchableOpacity style={styles.photoUpload} onPress={handlePhotoUpload}>
        {profileImageUri ? (
          <Image source={{ uri: profileImageUri }} style={styles.photoPreview} />
        ) : (
          <Ionicons name="camera" size={36} color="#4B5563" />
        )}
      </TouchableOpacity>
      <Text style={styles.uploadText}>Upload Profile Photo</Text>

      <Text style={styles.label}>About Me</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Tell your future guests about yourself, your interests, and what makes your experiences unique..."
        multiline
        numberOfLines={4}
        value={aboutMe}
        onChangeText={setAboutMe}
        placeholderTextColor="#D3D3D3"
      />

      {/* <Text style={styles.label}>Connect Social Media</Text>
      <View style={styles.socialRow}>
        <View style={styles.socialLeft}>
          <FontAwesome name="instagram" size={24} color="#000" />
          <Text style={styles.socialText}>Instagram</Text>
        </View>
        <Text style={styles.socialStatus}>
          {instagramConnected ? 'Connected ✅' : 'Connect'}
        </Text>
      </View> */}

      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>Create Your First Experience</Text>
      </TouchableOpacity>

      <Text style={styles.secondaryText}>I'll Set Up My Experience Later</Text>
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
    marginBottom: 16,
  },
  progressFill: { height: 4, backgroundColor: '#0F172A', borderRadius: 2 },
  title: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 12 },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  photoUpload: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  photoPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: 'cover',
  },
  uploadText: {
    textAlign: 'center',
    color: '#1F2937',
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 24,
  },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  textArea: {
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    marginBottom: 12,
  },
  socialLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  socialText: { fontSize: 16, marginLeft: 8 },
  socialStatus: { fontSize: 14, color: '#6B7280' },
  primaryButton: {
    backgroundColor: '#0F172A',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryText: {
    textAlign: 'center',
    color: '#6B7280',
    fontSize: 14,
    marginTop: 16,
  },
});
