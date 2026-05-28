import FormProvider from '@/components/form/FormProvider';
import AddProductForm from '@/components/product/addProduct/AddProductForm';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useCreateProduct } from '@/hooks/useData';
import { mapProductToDb } from '@/mapper/product.mapper';
import { useAuth } from '@/Providers/AuthContext';
import { useCart } from '@/Providers/CartProvider';
import { addProductSchema } from '@/validators/addProduct.schema';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AddProductScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { barcodeScanData, clearBarcodeScanData } = useCart();

  const { shop } = useAuth();
  const { mutate, isPending } = useCreateProduct(shop?.id || '');

  // Clear scan data when leaving the screen so stale data
  // doesn't pre-fill the form on the next unrelated visit
  useEffect(() => {
    return () => {
      clearBarcodeScanData();
    };
  }, []);

  // ── Default values — prefer context data, fall back to empty ───────────────
  const defaultValues = {
    name: barcodeScanData?.name ?? '',
    category: barcodeScanData?.category ?? '',
    unit: 'piece',
    barcode: barcodeScanData?.barcode ?? '',
    costPrice: '',
    sellingPrice: '',
    stock: 0,
    minStockAlert: 5,
  };

  async function handleSubmit(data: any) {
    if (!shop?.id) return;
    const mappedData = mapProductToDb(data, shop.id);
    mutate(mappedData, { onSuccess: () => router.back() });
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name='arrow-back' size={22} color={colors.text} />
        </TouchableOpacity>
        <ThemedText style={styles.topTitle}>Add Product</ThemedText>
        {/* Placeholder to balance the back button */}
        <View style={{ width: 22 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingBottom: inset.bottom + 16 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <FormProvider
            schema={addProductSchema}
            defaultValues={defaultValues}
            onSubmit={handleSubmit}
            submitTitle='Save Product'
            validateOnChange
            loading={isPending}
            style={{ flex: 1 }}
          >
            <AddProductForm />
          </FormProvider>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
  },

  scroll: {
    paddingTop: 20,
    // paddingBottom: 32,
    paddingHorizontal: 16,
    gap: 16,
  },
});
