import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

type Props = {
  region: { latitude: number; longitude: number } | null;
  marker: { latitude: number; longitude: number } | null;
  address: string;
  onAddressChange: (address: string) => void;
  onRegionChange: (location: { latitude: number; longitude: number }) => void;
};

export default function MapLocationPicker({
  region,
  marker,
  address,
  onAddressChange,
  onRegionChange,
}: Props) {
  const handleDragEnd = (e: any) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    onRegionChange({ latitude, longitude });
  };

  return (
    <View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={{
          latitude: region?.latitude || 37.78825,
          longitude: region?.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {marker && (
          <Marker
            coordinate={marker}
            draggable
            onDragEnd={handleDragEnd}
          />
        )}
      </MapView>
      <TextInput
        style={styles.input}
        placeholder="Enter address"
        value={address}
        onChangeText={onAddressChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 150,
    borderRadius: 10,
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
});