import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useForgotPassword } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';

const schema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
});

export default function ForgotPasswordScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [sent, setSent] = useState(false);

  const { mutate, isPending } = useForgotPassword();

  function onSubmit(data: { email: string }) {
    mutate(data.email.trim(), {
      onSuccess: () => setSent(true),
    });
  }

  return (
    <ThemedView
      style={[
        styles.screen,
        { backgroundColor: colors.background, paddingTop: inset.top + 16 },
      ]}
    >
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Back */}
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name='arrow-back' size={22} color={colors.text} />
      </TouchableOpacity>

      {/* ── Sent state ────────────────────────────────────────────────── */}
      {sent ? (
        <View style={styles.sentWrap}>
          <View
            style={[styles.iconCircle, { backgroundColor: colors.green_soft }]}
          >
            <Ionicons name='mail-outline' size={40} color={colors.success} />
          </View>
          <ThemedText style={[styles.title, { color: colors.text }]}>
            Check your email
          </ThemedText>
          <ThemedText style={[styles.sub, { color: colors.text3 }]}>
            We&apos;ve sent a password reset link to your email address. Tap the
            link to set a new password.
          </ThemedText>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={[styles.backToLoginBtn, { backgroundColor: colors.primary }]}
          >
            <ThemedText style={styles.backToLoginText}>
              Back to Login
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSent(false)}>
            <ThemedText style={[styles.resend, { color: colors.text3 }]}>
              Didn&apos;t receive it?{' '}
              <ThemedText style={{ color: colors.primary, fontWeight: '600' }}>
                Resend
              </ThemedText>
            </ThemedText>
          </TouchableOpacity>
        </View>
      ) : (
        /* ── Form state ────────────────────────────────────────────────── */
        <>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <ScrollView>
              <View style={styles.header}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: colors.blue_soft },
                  ]}
                >
                  <Ionicons
                    name='lock-open-outline'
                    size={40}
                    color={colors.primary}
                  />
                </View>
                <ThemedText style={[styles.title, { color: colors.text }]}>
                  Forgot password?
                </ThemedText>
                <ThemedText style={[styles.sub, { color: colors.text3 }]}>
                  Enter the email linked to your account and we&apos;ll send you
                  a reset link.
                </ThemedText>
              </View>

              <FormProvider
                schema={schema}
                defaultValues={{ email: '' }}
                onSubmit={onSubmit}
                submitTitle='Send Reset Link'
                validateOnChange
                loading={isPending}
                style={styles.form}
              >
                <FormTextField
                  name='email'
                  label='Email Address'
                  placeholder='you@example.com'
                  leftIcon='mail-outline'
                  keyboardType='email-address'
                  autoCapitalize='none'
                />
              </FormProvider>

              <TouchableOpacity
                onPress={() => router.back()}
                style={styles.loginWrap}
              >
                <ThemedText style={[styles.loginText, { color: colors.text3 }]}>
                  Remember your password?{' '}
                  <ThemedText
                    style={{ color: colors.primary, fontWeight: '600' }}
                  >
                    Log in
                  </ThemedText>
                </ThemedText>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  back: { padding: 4, marginLeft: 16, marginBottom: 8 },
  header: {
    alignItems: 'center',
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 32,
    gap: 12,
  },
  sentWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 16,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: '700',
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  form: { paddingHorizontal: 24 },
  loginWrap: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  loginText: { fontSize: 14, textAlign: 'center' },
  backToLoginBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  backToLoginText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
  resend: { fontSize: 14, textAlign: 'center' },
});
