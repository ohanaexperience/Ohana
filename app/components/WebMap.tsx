// WebMap.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 13.7563,
  lng: 100.5018,
};

export default function WebMap({ events }: { events: any[] }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  if (!isLoaded) return <View style={styles.loading} />;

  return (
    <View style={StyleSheet.absoluteFill}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13}>
        {events.map((event) => (
          <Marker
            key={event.id}
            position={{ lat: event.latitude, lng: event.longitude }}
            title={event.title}
          />
        ))}
      </GoogleMap>
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: '#eee',
  },
});