import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { StripeProvider } from '@stripe/stripe-react-native';

if (__DEV__ === false) {
  const defaultHandler = ErrorUtils.getGlobalHandler?.();

  ErrorUtils.setGlobalHandler((error, isFatal) => {
    console.log('🔥 Uncaught JS Error:', error.message, error.stack);
    if (defaultHandler) {
      defaultHandler(error, isFatal);
    }
  });
}

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <StripeProvider
      publishableKey='pk_live_51RKBfLDVprfwF09mwHtTxQ4FuKdJu8WTgZCSiGzpBzFjUYB5b13nCPXtsztLVvNEiCHclOaoRgwbsknwGitLUTSp00cGM1D9Vn'
      urlScheme='ohanaapp'
      merchantIdentifier="merchant.com.your.app.id"
      >
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="settings" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="upgrade-to-host" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            <Stack.Screen name="+not-found" />
            <Stack.Screen
              name="explore/bottom-sheet"
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="signin"
              options={{
                presentation: 'modal', // makes it slide up
                headerShown: false,    // we'll handle our own close button
              }}
              />
          </Stack>
          
          <StatusBar style="auto" />
        </ThemeProvider>
      </StripeProvider>
    </GestureHandlerRootView>
  );
}
