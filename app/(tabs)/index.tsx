import React, { useState, useEffect } from 'react';
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
import { BACKEND_URL } from '@/app/env';

const categories = ['Photography', 'Nightlife', 'Gaming', 'Food', 'Art', 'Fitness'];

export default function ExperienceFeedScreen() {
  
  
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/v1/experiences/public?isPublic=true`);
        const data = await res.json();
        
        setExperiences(data);
      } catch (err) {
        // console.error('Failed to load experiences:', err);
      }
    };

    fetchExperiences();
  }, []);

    useEffect(() => {
      const fetchCategories = async () => {
        try {
          const res = await fetch(`${BACKEND_URL}/v1/categories/public`);
          const data = await res.json();

          setCategories(data);
        } catch (err) {
          // console.error('Failed to load experiences:', err);
        }
      };

      fetchCategories();
    }, []);



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

      {/* <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map((category: any) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategories.includes(category.id) && styles.categorySelected,
            ]}
            onPress={() => {
              setSelectedCategories((prev) =>
                prev.includes(category.id)
                  ? prev.filter((id) => id !== category.id)
                  : [...prev, category.id]
              );
              // OPTIONAL: fetch filtered experiences here
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategories.includes(category.id) && styles.categoryTextSelected,
              ]}
            >
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView> */}

      {/* Experiences List */}
      <FlatList
        data={experiences}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cardList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.coverImageUrl }} style={styles.cardImage} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.tagline}</Text>
              <Text style={styles.cardPrice}>${(item.pricePerPerson / 100).toFixed(2)}</Text>
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
  paddingHorizontal: 16,
  paddingVertical: 12, // increased from 8
  backgroundColor: '#eee',
  borderRadius: 24, // slightly more rounded for better look
  marginRight: 10,
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 48, // ensure a minimum touch area
},

categoryText: {
  color: '#000',
  fontSize: 16, // slightly larger text
  fontWeight: '500',
},

categoryTextSelected: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
},

categorySelected: {
  backgroundColor: '#000',
},
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