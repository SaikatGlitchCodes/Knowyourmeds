import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeToggle } from '~/components/ThemeToggle';

export default function TabLayout() {

  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={29} color={color} />,
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          headerShown: false,
          title: 'Camera',
          tabBarIcon: ({ color }) => <FontAwesome name="plus" size={29} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tryout"
        options={{
          headerShown: true,
          title: 'Tryout',
          tabBarIcon: ({ color }) => <FontAwesome name="trophy" size={29} color={color} />,
        }}
      />  
      <Tabs.Screen
        name="profile"
        options={{
          headerRight: () => <ThemeToggle />,
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={29} color={color} />,
        }}
      />
    </Tabs>
  );
}
