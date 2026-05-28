import FormChipSelect from '@/components/form/fields/FormChipSelect';
import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import ScreenHeader from '@/components/profile/ScreenHeader';
import { ThemedView } from '@/components/ThemedView';
import { CATEGORY_OPTIONS } from '@/constants/product';
import useAppTheme from '@/hooks/useAppTheme';
import { useUpdateShop } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { useRouter } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import * as yup from 'yup';

const schema = yup.object({
  name: yup.string().trim().required('Shop name is required'),
  category: yup.string().trim().required('Shop category is required'),
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
});

export default function ShopInfoScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const { shop, refreshShop } = useAuth();

  const { mutate, isPending } = useUpdateShop(shop?.id || '');

  async function onSubmit(data: any) {
    // TODO: dispatch to store / API
    mutate(data, {
      onSuccess: () => {
        refreshShop();
        router.back();
      },
    });
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title='Shop Info' />
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
              name: shop?.name,
              category: shop?.category,
              email: shop?.email,
              phone: shop?.phone ?? '',
              address: shop?.address ?? '',
            }}
            onSubmit={onSubmit}
            submitTitle='Save Changes'
            validateOnChange
            loading={isPending}
            style={styles.form}
          >
            <FormTextField
              name='name'
              label='Shop Name'
              placeholder="e.g. Lawal's Shop"
              leftIcon='storefront-outline'
              autoCapitalize='words'
            />

            <FormChipSelect
              name='category'
              label='Type of Shop'
              options={CATEGORY_OPTIONS}
            />

            <FormTextField
              name='phone'
              label='Phone Number'
              placeholder='+234 800 000 0000'
              leftIcon='call-outline'
              keyboardType='phone-pad'
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
              name='address'
              label='Shop Address'
              placeholder='Street, City, State'
              leftIcon='location-outline'
              autoCapitalize='sentences'
              multiline
              numberOfLines={6}
            />
          </FormProvider>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { paddingBottom: 40 },
  form: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },
});
