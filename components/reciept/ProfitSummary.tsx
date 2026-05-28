// ── ProfitSummary.tsx ─────────────────────────────────────────────────────────
// Green summary card showing net profit, margin %, and total units sold.

import useAppTheme from '@/hooks/useAppTheme';
import { formatMoney } from '@/utils/receiptUtils';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  totalProfit: number;
  totalRevenue: number;
  totalUnits: number;
};

export default function ProfitSummary({
  totalProfit,
  totalRevenue,
  totalUnits,
}: Props) {
  const { colors } = useAppTheme();

  const marginPercent =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <View style={[styles.card, { backgroundColor: colors.alert_success_bg }]}>
      <View style={styles.row}>
        <SummaryCell
          label='Net Profit'
          value={formatMoney(totalProfit)}
          color={colors.success}
        />
        <View style={[styles.vDivider, { backgroundColor: colors.success }]} />
        <SummaryCell
          label='Margin'
          value={`${marginPercent}%`}
          color={colors.success}
        />
        <View style={[styles.vDivider, { backgroundColor: colors.success }]} />
        <SummaryCell
          label='Items'
          value={`${totalUnits} units`}
          color={colors.success}
        />
      </View>
    </View>
  );
}

// ── Internal helper ───────────────────────────────────────────────────────────
function SummaryCell({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View style={styles.cell}>
      <ThemedText style={[styles.label, { color }]}>{label}</ThemedText>
      <ThemedText style={[styles.value, { color }]}>{value}</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 12,
    padding: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
  },
  vDivider: {
    width: 1,
    height: 36,
    opacity: 0.2,
  },
});
