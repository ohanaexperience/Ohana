import React, { useEffect, useMemo } from 'react';
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
import { useAuthStore, useIsLoggedIn } from '../store/auth';

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
  const signOut = useAuthStore((s) => s.signOut);
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useIsLoggedIn();
  const isHost = useAuthStore((s) => s.isHost);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/signin');
    }
  }, [isLoggedIn]);

  const profileOptions = useMemo(() => {
    const baseOptions = [
      { id: '1', icon: 'credit-card', label: 'Payment', iconPack: 'MaterialIcons' },
      { id: '2', icon: 'location-outline', label: 'Trips', iconPack: 'Ionicons' },
      { id: '3', icon: 'help-circle-outline', label: 'Help', iconPack: 'Ionicons' },
      { id: '4', icon: 'settings', label: 'Settings', iconPack: 'Ionicons' },
      { id: '5', icon: 'logout', label: 'Log out', iconPack: 'MaterialIcons' },
      { id: '6', icon: 'star-outline', label: 'Upgrade to Host', iconPack: 'MaterialIcons' },
    ];
    if (isHost) {
      baseOptions.unshift({
        id: '0',
        icon: 'plus-circle-outline',
        label: 'Create an Experience',
        iconPack: 'Ionicons',
      });
    }
    return baseOptions;
  }, [isHost]);

  if (!user) return null;

  const handleOptionPress = (label: string) => {
    if (label === 'Settings') {
      router.push('/settings');
    } else if (label === 'Upgrade to Host') {
      router.push('../upgrade-to-host/step1');
    } else if (label === 'Create an Experience') {
      router.push('/create-experience/step6');
    } else if (label === 'Log out') {
      signOut();
    }
  };

  const renderRatingBox = () => (
    <View style={styles.ratingBox}>
      <FontAwesome name="star" size={12} color="#f1c40f" style={{ marginRight: 4 }} />
      <Text style={styles.ratingText}>4.0</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          {renderRatingBox()}
        </View>
        <Image source={{ uri: user.photo ?? 'https://i.pravatar.cc/150?img=32' }} style={styles.avatar} />
      </View>

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