import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

export default function ProfitPreview() {
  const { colors } = useAppTheme();
  const cost = Number(useWatch({ name: 'costPrice' })) || 0;
  const sell = Number(useWatch({ name: 'sellingPrice' })) || 0;
  const profit = sell - cost;
  const margin = sell > 0 ? ((profit / sell) * 100).toFixed(1) : '0';
  const valid = sell > 0 && cost > 0;

  if (!valid) return null;

  const isGood = profit > 0;

  return (
    <View
      style={[
        styles.profitPreview,
        {
          backgroundColor: isGood
            ? colors.alert_success_bg
            : colors.alert_critical_bg,
          borderColor: isGood ? colors.success : colors.error,
        },
      ]}
    >
      <Ionicons
        name={isGood ? 'trending-up-outline' : 'trending-down-outline'}
        size={16}
        color={isGood ? colors.success : colors.error}
      />
      <View style={{ flex: 1 }}>
        <ThemedText
          style={[
            styles.profitTitle,
            { color: isGood ? colors.success : colors.error },
          ]}
        >
          {isGood
            ? `₦${profit.toLocaleString()} profit per unit · ${margin}% margin`
            : `Selling below cost — losing ₦${Math.abs(profit).toLocaleString()} per unit`}
        </ThemedText>
        <ThemedText style={[styles.profitSub, { color: colors.text3 }]}>
          {isGood
            ? 'Good margin — your pricing is profitable'
            : 'Increase selling price above cost price'}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profitPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: -4,
  },
  profitTitle: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  profitSub: {
    fontSize: 11,
    marginTop: 2,
  },
});
