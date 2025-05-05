import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const EVENTS = [
  {
    id: '1',
    title: 'German Cooking Class',
    description: 'Learn to make Pad Thai with locals!',
    latitude: 13.7563,
    longitude: 100.5018,
  },
  {
    id: '2',
    title: 'Temple Tour',
    description: 'Explore historic temples around Bangkok.',
    latitude: 13.7512,
    longitude: 100.4925,
  },
  {
    id: '3',
    title: 'Street Food Crawl',
    description: 'Discover hidden street food gems.',
    latitude: 13.7594,
    longitude: 100.5374,
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  // Web fallback: no native map support
  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>  
        <View style={styles.webFallbackContainer}>
          <Text style={styles.webFallbackText}>Map is not supported on web</Text>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/explore/bottom-sheet')}>
            <Text style={styles.buttonText}>View Events</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Native map rendering on iOS/Android
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}> 
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        <MapView
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude: 13.7563,
            longitude: 100.5018,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {EVENTS.map((event) => (
            <Marker
              key={event.id}
              coordinate={{ latitude: event.latitude, longitude: event.longitude }}
              title={event.title}
              description={event.description}
            />
          ))}
        </MapView>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/explore/bottom-sheet')}>
          <Text style={styles.buttonText}>View Events</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  webFallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  webFallbackText: {
    fontSize: 18,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    fontSize: 16,
  },
});
