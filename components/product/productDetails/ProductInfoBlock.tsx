import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { ProductWithStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';

type InfoRow = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  valueColor?: string;
};

type Props = { product: ProductWithStatus };

export function ProductInfoBlock({ product }: Props) {
  const { colors } = useAppTheme();

  const rows: InfoRow[] = [
    {
      icon: 'cash-outline',
      label: 'Cost Price',
      value: `₦${product.costPrice.toLocaleString()}`,
    },
    {
      icon: 'pricetags-outline',
      label: 'Selling Price',
      value: `₦${product.sellingPrice.toLocaleString()}`,
      valueColor: colors.primary,
    },
    {
      icon: 'trending-up-outline',
      label: 'Profit per Unit',
      value: `₦${product.profitPerUnit.toLocaleString()} (${product.marginPercent.toFixed(1)}%)`,
      valueColor: colors.success,
    },
    {
      icon: 'grid-outline',
      label: 'Category',
      value: product.category,
    },
    {
      icon: 'cube-outline',
      label: 'Unit Type',
      value: product.unit.charAt(0).toUpperCase() + product.unit.slice(1),
    },
    {
      icon: 'alert-circle-outline',
      label: 'Min Stock Alert',
      value: `${product.minStockAlert} units`,
    },
    ...(product.barcode
      ? [
          {
            icon: 'barcode-outline' as keyof typeof Ionicons.glyphMap,
            label: 'Barcode',
            value: product.barcode,
          },
        ]
      : []),
    {
      icon: 'calendar-outline',
      label: 'Added',
      value: new Date(product.createdAt).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
    {
      icon: 'time-outline',
      label: 'Last Updated',
      value: new Date(product.updatedAt).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <ThemedText style={[styles.heading, { color: colors.text }]}>
        Product Details
      </ThemedText>

      {rows.map((row, i) => (
        <View key={row.label}>
          <View style={styles.row}>
            <View
              style={[styles.iconWrap, { backgroundColor: colors.surface2 }]}
            >
              <Ionicons name={row.icon} size={15} color={colors.text3} />
            </View>
            <ThemedText style={[styles.label, { color: colors.text3 }]}>
              {row.label}
            </ThemedText>
            <ThemedText
              style={[styles.value, { color: row.valueColor ?? colors.text }]}
              numberOfLines={1}
            >
              {row.value}
            </ThemedText>
          </View>
          {i < rows.length - 1 && (
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
  },
  heading: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'right',
    flexShrink: 1,
  },
  divider: {
    height: 0.5,
    marginLeft: 38,
    opacity: 0.6,
  },
});
