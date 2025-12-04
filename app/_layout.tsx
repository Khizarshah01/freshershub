import { AuthProvider } from '@/provider/AuthProvider';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import "../global.css";

export default function Layout() {
  return (
    <AuthProvider>
      <>
        {/* 1. Sets status bar icons (battery, time) to dark so they are visible on light background */}
        <StatusBar style="dark" />

        <Stack
          screenOptions={{
            // Global Settings for all screens (except Home)
            headerStyle: {
              backgroundColor: '#F8F9FC', // Matches the page background
            },
            headerShadowVisible: false, // Removes the ugly line under the header
            headerTintColor: '#111827', // Dark text color
            headerTitleStyle: {
              fontWeight: '800', // Extra bold title
            },
            headerBackTitle: '',
          }}>

          {/* 2. Hiding the default header on Home so we can use your Custom Header */}
          <Stack.Screen
            name="index" // or "index" depending on your filename
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="auth/login" // or "index" depending on your filename
            options={{ headerShown: false }}
          />

<Stack.Screen
            name="auth/verify" // or "index" depending on your filename
            options={{ headerShown: false }}
          />

          {/* 3. If you have a details page, it will inherit the clean look above */}
        </Stack>
      </>
    </AuthProvider>
  );
}