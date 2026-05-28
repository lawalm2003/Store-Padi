import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { Linking } from 'react-native';

export function DeepLinkHandler() {
  useEffect(() => {
    // Handle deep link when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      // Extract tokens from the URL and give them to Supabase
      if (url.includes('access_token') || url.includes('code=')) {
        supabase.auth
          .exchangeCodeForSession(url.split('?')[1] ?? url.split('#')[1] ?? '')
          .catch(console.error);
      }
    });

    // Handle deep link when app was closed and opened via link
    Linking.getInitialURL().then((url) => {
      if (!url) return;
      if (url.includes('access_token') || url.includes('code=')) {
        supabase.auth
          .exchangeCodeForSession(url.split('?')[1] ?? url.split('#')[1] ?? '')
          .catch(console.error);
      }
    });

    return () => subscription.remove();
  }, []);

  return null;
}
