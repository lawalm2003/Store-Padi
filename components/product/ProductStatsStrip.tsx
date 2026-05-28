import useAppTheme from '@/hooks/useAppTheme';
import { Product } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  products: Product[];
};

export default function ProductStatsStrip({ products }: Props) {
  const { colors } = useAppTheme();

  const total = products.length;
  const lowStock = products.filter(
    (p) => p.stock > 0 && p.stock <= p.minStockAlert,
  ).length;
  const outStock = products.filter((p) => p.stock === 0).length;
  const inStock = total - lowStock - outStock;

  const stats = [
    { label: 'In Stock', value: inStock, color: colors.success },
    { label: 'Low Stock', value: lowStock, color: colors.warning },
    { label: 'Out', value: outStock, color: colors.error },
    { label: 'Total', value: total, color: colors.text },
  ];

  return (
    <View style={[styles.strip, { backgroundColor: colors.surface }]}>
      {stats.map((s, i) => (
        <React.Fragment key={s.label}>
          <View style={styles.stat}>
            <ThemedText style={[styles.statValue, { color: s.color }]}>
              {s.value}
            </ThemedText>
            <ThemedText style={[styles.statLabel, { color: colors.text3 }]}>
              {s.label}
            </ThemedText>
          </View>
          {i < stats.length - 1 && (
            <View
              style={[styles.divider, { backgroundColor: colors.border }]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  strip: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 14,
    paddingVertical: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 11,
  },
  divider: {
    width: 1,
    marginVertical: 4,
  },
});
