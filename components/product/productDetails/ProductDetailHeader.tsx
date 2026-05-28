import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { ProductWithStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

const STATUS_CONFIG = {
  in_stock: { label: 'In Stock', colorKey: 'success', bgKey: 'green_soft' },
  low_stock: { label: 'Low Stock', colorKey: 'warning', bgKey: 'amber_soft' },
  out_of_stock: { label: 'Out of Stock', colorKey: 'error', bgKey: 'red_soft' },
} as const;

type Props = { product: ProductWithStatus };

export function ProductDetailHeader({ product }: Props) {
  const { colors } = useAppTheme();
  const status = STATUS_CONFIG[product.stockStatus];

  return (
    <View style={styles.container}>
      {/* Product image placeholder */}
      <View
        style={[styles.imagePlaceholder, { backgroundColor: colors.surface2 }]}
      >
        <Ionicons name='cube-outline' size={52} color={colors.text3} />
      </View>

      {/* Category chip */}
      <View
        style={[styles.categoryChip, { backgroundColor: colors.blue_soft }]}
      >
        <ThemedText style={[styles.categoryText, { color: colors.primary }]}>
          {product.category}
        </ThemedText>
      </View>

      {/* Product name */}
      <ThemedText style={[styles.name, { color: colors.text }]}>
        {product.name}
      </ThemedText>

      {/* Unit + barcode row */}
      <View style={styles.metaRow}>
        <View style={[styles.unitChip, { backgroundColor: colors.surface2 }]}>
          <Ionicons name='pricetag-outline' size={11} color={colors.text3} />
          <ThemedText style={[styles.metaText, { color: colors.text3 }]}>
            {' '}
            {product.unit}
          </ThemedText>
        </View>
        {product.barcode ? (
          <View style={[styles.unitChip, { backgroundColor: colors.surface2 }]}>
            <Ionicons name='barcode-outline' size={11} color={colors.text3} />
            <ThemedText style={[styles.metaText, { color: colors.text3 }]}>
              {' '}
              {product.barcode}
            </ThemedText>
          </View>
        ) : null}
      </View>

      {/* Status badge */}
      <View
        style={[styles.statusBadge, { backgroundColor: colors[status.bgKey] }]}
      >
        <View
          style={[
            styles.statusDot,
            { backgroundColor: colors[status.colorKey] },
          ]}
        />
        <ThemedText
          style={[styles.statusText, { color: colors[status.colorKey] }]}
        >
          {status.label}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 10,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  categoryChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 28,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 8,
  },
  unitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  metaText: {
    fontSize: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
