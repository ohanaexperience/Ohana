import React from 'react';
import MapView, { Marker } from 'react-native-maps';

type Event = {
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
};

type Props = { events: Event[] };

export default function NativeMap({ events }: Props) {
  return (
    <MapView
      style={{ flex: 1 }}
      initialRegion={{
        latitude: 13.7563,
        longitude: 100.5018,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
    >
      {events.map((event) => (
        <Marker
          key={event.id}
          coordinate={{ latitude: event.latitude, longitude: event.longitude }}
          title={event.title}
          description={event.description}
        />
      ))}
    </MapView>
  );
}
