import React, {useLayoutEffect} from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter, useNavigation} from 'expo-router';
import { useExperienceStore } from '../store/experience';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useAuthStore } from '../store/auth';
import tzLookup from 'tz-lookup';
import {
  BACKEND_URL,
} from '../env';
import { getMimeTypeFromUri } from '../utils/utils';

export default function CreateExperienceStep7() {
  const router = useRouter();
  const navigation = useNavigation();
  const accessToken = useAuthStore((s) => s.user?.tokens.idToken);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Experience',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const {
    step1,
    step2,
    step3,
    step5,
    step6,
    experienceImages
  } = useExperienceStore();

  const startingCoords = step2.startingLocation;
  const hasCoords = !!startingCoords;

  const handlePublish = async () => {
    if (!accessToken) {
      Alert.alert('Error', 'Missing access token');
      return;
    }

    const payload = {
      title: step1.title,
      tagline: step1.tagline,
      category: step1.category,
      languages: step1.languages,
      experienceType: step1.experienceType,
      description: step1.description,
      startingLocation: {
        address: step2.startingAddress,
        latitude: step2.startingLocation?.latitude,
        longitude: step2.startingLocation?.longitude,
      },
      endingLocation: {
        address: step2.endingAddress,
        latitude: step2.endingLocation?.latitude,
        longitude: step2.endingLocation?.longitude,
      },
      meetingLocation: {
        instructions: step2.meetingInstructions,
        imageUrl: step2.imageUri || undefined,
      },
      pricePerPerson: Math.round(Number(step3.basePrice) * 100),
      groupDiscounts: step3.groupDiscounts,
      earlyBirdRate: step3.earlyBirdRate,
      cancellationPolicy: step3.cancellationPolicy,
      groupSize: {
        minGuests: step3.minGuests,
        maxGuests: step3.maxGuests,
      },
      autoCancelEnabled: step3.autoCancelIfMinNotMet,
      includedItems: step5.includedItems,
      whatToBring: step5.thingsToBring,
      physicalRequirements: step5.activityLevel,
      ageRecommendations: step5.recommendedAge,
      accessibilityInfo: step5.accessibilityNotes,
      durationHours: step6.duration,
      timezone: tzLookup(step2.startingLocation.latitude, step2.startingLocation.longitude),
      availability: {
        startDate: step6.availability.startDate,
        daysOfWeek: step6.availability.daysOfWeek,
        timeSlots: step6.availability.timeSlots,
      },
    };
    console.log('Publishing experience with payload:', payload);
    try {
        const res = await fetch(`${BACKEND_URL}/v1/host/experiences`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
        });

        if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
        }

        const data = await res.json();
        console.log('Published experience data:', data);
        const experienceId = data.id;
        console.log('Published experience ID:', experienceId);

        // Gather image URIs from Zustand
        // after receiving `experienceId` from the POST /experiences call...

        const { coverPhotoUri, galleryUris } = useExperienceStore.getState().experienceImages;
        const { imageUri: meetingImageUri } = useExperienceStore.getState().step2;

        const images = [];

        if (coverPhotoUri) {
        images.push({ mimeType: getMimeTypeFromUri(coverPhotoUri), imageType: 'cover' });
        }
        if (Array.isArray(galleryUris)) {
        for (const uri of galleryUris) {
            images.push({ mimeType: getMimeTypeFromUri(uri), imageType: 'gallery' });
        }
        }
        if (meetingImageUri) {
        images.push({ mimeType: getMimeTypeFromUri(meetingImageUri), imageType: 'meeting-location' });
        }

        // 🔁 Step 1: Register image upload URLs
        const uploadRes = await fetch(`${BACKEND_URL}/v1/host/experiences/image/upload-url`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ experienceId, images }),
        });

        if (!uploadRes.ok) {
        const errorText = await uploadRes.text();
        throw new Error(errorText);
        }

        const uploadUrls = await uploadRes.json();

        // 🔁 Step 2: Upload image binaries to correct URLs
        const uploadImage = async (uri: string, url: string) => {
        const blob = await fetch(uri).then(r => r.blob());
        const putRes = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': blob.type },
            body: blob,
        });
        if (!putRes.ok) throw new Error(`Failed to upload image: ${uri}`);
        };

        // 🔗 Map each URI to its corresponding URL
        try {
        const uploadPromises = [];

        if (coverPhotoUri && uploadUrls.coverUploadUrl) {
            uploadPromises.push(uploadImage(coverPhotoUri, uploadUrls.coverUploadUrl));
        }

        if (Array.isArray(galleryUris) && Array.isArray(uploadUrls.galleryUploadUrls)) {
            galleryUris.forEach((uri, idx) => {
            const url = uploadUrls.galleryUploadUrls[idx];
            if (url) uploadPromises.push(uploadImage(uri, url));
            });
        }

        if (meetingImageUri && Array.isArray(uploadUrls.meetingLocationUploadUrls)) {
            // Assuming only one image for meeting-location
            const meetingUrl = uploadUrls.meetingLocationUploadUrls[0];
            if (meetingUrl) uploadPromises.push(uploadImage(meetingImageUri, meetingUrl));
        }

        await Promise.all(uploadPromises);
        console.log('✅ All images uploaded successfully');
        } catch (uploadErr) {
        console.error('❌ Image upload failed:', uploadErr);
        throw new Error('Image upload failed');
        }

        Alert.alert('Success', 'Experience published successfully!');
        router.push('/');
    } catch (err: any) {
        console.error('Publish failed:', err);

        let errorMessage = 'Failed to publish experience';

        try {
        const parsed = JSON.parse(err.message);
        if (parsed?.message) {
            console.log('*****', parsed.message);
            errorMessage = parsed.message;
        }
        } catch {
        if (err?.message) {
            errorMessage = err.message;
        }
        }

        Alert.alert('Error', errorMessage);
    }
  };

  return (
    <KeyboardAwareScreen>
      <Text style={styles.stepText}>Step 7 of 7</Text>
      <Text style={styles.header}>Review & Publish</Text>
      <Text style={styles.subheader}>Review your experience details before publishing</Text>

      <View style={styles.card}>
        {experienceImages.coverPhotoUri ? (
          <Image source={{ uri: experienceImages.coverPhotoUri }} style={styles.coverImage} />
        ) : (
          <View style={styles.coverPlaceholder}><Text style={styles.coverText}>Cover</Text></View>
        )}

        <View style={{ padding: 16 }}>
          <Text style={styles.title}>{step1.title || 'Your Experience Title'}</Text>
          <Text style={styles.tagline}>{step1.tagline || 'Short tagline goes here'}</Text>

          <View style={styles.detailRow}><Text style={styles.icon}>🏷️</Text><Text style={styles.detailText}>${step3.basePrice || '0'} per person</Text></View>
          <View style={styles.detailRow}><Text style={styles.icon}>⏱️</Text><Text style={styles.detailText}>{step6.duration} hours duration</Text></View>
          <View style={styles.detailRow}><Text style={styles.icon}>📍</Text><Text style={styles.detailText}>Meeting point set</Text></View>
        </View>
      </View>

      {hasCoords && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.mapPreview}
          region={{
            latitude: startingCoords.latitude,
            longitude: startingCoords.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker coordinate={startingCoords} />
        </MapView>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handlePublish}>
        <Text style={styles.primaryButtonText}>Publish Live Now</Text>
      </TouchableOpacity>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  stepText: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  header: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subheader: { fontSize: 14, color: '#555', marginBottom: 16 },
  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
  coverImage: { width: '100%', height: 150 },
  coverPlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: { fontSize: 16, color: '#777' },
  title: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  tagline: { fontSize: 14, color: '#666', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  icon: { fontSize: 16, marginRight: 8 },
  detailText: { fontSize: 14, color: '#333' },
  mapPreview: {
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#0f0f1a',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});