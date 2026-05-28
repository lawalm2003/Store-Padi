import ContentLoading from '@/components/ContentLoading';
import FormChipSelect from '@/components/form/fields/FormChipSelect';
import FormNumberField from '@/components/form/fields/FormNumberField';
import FormSelectField from '@/components/form/fields/FormSelectField';
import FormTextField from '@/components/form/fields/FormTextField';
import FormProvider from '@/components/form/FormProvider';
import ScreenHeader from '@/components/profile/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/product';
import useAppTheme from '@/hooks/useAppTheme';
import { useProduct, useUpdateProduct } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { editProductschema } from '@/validators/addProduct.schema';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function EditProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useAppTheme();
  const { shop } = useAuth();
  const router = useRouter();

  const { data: product, isLoading } = useProduct(id);
  const updateProduct = useUpdateProduct(shop?.id ?? '');

  // ── Loading state ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <ThemedView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <ScreenHeader title='Edit Product' />
        <View style={styles.loadingWrap}>
          <ContentLoading />
        </View>
      </ThemedView>
    );
  }

  // ── Product not found ─────────────────────────────────────────────────────
  if (!product) {
    return (
      <ThemedView
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <ScreenHeader title='Edit Product' />
        <View style={styles.loadingWrap}>
          <Ionicons
            name='alert-circle-outline'
            size={40}
            color={colors.text3}
          />
          <ThemedText style={[styles.notFound, { color: colors.text3 }]}>
            Product not found
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  async function onSubmit(data: any) {
    updateProduct.mutate(
      {
        id: product!.id,
        payload: {
          name: data.name.trim(),
          category: data.category,
          unit: data.unit,
          barcode: data.barcode?.trim() || null,
          cost_price: Number(data.cost_price),
          selling_price: Number(data.selling_price),
          min_stock_alert: Number(data.min_stock_alert),
        },
      },
      {
        onSuccess: () => router.back(),
      },
    );
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title='Edit Product' />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        {/* ── Note: stock is not editable here — use Restock button ──────── */}
        <View
          style={[styles.infoCard, { backgroundColor: colors.alert_info_bg }]}
        >
          <Ionicons
            name='information-circle-outline'
            size={16}
            color={colors.primary}
          />
          <ThemedText style={[styles.infoText, { color: colors.text3 }]}>
            To update stock quantity, use the Restock button on the product
            page.
          </ThemedText>
        </View>

        <FormProvider
          schema={editProductschema}
          defaultValues={{
            name: product.name,
            category: product.category,
            unit: product.unit,
            barcode: product.barcode ?? '',
            cost_price: product.costPrice,
            selling_price: product.sellingPrice,
            min_stock_alert: product.minStockAlert,
          }}
          onSubmit={onSubmit}
          submitTitle='Save Changes'
          validateOnChange
          loading={updateProduct.isPending}
          style={styles.form}
        >
          {/* ── Basic info ─────────────────────────────────────────────── */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Basic Information
            </ThemedText>
          </View>

          <FormTextField
            name='name'
            label='Product Name'
            placeholder='e.g. Indomie Noodles Family Size'
            leftIcon='cube-outline'
            autoCapitalize='words'
          />

          <FormSelectField
            name='category'
            label='Category'
            placeholder='Select a category'
            options={CATEGORY_OPTIONS}
            leftIcon='grid-outline'
          />

          <FormTextField
            name='barcode'
            label='Barcode'
            placeholder='Scan or type barcode'
            leftIcon='barcode-outline'
            keyboardType='number-pad'
            autoCapitalize='none'
            hint='Optional'
          />

          {/* ── Unit ───────────────────────────────────────────────────── */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Unit Type
            </ThemedText>
          </View>

          <FormChipSelect
            name='unit'
            label='How do you sell this product?'
            options={UNIT_OPTIONS}
          />

          {/* ── Pricing ────────────────────────────────────────────────── */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Pricing
            </ThemedText>
          </View>

          <View style={styles.row2}>
            <View style={{ flex: 1 }}>
              <FormNumberField
                name='cost_price'
                label='Cost Price'
                placeholder='0.00'
                prefix='₦'
                hint='What you pay supplier'
              />
            </View>
            <View style={{ flex: 1 }}>
              <FormNumberField
                name='selling_price'
                label='Selling Price'
                placeholder='0.00'
                prefix='₦'
                hint='What you charge customers'
              />
            </View>
          </View>

          {/* ── Stock alert ────────────────────────────────────────────── */}
          <View style={[styles.section, { borderLeftColor: colors.primary }]}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Stock Alert
            </ThemedText>
          </View>

          <FormNumberField
            name='min_stock_alert'
            label='Minimum Stock Alert'
            placeholder='5'
            suffix='units'
            showStepper
            hint='Get alerted when stock falls below this number'
          />
        </FormProvider>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  notFound: { fontSize: 15 },
  scroll: { paddingBottom: 40 },
  form: { paddingHorizontal: 20, paddingTop: 16, gap: 16 },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  infoText: { flex: 1, fontSize: 13, lineHeight: 19 },
  section: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700' },
  row2: { flexDirection: 'row', gap: 12 },
});
