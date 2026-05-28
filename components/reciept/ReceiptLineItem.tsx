// ── ReceiptLineItem.tsx ───────────────────────────────────────────────────────
// One product row in the items table, including the per-item profit badge.

import useAppTheme from '@/hooks/useAppTheme';
import { SaleItem } from '@/types';
import { formatMoney } from '@/utils/receiptUtils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  item: SaleItem;
  dividerColor: string;
  showDivider: boolean;
};

export default function ReceiptLineItem({
  item,
  dividerColor,
  showDivider,
}: Props) {
  const { colors } = useAppTheme();
  const metaColor = colors.text3;

  return (
    <View>
      {/* ── Product row ──────────────────────────────────────────────────────── */}
      <View style={styles.tableRow}>
        {/* Name + cost price */}
        <View style={styles.colItem}>
          <ThemedText
            style={[styles.itemName, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.productName}
          </ThemedText>
          <ThemedText style={[styles.itemCost, { color: metaColor }]}>
            Cost: {formatMoney(item.costPriceAtSale)}
          </ThemedText>
        </View>

        <ThemedText
          style={[styles.colQty, styles.cellText, { color: colors.text }]}
        >
          ×{item.quantity}
        </ThemedText>
        <ThemedText
          style={[styles.colPrice, styles.cellText, { color: colors.text }]}
        >
          {formatMoney(item.sellingPriceAtSale)}
        </ThemedText>
        <ThemedText
          style={[
            styles.colTotal,
            styles.cellText,
            { color: colors.text, fontWeight: '600' },
          ]}
        >
          {formatMoney(item.subtotal)}
        </ThemedText>
      </View>

      {/* ── Profit badge ─────────────────────────────────────────────────────── */}
      <View style={styles.profitBadgeRow}>
        <View
          style={[styles.profitBadge, { backgroundColor: colors.green_soft }]}
        >
          <ThemedText
            style={[styles.profitBadgeText, { color: colors.success }]}
          >
            Profit: +{formatMoney(item.profit)}
          </ThemedText>
        </View>
      </View>

      {/* ── Row divider ──────────────────────────────────────────────────────── */}
      {showDivider && (
        <View style={[styles.itemDivider, { backgroundColor: dividerColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 4,
    alignItems: 'flex-start',
  },
  colItem: {
    flex: 1,
  },
  colQty: {
    width: 36,
    textAlign: 'center',
  },
  colPrice: {
    width: 72,
    textAlign: 'right',
  },
  colTotal: {
    width: 72,
    textAlign: 'right',
  },
  cellText: {
    fontSize: 13,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  itemCost: {
    fontSize: 11,
    marginTop: 2,
  },
  profitBadgeRow: {
    paddingHorizontal: 20,
    paddingTop: 6,
    paddingBottom: 10,
  },
  profitBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  profitBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  itemDivider: {
    height: 0.5,
    marginHorizontal: 20,
    opacity: 0.6,
  },
});
