import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  FontAwesome,
} from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const profileOptions = [
  { id: '1', icon: 'credit-card', label: 'Payment', iconPack: 'MaterialIcons' },
  { id: '2', icon: 'location-outline', label: 'Trips', iconPack: 'Ionicons' },
  { id: '3', icon: 'help-circle-outline', label: 'Help', iconPack: 'Ionicons' },
  { id: '4', icon: 'settings', label: 'Settings', iconPack: 'Ionicons' },
  { id: '5', icon: 'logout', label: 'Log out', iconPack: 'MaterialIcons' },
  { id: '6', icon: 'star-outline', label: 'Upgrade to Host', iconPack: 'MaterialIcons' },
  { id: '7', icon: 'star', label: 'Upgrade to Business', iconPack: 'MaterialIcons' },
];

const renderIcon = (icon: string, iconPack: string) => {
  const size = 24;
  switch (iconPack) {
    case 'MaterialIcons':
      return <MaterialIcons name={icon as any} size={size} color="black" />;
    case 'Ionicons':
      return <Ionicons name={icon as any} size={size} color="black" />;
    case 'FontAwesome5':
      return <FontAwesome5 name={icon as any} size={size} color="black" />;
    default:
      return null;
  }
};

export default function ProfileScreen() {
    const router = useRouter();

  const handleOptionPress = (label: string) => {
    if (label === 'Settings') {
        router.push('../settings'); // this will slide the modal up
    }
    else if (label === 'Upgrade to Host'){
        router.push('/upgrade-to-host');
    } 
    else if (label === 'Upgrade to Business'){
        router.push('/upgrade-to-business');
    } 
    // add more handlers as needed
  };
  const user = {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    avatar: 'https://i.pravatar.cc/150?img=32',
    rating: 4,
  };

  const renderRatingBox = (rating: number) => (
    <View style={styles.ratingBox}>
      <FontAwesome name="star" size={12} color="#f1c40f" style={{ marginRight: 4 }} />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    </View>
  );
  

  return (
    <View style={styles.container}>
      {/* Top Profile Row */}
      <View style={styles.profileRow}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          {renderRatingBox(user.rating)}
        </View>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      </View>

      {/* List of Options */}
      <FlatList
        data={profileOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.option} onPress={() => handleOptionPress(item.label)}>
            {renderIcon(item.icon, item.iconPack)}
            <Text style={styles.optionText}>{item.label}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  userInfo: {
    flex: 1,
    paddingRight: 16,
  },
  stars: {
    flexDirection: 'row',
    marginTop: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 24,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    marginLeft: 16,
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
  },  
});
