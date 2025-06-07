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
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container} edges={['top']}>        
        <ScrollView showsVerticalScrollIndicator={false}>
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
            {startingLocation && <Marker coordinate={startingLocation} />}
          </MapView>
          <TextInput
            style={styles.input}
            placeholder="Enter address"
            value={startingAddress}
            onChangeText={setStartingAddress}
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
                {endingLocation && <Marker coordinate={endingLocation} />}
              </MapView>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                value={endingAddress}
                onChangeText={setEndingAddress}
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
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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