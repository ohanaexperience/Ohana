import React, { useEffect, useState } from 'react';
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
import { useRouter, Stack } from 'expo-router';
import * as Location from 'expo-location';
import { handlePhotoUpload } from '../utils/utils';
import MapLocationPicker from '../../components/MapLocationPicker';
import KeyboardAwareScreen from '../../components/KeyboardAwareScreen';

export default function CreateExperienceStep2() {
  const router = useRouter();

  const [startingLocation, setStartingLocation] = useState(null);
  const [startingAddress, setStartingAddress] = useState('');
  const [endingLocation, setEndingLocation] = useState(null);
  const [endingAddress, setEndingAddress] = useState('');
  const [sameLocation, setSameLocation] = useState(true);
  const [meetingInstructions, setMeetingInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      let location = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setStartingLocation(coords);
      setEndingLocation(coords);
    })();
  }, []);

  const updateLocationFromAddress = async (address, setAddress, setLocation) => {
    setAddress(address);
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        const coord = {
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        };
        setLocation(coord);
      }
    } catch (e) {
      console.warn('Geocode failed', e);
    }
  };

  const handleContinue = () => {
    router.push('./step3');
  };

  return (
    <KeyboardAwareScreen>
        {/* <Stack.Screen options={{ title: 'Create Experience' }} /> */}
        
          <Text style={styles.stepText}>Step 2 of 7</Text>
          <View style={styles.progressBar}><View style={[styles.progressFill, { width: '28%' }]} /></View>

          <Text style={styles.title}>Location Meeting Point</Text>
          <Text style={styles.subtitle}>Set where your experience starts and ends</Text>

          <Text style={styles.sectionTitle}>Starting Location*</Text>
          <MapLocationPicker
            location={startingLocation}
            setLocation={setStartingLocation}
            onLocationChange={async (coord) => {
              setStartingLocation(coord);
              const [result] = await Location.reverseGeocodeAsync(coord);
              setStartingAddress(`${result.name}, ${result.city}, ${result.region}`);
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={startingAddress}
            onChangeText={(text) => updateLocationFromAddress(text, setStartingAddress, setStartingLocation)}
          />

          <Text style={styles.sectionTitle}>Ending Location*</Text>
          <View style={styles.checkboxRow}>
            <Checkbox value={!sameLocation} onValueChange={() => setSameLocation(!sameLocation)} />
            <Text style={styles.checkboxLabel}>Different from Starting Location</Text>
          </View>

          {!sameLocation && (
            <>
              <MapLocationPicker
                location={endingLocation}
                setLocation={setEndingLocation}
                onLocationChange={async (coord) => {
                  setEndingLocation(coord);
                  const [result] = await Location.reverseGeocodeAsync(coord);
                  setEndingAddress(`${result.name}, ${result.city}, ${result.region}`);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                value={endingAddress}
                onChangeText={(text) => updateLocationFromAddress(text, setEndingAddress, setEndingLocation)}
              />
            </>
          )}

          <Text style={styles.sectionTitle}>Meeting Instructions*</Text>
          <TextInput
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            placeholder="Provide detailed instructions for finding the meeting point"
            value={meetingInstructions}
            onChangeText={setMeetingInstructions}
            multiline
          />

          <Text style={styles.sectionTitle}>Upload Location Image (optional)</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={async () => {
            const uri = await handlePhotoUpload();
            if (uri) setImageUri(uri);
          }}>
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
});