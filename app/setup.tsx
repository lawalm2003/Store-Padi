import FormChipSelect from '@/components/form/fields/FormChipSelect';
import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useCreateShop } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import * as yup from 'yup';

const CATEGORY_OPTIONS = [
  { label: 'Grocery', value: 'grocery' },
  { label: 'Pharmacy', value: 'pharmacy' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Clothing', value: 'clothing' },
  { label: 'Restaurant', value: 'restaurant' },
  { label: 'General', value: 'general' },
];

const schema = yup.object({
  name: yup.string().trim().required('Shop name is required'),
  address: yup.string().optional(),
  phone: yup.string().optional(),
  email: yup.string().email().optional(),
  category: yup.string().required('Select a shop category'),
});

// Step indicator
function Step({
  n,
  label,
  active,
  done,
}: {
  n: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={stepStyles.wrap}>
      <View
        style={[
          stepStyles.circle,
          {
            backgroundColor: done || active ? colors.primary : colors.surface2,
            borderColor: done || active ? colors.primary : colors.border,
          },
        ]}
      >
        {done ? (
          <Ionicons name='checkmark' size={14} color='#FFF' />
        ) : (
          <ThemedText
            style={[
              stepStyles.n,
              { color: done || active ? '#FFF' : colors.text3 },
            ]}
          >
            {n}
          </ThemedText>
        )}
      </View>
      <ThemedText
        style={[
          stepStyles.label,
          { color: active ? colors.text : colors.text3 },
        ]}
      >
        {label}
      </ThemedText>
    </View>
  );
}
const stepStyles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 4 },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  n: { fontSize: 13, fontWeight: '700' },
  label: { fontSize: 11, fontWeight: '500' },
});

export default function SetupScreen() {
  const { colors, dark } = useAppTheme();
  const { mutate, isPending } = useCreateShop();

  async function onSubmit(data: {
    name: string;
    address?: string;
    phone?: string;
    category: string;
  }) {
    mutate(data);
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
          <ThemedText style={styles.logoText}>SP</ThemedText>
        </View>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Set up your shop
        </ThemedText>
        <ThemedText style={[styles.sub, { color: colors.text3 }]}>
          Tell us about your business to get started
        </ThemedText>

        {/* Step indicators */}
        <View style={styles.steps}>
          <Step n={1} label='Account' active={false} done={true} />
          <View
            style={[styles.stepLine, { backgroundColor: colors.primary }]}
          />
          <Step n={2} label='Shop' active={true} done={false} />
          <View style={[styles.stepLine, { backgroundColor: colors.border }]} />
          <Step n={3} label='Done' active={false} done={false} />
        </View>
      </View>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <FormProvider
            schema={schema}
            defaultValues={{
              name: '',
              address: '',
              phone: '',
              category: '',
              email: '',
            }}
            onSubmit={onSubmit}
            submitTitle='Create Shop'
            validateOnChange
            loading={isPending}
            style={styles.form}
          >
            <FormTextField
              name='name'
              label='Shop Name'
              placeholder='e.g. My Store'
              leftIcon='storefront-outline'
              autoCapitalize='words'
            />
            <FormTextField
              name='address'
              label='Shop Address'
              placeholder='Street, City, State (optional)'
              leftIcon='location-outline'
              autoCapitalize='sentences'
            />
            <FormTextField
              name='email'
              label='Email'
              placeholder='mystore@domain.com (optional)'
              leftIcon='mail-outline'
              keyboardType='phone-pad'
            />
            <FormTextField
              name='phone'
              label='Phone Number'
              placeholder='+234 800 000 0000 (optional)'
              leftIcon='call-outline'
              keyboardType='phone-pad'
            />
            <FormChipSelect
              name='category'
              label='Type of Shop'
              options={CATEGORY_OPTIONS}
            />

            {/* Demo data notice */}
            <View
              style={[
                styles.demoCard,
                { backgroundColor: colors.alert_info_bg },
              ]}
            >
              <Ionicons
                name='sparkles-outline'
                size={16}
                color={colors.primary}
              />
              <ThemedText style={[styles.demoText, { color: colors.text3 }]}>
                We&apos;ll add sample products and sales so you can explore
                StorePadi right away.
              </ThemedText>
            </View>
          </FormProvider>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 24,
    gap: 6,
    borderBottomWidth: 0.5,
  },
  logoCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  logoText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  title: { fontSize: 22, lineHeight: 24, fontWeight: '700' },
  sub: { fontSize: 13 },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
  },
  stepLine: { flex: 1, height: 2, borderRadius: 1 },
  scroll: { paddingBottom: 48 },
  form: { paddingHorizontal: 24, paddingTop: 24, gap: 18 },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  demoText: { flex: 1, fontSize: 13, lineHeight: 19 },
});
