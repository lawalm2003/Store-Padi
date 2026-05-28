import useAppTheme from '@/hooks/useAppTheme';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  totalRevenue: number;
  totalProfit: number;
};

export default function SalesSummary({ totalRevenue, totalProfit }: Props) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.summaryStrip,
        { backgroundColor: colors.alert_success_bg },
      ]}
    >
      <View style={styles.summaryItem}>
        <ThemedText style={[styles.summaryLabel, { color: colors.text3 }]}>
          Revenue
        </ThemedText>
        <ThemedText style={[styles.summaryValue, { color: colors.text }]}>
          ₦{totalRevenue.toLocaleString()}
        </ThemedText>
      </View>
      <View
        style={[styles.summaryDivider, { backgroundColor: colors.border }]}
      />
      <View style={styles.summaryItem}>
        <ThemedText style={[styles.summaryLabel, { color: colors.text3 }]}>
          Profit
        </ThemedText>
        <ThemedText style={[styles.summaryValue, { color: colors.success }]}>
          ₦{totalProfit.toLocaleString()}
        </ThemedText>
      </View>
      <View
        style={[styles.summaryDivider, { backgroundColor: colors.border }]}
      />
      <View style={styles.summaryItem}>
        <ThemedText style={[styles.summaryLabel, { color: colors.text3 }]}>
          Margin
        </ThemedText>
        <ThemedText style={[styles.summaryValue, { color: colors.success }]}>
          {totalRevenue > 0
            ? ((totalProfit / totalRevenue) * 100).toFixed(1)
            : '0'}
          %
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryStrip: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  summaryLabel: {
    fontSize: 11,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  summaryDivider: {
    width: 1,
    marginVertical: 2,
  },
});
