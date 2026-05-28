import BarcodeField from '@/components/form/fields/BarCodeField';
import FormChipSelect from '@/components/form/fields/FormChipSelect';
import FormNumberField from '@/components/form/fields/FormNumberField';
import FormSelectField from '@/components/form/fields/FormSelectField';
import FormTextField from '@/components/form/fields/FormTextField';
import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/product';
import { StyleSheet, View } from 'react-native';
import ProfitPreview from './ProfitPreview';
import SectionHeading from './SectionHeading';

export default function AddProductForm() {
  return (
    <View style={styles.container}>
      {/* ── Basic info ─────────────────────────────────────────────────── */}
      <SectionHeading title='Basic Information' />

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

      <BarcodeField />

      {/* ── Unit ───────────────────────────────────────────────────────── */}
      <SectionHeading title='Unit Type' />

      <FormChipSelect
        name='unit'
        label='How do you sell this product?'
        options={UNIT_OPTIONS}
      />

      {/* ── Pricing ────────────────────────────────────────────────────── */}
      <SectionHeading title='Pricing' />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <FormNumberField
            name='costPrice'
            label='Cost Price'
            placeholder='0.00'
            prefix='₦'
            leftIcon='cash-outline'
            hint='What you pay the supplier'
          />
        </View>
        <View style={{ flex: 1 }}>
          <FormNumberField
            name='sellingPrice'
            label='Selling Price'
            placeholder='0.00'
            prefix='₦'
            leftIcon='pricetag-outline'
            hint='What you charge customers'
          />
        </View>
      </View>

      {/* Live profit preview */}
      <ProfitPreview />

      {/* ── Stock ──────────────────────────────────────────────────────── */}
      <SectionHeading title='Stock' />

      <View style={styles.row2}>
        <View style={{ flex: 1 }}>
          <FormNumberField
            name='stock'
            label='Current Stock'
            placeholder='0'
            suffix='units'
            showStepper
            hint='Units you have right now'
          />
        </View>
        <View style={{ flex: 1 }}>
          <FormNumberField
            name='minStockAlert'
            label='Min Stock Alert'
            placeholder='5'
            suffix='units'
            showStepper
            hint='Alert when stock falls below this'
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginBottom: 16,
  },
  row2: {
    flexDirection: 'row',
    gap: 12,
  },
});
