import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack,Redirect } from 'expo-router';
//you must link it with the screen that wanna use
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import MessageProvider from './Context';

import { ProtectedRoute } from './AuthMiddleware'
import { AuthProvider } from './AuthContext'
import 'react-native-reanimated';
import "../global.css"

import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth} from './AuthContext'

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
  //Stack 
  //now i mus use a private routing to do everthing and first i must store the data inside the supabase which is gonna be a probelm in

  return (
    <MessageProvider>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index"  />
        <Stack.Screen name="Homepage" />
        <Stack.Screen name="Registration" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="Record" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    </MessageProvider>
  );
}
