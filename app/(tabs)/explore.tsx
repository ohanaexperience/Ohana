import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Map from '../components/Map';

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

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Map events={EVENTS} />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/explore/bottom-sheet')}>
        <Text style={styles.buttonText}>View Events</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
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