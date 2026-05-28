import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useLogin } from '@/hooks/useAuth'; // ✅ hook
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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
  password: yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
});

export default function LoginScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();

  const loginMutation = useLogin(); // ✅ hook

  function onSubmit(data: { email: string; password: string }) {
    loginMutation.mutate(
      {
        email: data.email.trim(),
        password: data.password,
      },
      {
        onSuccess: () => {
          // 👇 optional redirect (depends on your auth guard)
          router.replace('/(tabs)');
        },
      },
    );
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView>
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[styles.logoCircle, { backgroundColor: colors.primary }]}
            >
              <ThemedText style={styles.logoText}>SP</ThemedText>
            </View>

            <ThemedText style={[styles.title, { color: colors.text }]}>
              Welcome back
            </ThemedText>

            <ThemedText style={[styles.sub, { color: colors.text3 }]}>
              Log in to your StorePadi account
            </ThemedText>
          </View>

          {/* Form */}
          <FormProvider
            schema={schema}
            defaultValues={{ email: '', password: '' }}
            onSubmit={onSubmit}
            submitTitle='Log In'
            validateOnChange
            loading={loginMutation.isPending} // ✅ correct loading
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

            <FormTextField
              name='password'
              label='Password'
              placeholder='Enter your password'
              leftIcon='lock-closed-outline'
              secureTextEntry
            />

            {/* Forgot password */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/forgot-password')}
              style={styles.forgotWrap}
            >
              <ThemedText style={[styles.forgot, { color: colors.primary }]}>
                Forgot password?
              </ThemedText>
            </TouchableOpacity>
          </FormProvider>

          {/* Register link */}
          <View style={styles.registerWrap}>
            <ThemedText style={[styles.registerText, { color: colors.text3 }]}>
              Don&apos;t have an account?{' '}
            </ThemedText>

            <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
              <ThemedText
                style={[styles.registerLink, { color: colors.primary }]}
              >
                Sign up
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },

  back: {
    padding: 4,
    marginLeft: 16,
  },

  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 32,
    gap: 8,
  },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  logoText: { fontSize: 20, fontWeight: '700', color: '#FFF' },

  title: { fontSize: 24, lineHeight: 26, fontWeight: '700' },

  sub: { fontSize: 14 },

  form: {
    paddingHorizontal: 24,
    gap: 16,
  },

  forgotWrap: {
    alignSelf: 'flex-end',
    marginTop: -4,
  },

  forgot: {
    fontSize: 13,
    fontWeight: '500',
  },

  registerWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 24,
  },

  registerText: { fontSize: 14 },

  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});
