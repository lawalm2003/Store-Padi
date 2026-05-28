// ── ReceiptTotals.tsx ─────────────────────────────────────────────────────────
// Subtotal, optional discount row, divider line, and bold grand total.

import useAppTheme from '@/hooks/useAppTheme';
import { formatMoney } from '@/utils/receiptUtils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  subtotal: number;
  discount: number;
  total: number;
  dividerColor: string;
};

export default function ReceiptTotals({
  subtotal,
  discount,
  total,
  dividerColor,
}: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.block}>
      <LineRow
        label='Subtotal'
        value={formatMoney(subtotal)}
        labelColor={colors.text3}
        valueColor={colors.text}
      />

      {discount > 0 && (
        <LineRow
          label='Discount'
          value={`− ${formatMoney(discount)}`}
          labelColor={colors.warning}
          valueColor={colors.warning}
        />
      )}

      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      <LineRow
        label='Total'
        value={formatMoney(total)}
        labelColor={colors.text}
        valueColor={colors.text}
        bold
      />
    </View>
  );
}

// ── Internal helper ───────────────────────────────────────────────────────────
function LineRow({
  label,
  value,
  labelColor,
  valueColor,
  bold = false,
}: {
  label: string;
  value: string;
  labelColor: string;
  valueColor: string;
  bold?: boolean;
}) {
  const weight = bold ? '700' : '400';
  return (
    <View style={styles.row}>
      <ThemedText
        style={{ fontSize: 14, fontWeight: weight, color: labelColor, flex: 1 }}
      >
        {label}
      </ThemedText>
      <ThemedText
        style={{ fontSize: 14, fontWeight: weight, color: valueColor }}
      >
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    marginVertical: 4,
    opacity: 0.5,
  },
});
