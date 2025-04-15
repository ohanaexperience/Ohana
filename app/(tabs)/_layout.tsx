import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

import { useSegments } from 'expo-router';


export default function TabLayout() {
  const colorScheme = useColorScheme();

  const segments = useSegments();
  
  const hideTabBar = (segments as string[]).includes('explore');

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            display: hideTabBar ? 'none' : 'flex',
            
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={({ route }) => {
          // 👇 This line tells TypeScript what we expect
          const params = route.params as { tabBarVisible?: string } | undefined;

          const showTabBar = params?.tabBarVisible !== 'false';

          return {
            title: 'Explore',
            tabBarStyle: showTabBar
              ? Platform.select({ ios: { position: 'absolute' }, default: {} })
              : { display: 'none' },
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="paperplane.fill" color={color} />
            ),
          };
        }}
      />
    </Tabs>
  );
}
