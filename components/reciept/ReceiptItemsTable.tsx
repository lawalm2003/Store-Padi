// ── ReceiptItemsTable.tsx ─────────────────────────────────────────────────────
// Column headers row + all sale line items.

import useAppTheme from '@/hooks/useAppTheme';
import { SaleItem } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import ReceiptLineItem from './ReceiptLineItem';

type Props = {
  items: SaleItem[];
  dividerColor: string;
};

export default function ReceiptItemsTable({ items, dividerColor }: Props) {
  const { colors } = useAppTheme();
  const metaColor = colors.text3;

  return (
    <View>
      {/* ── Column headers ──────────────────────────────────────────────────── */}
      <View style={styles.tableHeader}>
        <ThemedText style={[styles.colItem, styles.headerText, { color: metaColor }]}>
          ITEM
        </ThemedText>
        <ThemedText style={[styles.colQty, styles.headerText, { color: metaColor }]}>
          QTY
        </ThemedText>
        <ThemedText style={[styles.colPrice, styles.headerText, { color: metaColor }]}>
          PRICE
        </ThemedText>
        <ThemedText style={[styles.colTotal, styles.headerText, { color: metaColor }]}>
          TOTAL
        </ThemedText>
      </View>

      {/* ── Line items ──────────────────────────────────────────────────────── */}
      {items.map((item, idx) => (
        <ReceiptLineItem
          key={item.productId + idx}
          item={item}
          dividerColor={dividerColor}
          showDivider={idx < items.length - 1}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 4,
  },
  headerText: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
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
});
