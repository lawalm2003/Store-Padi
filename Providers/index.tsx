// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from 'react';

import { queryClient } from '@/lib/queryClient';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import AppProvider from './AppProvider';
import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartProvider';

export default function Providers({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </AppProvider>
      </QueryClientProvider>
      <StatusBar style='auto' />
    </ThemeProvider>
  );
}
