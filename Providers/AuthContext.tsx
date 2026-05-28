import { supabase } from '@/lib/supabase';
import { getProfile, getShop } from '@/services/dataServices';
import { Session } from '@supabase/supabase-js';
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useApp } from './AppProvider';

type AuthState =
  | 'loading'
  | 'unauthenticated'
  | 'authenticated_no_shop'
  | 'authenticated';

export type Shop = {
  id: string;
  owner_id: string;

  name: string;
  category?: string | null;
  logo_url?: string | null;

  address: string | null;
  email?: string | null;
  phone: string | null;

  currency: string;
  currency_symbol: string;

  low_stock_threshold_percent: number;
  auto_backup: boolean;

  notify_stock_alerts: boolean;
  notify_daily_summary: boolean;
  notify_daily_summary_time: string;
  notify_restock_reminders: boolean;

  theme: string;

  created_at: string;
  updated_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  state: AuthState;
  session: Session | null;

  shop: Shop | null;
  profile: Profile | null;

  refreshShop: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>('loading');
  const [session, setSession] = useState<Session | null>(null);

  const [shop, setShop] = useState<Shop | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const { setTheme } = useApp();
  async function resolveState(session: Session | null) {
    if (!session) {
      setSession(null);
      setShop(null);
      setProfile(null);
      setState('unauthenticated');
      return;
    }

    setSession(session);

    const userId = session.user.id;

    try {
      // Fetch in parallel (faster)
      const [shopData, profileData] = await Promise.all([
        getShop(userId),
        getProfile(userId),
      ]);

      setShop(shopData);
      if (shopData?.theme) {
        setTheme(shopData.theme as 'light' | 'dark' | 'auto');
      }
      setProfile(profileData);

      setState(shopData ? 'authenticated' : 'authenticated_no_shop');
    } catch (err) {
      console.error('resolveState error:', err);
      setState('unauthenticated');
    }
  }

  useEffect(() => {
    let isMounted = true;

    // Initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted) return;
      resolveState(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolveState(session);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function refreshShop() {
    if (!session) return;

    const shopData = await getShop(session.user.id);
    setShop(shopData);
    if (shopData?.theme) {
      setTheme(shopData.theme as 'light' | 'dark' | 'auto');
    }
    setState(shopData ? 'authenticated' : 'authenticated_no_shop');
  }

  async function refreshProfile() {
    if (!session) return;

    const profileData = await getProfile(session.user.id);
    setProfile(profileData);
  }

  return (
    <AuthContext.Provider
      value={{
        state,
        session,
        shop,
        profile,
        refreshShop,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
