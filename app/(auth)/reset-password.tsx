import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useResetPassword } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as yup from 'yup';

const schema = yup.object({
  password: yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

export default function ResetPasswordScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const [resetSuccess, setResetSuccess] = useState(false);

  const { mutate, isPending } = useResetPassword();

  function onSubmit(data: { password: string; confirmPassword: string }) {
    mutate(data.password, {
      onSuccess: () => setResetSuccess(true),
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
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.back}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name='arrow-back' size={22} color={colors.text} />
      </TouchableOpacity>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* ── Success state ────────────────────────────────────────────────── */}
        {resetSuccess ? (
          <View style={styles.successWrap}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: colors.green_soft },
              ]}
            >
              <Ionicons name='checkmark-circle-outline' size={40} color={colors.success} />
            </View>
            <ThemedText style={[styles.title, { color: colors.text }]}>
              Password reset!
            </ThemedText>
            <ThemedText style={[styles.sub, { color: colors.text3 }]}>
              Your password has been successfully updated. You can now log in
              with your new password.
            </ThemedText>
            <TouchableOpacity
              onPress={() => router.replace('/(auth)/login')}
              style={[
                styles.loginBtn,
                { backgroundColor: colors.primary },
              ]}
            >
              <ThemedText style={styles.loginBtnText}>
                Back to Login
              </ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Form state ────────────────────────────────────────────────── */
          <>
            <View style={styles.header}>
              <View
                style={[
                  styles.iconCircle,
                  { backgroundColor: colors.blue_soft },
                ]}
              >
                <Ionicons
                  name='lock-closed-outline'
                  size={40}
                  color={colors.primary}
                />
              </View>
              <ThemedText style={[styles.title, { color: colors.text }]}>
                Create new password
              </ThemedText>
              <ThemedText style={[styles.sub, { color: colors.text3 }]}>
                Enter a new password for your account. Make sure it&apos;s
                secure and easy to remember.
              </ThemedText>
            </View>

            <FormProvider
              schema={schema}
              defaultValues={{ password: '', confirmPassword: '' }}
              onSubmit={onSubmit}
              submitTitle='Update Password'
              validateOnChange
              loading={isPending}
              style={styles.form}
            >
              <FormTextField
                name='password'
                label='New Password'
                placeholder='Enter new password'
                leftIcon='lock-closed-outline'
                secureTextEntry
              />
              <FormTextField
                name='confirmPassword'
                label='Confirm Password'
                placeholder='Confirm new password'
                leftIcon='lock-closed-outline'
                secureTextEntry
              />
            </FormProvider>
          </>
        )}
      </KeyboardAvoidingView>
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
  successWrap: {
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
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  sub: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
  },
  form: { paddingHorizontal: 24 },
  loginBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
