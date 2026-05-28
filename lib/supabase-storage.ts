// lib/supabase-storage.ts
import { Platform } from 'react-native';

// Platform-specific storage implementation
const getStorage = () => {
  if (Platform.OS === 'web') {
    return {
      getItem: (key: string) => {
        try {
          return Promise.resolve(localStorage.getItem(key));
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem: (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem: (key: string) => {
        try {
          localStorage.removeItem(key);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
    };
  }

  // Dynamically import AsyncStorage only on native platforms
  const AsyncStorage =
    require('@react-native-async-storage/async-storage').default;
  return AsyncStorage;
};

export const storage = getStorage();
