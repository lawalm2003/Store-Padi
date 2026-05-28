import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useRegister } from '@/hooks/useAuth'; // ✅ use your hook
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
  full_name: yup.string().trim().required('Full name is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Minimum 6 characters')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

export default function RegisterScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();

  const { mutate, isPending } = useRegister(); // ✅ hook

  async function onSubmit(data: {
    full_name: string;
    email: string;
    password: string;
    confirm_password: string;
  }) {
    mutate(
      {
        email: data.email.trim(),
        password: data.password,
        full_name: data.full_name,
      },
      {
        onSuccess: () => {
          // navigation after success
          router.replace('/setup');
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
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          {/* Header */}
          <View style={styles.header}>
            <View
              style={[styles.logoCircle, { backgroundColor: colors.primary }]}
            >
              <ThemedText style={styles.logoText}>SP</ThemedText>
            </View>

            <ThemedText style={[styles.title, { color: colors.text }]}>
              Create account
            </ThemedText>

            <ThemedText style={[styles.sub, { color: colors.text3 }]}>
              Join thousands of Nigerian shop owners
            </ThemedText>
          </View>

          {/* Form */}
          <FormProvider
            schema={schema}
            defaultValues={{
              full_name: '',
              email: '',
              password: '',
              confirm_password: '',
            }}
            onSubmit={onSubmit}
            submitTitle='Create Account'
            validateOnChange
            loading={isPending} // ✅ hook state
            style={styles.form}
          >
            <FormTextField
              name='full_name'
              label='Full Name'
              placeholder='Lawal Musa'
              leftIcon='person-outline'
              autoCapitalize='words'
            />

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
              placeholder='At least 6 characters'
              leftIcon='lock-closed-outline'
              secureTextEntry
            />

            <FormTextField
              name='confirm_password'
              label='Confirm Password'
              placeholder='Repeat your password'
              leftIcon='lock-closed-outline'
              secureTextEntry
            />
          </FormProvider>

          {/* Login link */}
          <View style={styles.loginWrap}>
            <ThemedText style={[styles.loginText, { color: colors.text3 }]}>
              Already have an account?{' '}
            </ThemedText>

            <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
              <ThemedText style={[styles.loginLink, { color: colors.primary }]}>
                Log in
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Terms */}
          <ThemedText style={[styles.terms, { color: colors.text3 }]}>
            By creating an account you agree to our Terms of Service and Privacy
            Policy.
          </ThemedText>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  back: { padding: 4, marginLeft: 16 },
  scroll: { paddingBottom: 48 },

  header: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 28,
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

  form: { paddingHorizontal: 24, gap: 16 },

  loginWrap: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 8,
  },

  loginText: { fontSize: 14 },

  loginLink: { fontSize: 14, fontWeight: '600' },

  terms: {
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 16,
  },
});
