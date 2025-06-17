import React, { useState,useLayoutEffect, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { COMMON_STYLES as S, COLORS } from '../../constants/theme';
import { useExperienceStore } from '../store/experience';
import { useRouter, useNavigation } from 'expo-router';

export default function CreateExperienceStep4() {
    const router = useRouter();
    const navigation = useNavigation();


  const {
    experienceImages,
    setCoverPhotoUri,
    setGalleryUris,
  } = useExperienceStore();

  const [error, setError] = useState('');

  const handleContinue = () => {
    if (!experienceImages.coverPhotoUri) {
      setError('Cover photo is required.');
      return;
    }
    if (!experienceImages.galleryUris || experienceImages.galleryUris.length < 3) {
      setError('Choose at least 3 gallery images.');
      return;
    }
    setError('');
    router.push('./step5');

  };



  const pickImage = async (isCover = false, index = null) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      if (isCover) {
        setCoverPhotoUri(uri);
      } else if (index !== null) {
        const updated = [...experienceImages.galleryUris];
        updated[index] = uri;
        setGalleryUris(updated);
      } else if (experienceImages.galleryUris.length < 6) {
        setGalleryUris([...experienceImages.galleryUris, uri]);
      }
    }
  };

  console.log('Experience Images:', experienceImages);

  useLayoutEffect(() => {
        navigation.setOptions({
          title: 'Create Experience',
          headerTitleAlign: 'center',
        });
      }, [navigation]);

  return (
    <KeyboardAwareScreen>
      <Text style={S.stepText}>Step 4 of 7</Text>
      <View style={S.progressBar}>
        <View style={[S.progressFill, { width: '58%' }]} />
      </View>

      <Text style={S.title}>Add Media</Text>
      <Text style={S.subtitle}>Upload photos and videos for your experience</Text>

      <View style={styles.card}>
        <Text style={S.sectionTitle}>Cover Photo*</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage(true)}>
          {experienceImages.coverPhotoUri ? (
            <Image source={{ uri: experienceImages.coverPhotoUri }} style={styles.coverImage} />
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={32} color={COLORS.gray} />
              <Text style={styles.uploadText}>Click to upload or drag and drop</Text>
            </>
          )}
        </TouchableOpacity>
        <Text style={styles.caption}>Recommended size: 1200×900 px (4:3)</Text>
        <Text style={styles.caption}>Format: PNG only</Text>
        <Text style={styles.caption}>Max file size: 5MB</Text>
      </View>

      <View style={styles.card}>
        <Text style={S.sectionTitle}>Gallery Images</Text>
        <FlatList
          data={[
            ...experienceImages.galleryUris,
            ...Array(6 - experienceImages.galleryUris.length).fill(null),
          ]}
          numColumns={3}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.galleryBox}
              onPress={() => pickImage(false, index)}
            >
              {item ? (
                <Image source={{ uri: item }} style={styles.galleryImage} />
              ) : (
                <Ionicons name="add" size={24} color={COLORS.gray} />
              )}
            </TouchableOpacity>
          )}
        />
        <Text style={styles.caption}>
          Up to 6 images (1080×1080 px or 1200×900 px)
        </Text>
      </View>

      <TouchableOpacity style={[S.button, { marginTop: 24 }]} onPress={handleContinue}>
        <Text style={S.buttonText}>Continue to Step 5</Text>
      </TouchableOpacity>

      {error ? (
        <Text style={{ color: 'red', marginTop: 8, textAlign: 'center' }}>{error}</Text>
      ) : null}
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  uploadBox: {
    height: 180,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    color: COLORS.gray,
    marginTop: 8,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  galleryBox: {
    width: '30%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '1.66%',
  },
  galleryImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  caption: {
    color: COLORS.gray,
    fontSize: 12,
    marginTop: 2,
  },
});