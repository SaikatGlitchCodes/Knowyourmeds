import '~/global.css';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform, View, Text, FlatListComponent } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { GestureHandlerRootView, ScrollView } from 'react-native-gesture-handler';
import FloatLoader from '~/components/custom/FloatLoader';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme, isDarkColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem('theme');
      if (Platform.OS === 'web') {
        document.documentElement.classList.add('bg-background');
      }
      if (!theme) {
        AsyncStorage.setItem('theme', colorScheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      const colorTheme = theme === 'dark' ? 'dark' : 'light';
      if (colorTheme !== colorScheme) {
        setColorScheme(colorTheme);
        setAndroidNavigationBar(colorTheme);
        setIsColorSchemeLoaded(true);
        return;
      }
      setAndroidNavigationBar(colorTheme);
      setIsColorSchemeLoaded(true);
    })().finally(() => {
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isColorSchemeLoaded) {
    return null;
  }

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
        <View className='relative flex-1'>
          <Stack initialRouteName='(tabs)'>
            <Stack.Screen name='(auth)/welcome' options={{
              headerShown: false,
            }} />
            <Stack.Screen name='(tabs)' options={{
              headerShown: false,
            }} />
            <Stack.Screen name='add-meds' options={{
              headerShown: false,
              title: 'Add Medicine',
            }} />
            <Stack.Screen name='camera-splash' options={{
              headerShown: false,
              title: 'Loading Data...',
            }} />
            <Stack.Screen name='/side-effect' options={{
              headerShown: true,
            }} />
            <Stack.Screen name='+not-found' options={{
              headerShown: false,
            }} />
          </Stack>
          {/* <FloatLoader/> */}
        </View>
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
