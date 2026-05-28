import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export default function AuthCallbackScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Supabase JS client automatically handles the token
    // from the URL when the app opens via deep link.
    // onAuthStateChange in AuthContext fires automatically.
    // We just need to wait briefly then let AuthGuard redirect.
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.center}>
        {error ? (
          <>
            <ThemedText style={[styles.errorTitle, { color: colors.error }]}>
              Verification failed
            </ThemedText>
            <ThemedText style={[styles.errorSub, { color: colors.text3 }]}>
              {error}
            </ThemedText>
          </>
        ) : (
          <>
            <ActivityIndicator color={colors.primary} size='large' />
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Verifying your email...
            </ThemedText>
            <ThemedText style={[styles.sub, { color: colors.text3 }]}>
              Just a moment
            </ThemedText>
          </>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  title: { fontSize: 18, fontWeight: '600', textAlign: 'center' },
  sub: { fontSize: 14, textAlign: 'center' },
  errorTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  errorSub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
