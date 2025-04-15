import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const categories = ['Photography', 'Nightlife', 'Gaming', 'Food', 'Art', 'Fitness'];
const experiences = [
  {
    id: '1',
    image: 'https://source.unsplash.com/random/400x200?party',
    name: 'Beach Party',
    description: 'Enjoy a beachside party with music and food.',
    price: '$25',
  },
  {
    id: '2',
    image: 'https://source.unsplash.com/random/400x200?camera',
    name: 'Photography Walk',
    description: 'Explore the city through a photographer’s lens.',
    price: '$15',
  },
  {
    id: '3',
    image: 'https://source.unsplash.com/random/400x200?camera',
    name: 'Sasquatch Hunt',
    description: 'Find the real deal.',
    price: '$15',
  },
];

export default function ExperienceFeedScreen() {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Ohana</Text>
        <Ionicons name="notifications-outline" size={24} color="black" />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search experiences..."
        />
      </View>

      {/* Filters */}
      <View style={styles.filterRowLeftAligned}>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="location-outline" size={16} />
          <Text style={styles.filterText}>Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="date-range" size={16} />
          <Text style={styles.filterText}>Date</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category) && styles.categorySelected,
            ]}
            onPress={() => toggleCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(category) && styles.categoryTextSelected,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Experiences List */}
      <FlatList
        data={experiences}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 50 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  headerText: { fontSize: 24, fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 10 },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  filterRowLeftAligned: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 10,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  filterText: { marginLeft: 6 },
  categoryScroll: { paddingLeft: 20, marginBottom: 10 },
  categoryButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
    justifyContent: 'center',
  },
  categorySelected: { backgroundColor: '#000' },
  categoryText: { color: '#000', fontSize: 14 },
  categoryTextSelected: { color: '#fff', fontSize: 14 },
  cardList: { paddingHorizontal: 20, paddingBottom: 100 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardImage: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#555', marginBottom: 6 },
  cardPrice: { fontSize: 16, fontWeight: '600', color: '#111' },
});
