import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useNavigation } from 'expo-router';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';
import { useExperienceStore } from '../store/experience';
import { COLORS } from '@/constants/theme';

export default function CreateExperienceStep2() {
  const router = useRouter();
  const navigation = useNavigation();
  const { step2, setStep2 } = useExperienceStore();

  const [startingLocation, setStartingLocation] = useState(step2.startingLocation);
  const [startingAddress, setStartingAddress] = useState(step2.startingAddress);
  const [endingLocation, setEndingLocation] = useState(step2.endingLocation);
  const [endingAddress, setEndingAddress] = useState(step2.endingAddress);
  const [sameLocation, setSameLocation] = useState(step2.sameLocation ?? true);
  const [meetingInstructions, setMeetingInstructions] = useState(step2.meetingInstructions || '');
  const [imageUri, setImageUri] = useState(step2.imageUri || null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Create Experience',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest,
        maximumAge: 0,
        enableHighAccuracy: true,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setStartingLocation(coords);
      setEndingLocation(coords);
      setStep2({ startingLocation: coords, endingLocation: coords });
    })();
  }, []);

  useEffect(() => {
  if (sameLocation) {
    
    setStep2({ endingLocation: startingLocation, endingAddress: startingAddress });
  }
}, [sameLocation, startingLocation, startingAddress]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!meetingInstructions.trim()) {
      newErrors.meetingInstructions = 'Meeting instructions are required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setStep2({ imageUri: result.assets[0].uri });
    }
  };

  const handleContinue = () => {
    if (!validateForm()) return;
    router.push('./step3');
  };

  const updateStartingLocationFromAddress = async (address) => {
    setStartingAddress(address);
    setStep2({ startingAddress: address });
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        const loc = {
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        };
        setStartingLocation(loc);
        setStep2({ startingLocation: loc });
      }
    } catch (e) {
      console.warn('Geocode failed', e);
    }
  };

  const updateEndingLocationFromAddress = async (address) => {
    setEndingAddress(address);
    setStep2({ endingAddress: address });
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        const loc = {
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        };
        setEndingLocation(loc);
        setStep2({ endingLocation: loc });
      }
    } catch (e) {
      console.warn('Geocode failed', e);
    }
  };
// console.log('Step 2 Form State:', step2)
  return (
    <KeyboardAwareScreen>
      <Text style={styles.stepText}>Step 2 of 7</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: '28%' }]} /></View>

      <Text style={styles.title}>Location Meeting Point</Text>
      <Text style={styles.subtitle}>Set where your experience starts and ends</Text>

      <Text style={styles.sectionTitle}>Starting Location*</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapPreview}
        region={{
          latitude: startingLocation?.latitude || 37.78825,
          longitude: startingLocation?.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
        {startingLocation && (
          <Marker
            coordinate={startingLocation}
            draggable
            onDragEnd={async (e) => {
              const coord = e.nativeEvent.coordinate;
              setStartingLocation(coord);
              setStep2({ startingLocation: coord });
              const [result] = await Location.reverseGeocodeAsync(coord);
              const formatted = `${result.name}, ${result.city}, ${result.region}`;
              setStartingAddress(formatted);
              setStep2({ startingAddress: formatted });
            }}
          />
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholderTextColor={COLORS.placeholder}
        placeholder="Enter address"
        value={startingAddress}
        onChangeText={updateStartingLocationFromAddress}
      />

      <Text style={styles.sectionTitle}>Ending Location*</Text>
      <View style={styles.checkboxRow}>
        <Checkbox
          value={!sameLocation}
          onValueChange={() => {
            const newValue = !sameLocation;
            setSameLocation(newValue);
            setStep2({ sameLocation: newValue });
            if (newValue === false) {
              setEndingLocation(startingLocation);
              setEndingAddress(startingAddress);
              setStep2({ endingLocation: startingLocation, endingAddress: startingAddress });
            }
          }}
        />
        <Text style={styles.checkboxLabel}>Different from Starting Location</Text>
      </View>

      {!sameLocation && (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapPreview}
            region={{
              latitude: endingLocation?.latitude || 37.78825,
              longitude: endingLocation?.longitude || -122.4324,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}>
            {endingLocation && (
              <Marker
                coordinate={endingLocation}
                draggable
                onDragEnd={async (e) => {
                  const coord = e.nativeEvent.coordinate;
                  setEndingLocation(coord);
                  setStep2({ endingLocation: coord });
                  const [result] = await Location.reverseGeocodeAsync(coord);
                  const formatted = `${result.name}, ${result.city}, ${result.region}`;
                  setEndingAddress(formatted);
                  setStep2({ endingAddress: formatted });
                }}
              />
            )}
          </MapView>
          <TextInput
            style={styles.input}
            placeholderTextColor={COLORS.placeholder}
            placeholder="Enter address"
            value={endingAddress}
            onChangeText={updateEndingLocationFromAddress}
          />
        </>
      )}

      <Text style={styles.sectionTitle}>Meeting Instructions*</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        placeholderTextColor={COLORS.placeholder}
        placeholder="Provide detailed instructions for finding the meeting point"
        value={meetingInstructions}
        onChangeText={(text) => {
          setMeetingInstructions(text);
          setStep2({ meetingInstructions: text });
        }}
        multiline
      />
      {errors.meetingInstructions && <Text style={styles.errorText}>{errors.meetingInstructions}</Text>}

      <Text style={styles.sectionTitle}>Upload Location Image (optional)</Text>
      <TouchableOpacity style={styles.uploadBox} onPress={handlePickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={{ fontSize: 32, color: '#888' }}>+</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue to Step 3</Text>
      </TouchableOpacity>
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  stepText: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  progressBar: { height: 4, backgroundColor: '#eee', borderRadius: 2, marginBottom: 24 },
  progressFill: { height: 4, backgroundColor: '#000', borderRadius: 2 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  mapPreview: {
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  checkboxLabel: { marginLeft: 8, fontSize: 14 },
  uploadBox: {
    height: 100,
    width: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  image: { height: '100%', width: '100%', borderRadius: 8 },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
});