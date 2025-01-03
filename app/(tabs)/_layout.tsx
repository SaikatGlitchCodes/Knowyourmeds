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
          default: {},
        }),
        tabBarActiveTintColor: '#007AFF', // Active tab color
        tabBarInactiveTintColor: '#8E8E93', // Inactive tab color
      }}>
        
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name={focused ? "home" : "home"} 
              size={focused ? 32 : 29} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          headerShown: false,
          title: 'Active',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name={focused ? "medkit" : "medkit"} 
              size={focused ? 32 : 29} 
              color={color} 
            />
          ),
        }}
        />
      <Tabs.Screen
        name="camera"
        options={{
          headerShown: false,
          title: 'Camera',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name={"plus"} 
              size={focused ? 32 : 29} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tryout"
        options={{
          headerShown: true,
          title: 'Tryout',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name={focused ? "trophy" : "trophy"} 
              size={focused ? 32 : 29} 
              color={color} 
            />
          ),
        }}
      />  
      <Tabs.Screen
        name="profile"
        options={{
          headerRight: () => <ThemeToggle />,
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <FontAwesome 
              name={focused ? "user" : "user-o"} 
              size={focused ? 32 : 29} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
