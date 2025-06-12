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

export default function CreateExperienceStep2() {
  const router = useRouter();
  const navigation = useNavigation();

  const [startingLocation, setStartingLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [startingAddress, setStartingAddress] = useState('');
  const [endingLocation, setEndingLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [endingAddress, setEndingAddress] = useState('');
  const [sameLocation, setSameLocation] = useState(true);
  const [meetingInstructions, setMeetingInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useLayoutEffect(() => {
  navigation.setOptions({
    title: 'Create Experience',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      paddingTop: Platform.OS === 'android' ? 8 : 0, // adjust as needed
    },
    headerStyle: {
      paddingTop: Platform.OS === 'android' ? 12 : 0, // extra space in header container if needed
    },
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
    });
    console.log('Current location:', location);
    const coords = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

    setStartingLocation(coords);
    setEndingLocation(coords);
  })();
}, []);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleContinue = () => {
    router.push('./step3');
  };

  const updateStartingLocationFromAddress = async (address) => {
    setStartingAddress(address);
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        setStartingLocation({
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        });
      }
    } catch (e) {
      console.warn('Geocode failed', e);
    }
  };

  const updateEndingLocationFromAddress = async (address) => {
    setEndingAddress(address);
    try {
      const geocode = await Location.geocodeAsync(address);
      if (geocode.length > 0) {
        setEndingLocation({
          latitude: geocode[0].latitude,
          longitude: geocode[0].longitude,
        });
      }
    } catch (e) {
      console.warn('Geocode failed', e);
    }
  };

  return (
    <KeyboardAwareScreen>
      <Text style={styles.stepText}>Step 2 of 7</Text>
      <View style={styles.progressBar}><View style={[styles.progressFill, { width: '28%' }]} /></View>

      <Text style={styles.title}>Location Meeting Point</Text>
      <Text style={styles.subtitle}>Set where your experience starts and ends</Text>

      <Text style={styles.sectionTitle}>Starting Location*</Text>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.mapPreview} region={{
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
              const [result] = await Location.reverseGeocodeAsync(coord);
              setStartingAddress(`${result.name}, ${result.city}, ${result.region}`);
            }}
          />
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={startingAddress}
        onChangeText={updateStartingLocationFromAddress}
      />

      <Text style={styles.sectionTitle}>Ending Location*</Text>
      <View style={styles.checkboxRow}>
        <Checkbox value={!sameLocation} onValueChange={() => setSameLocation(!sameLocation)} />
        <Text style={styles.checkboxLabel}>Different from Starting Location</Text>
      </View>

      {!sameLocation && (
        <>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.mapPreview} region={{
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
                  const [result] = await Location.reverseGeocodeAsync(coord);
                  setEndingAddress(`${result.name}, ${result.city}, ${result.region}`);
                }}
              />
            )}
          </MapView>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={endingAddress}
            onChangeText={updateEndingLocationFromAddress}
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
});