import AuthGuard from '@/components/auth/AuthGuard';
import CustomSplash from '@/components/CustomSplash';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import Providers from '@/Providers';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { Toaster } from 'sonner-native';

// Prevent native splash from auto-hiding if you want both
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: 'index',
};

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Providers>
        <App />
      </Providers>
    </GestureHandlerRootView>
  );
}

function App() {
  const [fontsLoaded] = useFonts({
    Poppins: require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);
  const { scheme } = useAppTheme();

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the native splash screen visible while fonts load
        if (fontsLoaded) {
          // Hide native splash screen
          await SplashScreen.hideAsync();

          // Artificially delay the custom splash screen for better UX
          await new Promise((resolve) => setTimeout(resolve, 2000));

          // Mark app as ready to hide custom splash
          setAppIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, [fontsLoaded]);

  // Show custom splash screen until both fonts are loaded AND minimum time has passed
  if (!fontsLoaded || !appIsReady) {
    return <CustomSplash />;
  }

  return (
    <ThemedView
      style={{
        flex: 1,
        paddingTop: Platform.OS === 'web' ? 0 : 0,
      }}
    >
      {/* <DeepLinkHandler /> */}
      <AuthGuard>
        <Slot />
      </AuthGuard>

      <Toaster />
    </ThemedView>
  );
}
