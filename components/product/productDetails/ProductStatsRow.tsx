import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { ProductWithStatus } from '@/types';
import { StyleSheet, View } from 'react-native';

type Props = { product: ProductWithStatus };

export function ProductStatsRow({ product }: Props) {
  const { colors } = useAppTheme();

  const stockPct = Math.min(
    product.stock / Math.max(product.minStockAlert, 1),
    1,
  );
  const barColor =
    product.stockStatus === 'out_of_stock'
      ? colors.error
      : product.stockStatus === 'low_stock'
        ? colors.warning
        : colors.success;

  const stats = [
    {
      label: 'In Stock',
      value: `${product.stock} units`,
      sub: `Min: ${product.minStockAlert}`,
      color: barColor,
    },
    {
      label: 'Profit / Unit',
      value: `₦${product.profitPerUnit.toLocaleString()}`,
      sub: `${product.marginPercent.toFixed(1)}% margin`,
      color: colors.success,
    },
    {
      label: 'Stock Value',
      value: `₦${(product.stock * product.costPrice).toLocaleString()}`,
      sub: 'at cost price',
      color: colors.primary,
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Stock level bar */}
      <View style={styles.barSection}>
        <View style={styles.barLabelRow}>
          <ThemedText style={[styles.barLabel, { color: colors.text3 }]}>
            Stock level
          </ThemedText>
          <ThemedText
            style={[styles.barLabel, { color: barColor, fontWeight: '600' }]}
          >
            {Math.round(stockPct * 100)}%
          </ThemedText>
        </View>
        <View style={[styles.barTrack, { backgroundColor: colors.surface2 }]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${Math.max(stockPct * 100, 2)}%`,
                backgroundColor: barColor,
              },
            ]}
          />
        </View>
        <ThemedText style={[styles.barSub, { color: colors.text3 }]}>
          {product.stock} of {product.minStockAlert} minimum
        </ThemedText>
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        {stats.map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.statItem,
              i < stats.length - 1 && {
                borderRightWidth: 1,
                borderRightColor: colors.border,
              },
            ]}
          >
            <ThemedText style={[styles.statValue, { color: s.color }]}>
              {s.value}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.text3 }]}>
              {s.label}
            </ThemedText>
            <ThemedText style={[styles.statSub, { color: colors.text3 }]}>
              {s.sub}
            </ThemedText>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  barSection: {
    gap: 6,
  },
  barLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    fontSize: 12,
  },
  barTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  barSub: {
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  statSub: {
    fontSize: 10,
  },
});
