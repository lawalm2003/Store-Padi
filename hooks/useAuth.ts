import { supabase } from '@/lib/supabase';
import { useAuth } from '@/Providers/AuthContext';
import {
  forgotPassword,
  resetPassword,
  signIn,
  signOut,
  signUp,
} from '@/services/authServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { toast } from 'sonner-native';

// ── Login ─────────────────────────────────────────────────────────────────────
export function useLogin() {
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      signIn(email, password),

    onSuccess: () => {
      toast.success('Welcome back 👋');
      // AuthContext onAuthStateChange handles navigation automatically
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Login failed');
    },
  });
}

// ── Register ──────────────────────────────────────────────────────────────────
export function useRegister() {
  return useMutation({
    mutationFn: ({
      email,
      password,
      full_name,
    }: {
      email: string;
      password: string;
      full_name: string;
    }) => signUp(email, password, full_name),

    onSuccess: () => {
      toast.success('Account created 🎉');
      // AuthGuard sees authenticated_no_shop → navigates to /setup
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Registration failed');
    },
  });
}

// ── Logout ────────────────────────────────────────────────────────────────────
export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOut,

    onSuccess: () => {
      toast.success('Logged out');
      queryClient.clear();
      // AuthContext onAuthStateChange handles → unauthenticated → /onboarding
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Logout failed');
    },
  });
}

// ── Create Shop ───────────────────────────────────────────────────────────────
export function useCreateShop() {
  const { refreshShop } = useAuth();

  return useMutation({
    mutationFn: async (payload: {
      name: string;
      address?: string;
      email?: string;
      phone?: string;
      category?: string;
    }) => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (userError || !data.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('shops').insert({
        owner_id: data.user.id,
        name: payload.name.trim(),
        address: payload.address?.trim() || null,
        email: payload.address?.trim() || null,
        phone: payload.phone?.trim() || null,
        categoy: payload.category,
      });

      if (error) throw error;
    },

    onSuccess: async () => {
      toast.success('Shop created ');
      await refreshShop();
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to create shop');
    },
  });
}

// ── Forgot Password ───────────────────────────────────────────────────────────
export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      forgotPassword(email);
    },

    onSuccess: () => {
      toast.success('Reset link sent — check your email');
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to send reset link');
    },
  });
}

// ── Reset Password (after clicking email link) ────────────────────────────────
export function useResetPassword() {
  return useMutation({
    mutationFn: async (newPassword: string) => {
      resetPassword(newPassword);
    },

    onSuccess: () => {
      toast.success('Password updated — please log in');
      router.replace('/(auth)/login');
    },

    onError: (error: any) => {
      toast.error(error?.message ?? 'Failed to update password');
    },
  });
}
