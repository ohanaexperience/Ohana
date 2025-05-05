// app/explore/Map.tsx or components/Map.tsx
import { Platform } from 'react-native';

let Map: any;

if (Platform.OS === 'web') {
  Map = require('./WebMap').default;
} else {
  Map = require('./NativeMap').default;
}

export default Map;