import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          headerRight: () => <ThemeToggle />,
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle" size={29} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerRight: () => <ThemeToggle />,
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user-circle" size={29} color={color} />,
        }}
      />
    </Tabs>
  );
}
