import { useAuth } from '@/Providers/AuthContext';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (state === 'loading') return;

    const segment = segments[0];

    const inOnboarding = segment === 'onboarding';
    const inAuth = segment === '(auth)';
    const inSetup = segment === 'setup';

    const isPublicRoute = inOnboarding || inAuth;

    // ── 1. Not logged in → force onboarding/auth ─────────────────────────────
    if (state === 'unauthenticated') {
      if (!isPublicRoute) {
        router.replace('/onboarding');
      }
      return;
    }

    // ── 2. Logged in but no shop → force setup ───────────────────────────────
    if (state === 'authenticated_no_shop') {
      if (!inSetup) {
        router.replace('/setup');
      }
      return;
    }

    // ── 3. Fully authenticated → block auth/onboarding/setup pages ───────────
    if (state === 'authenticated') {
      if (isPublicRoute || inSetup) {
        router.replace('/(tabs)');
      }
    }
  }, [state, segments, router]);

  return children;
}
