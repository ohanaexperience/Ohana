import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const EVENTS = [
  {
    id: '1',
    title: 'Thai Cooking Class',
    description: 'Learn to make Pad Thai with locals!',
  },
  {
    id: '2',
    title: 'Temple Tour',
    description: 'Explore historic temples around Bangkok.',
  },
  {
    id: '3',
    title: 'Street Food Crawl',
    description: 'Discover hidden street food gems.',
  },
];

export default function BottomSheetScreen() {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['50%', '90%'], []);
  const router = useRouter();

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enablePanDownToClose
        onClose={() => router.back()}
      >
        <FlatList
          data={EVENTS}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
});
