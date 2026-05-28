import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Metric = {
  label:      string;
  value:      string;
  change:     number;   // percentage change vs previous period
  icon:       keyof typeof Ionicons.glyphMap;
  color:      string;
};

type Props = {
  totalRevenue:      number;
  totalProfit:       number;
  totalUnitsSold:    number;
  averageOrderValue: number;
  revenueChange:     number;
  profitChange:      number;
  unitsSoldChange:   number;
  avgOrderChange:    number;
};

function MetricCard({ label, value, change, icon, color }: Metric) {
  const { colors } = useAppTheme();
  const isPositive = change >= 0;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: color }]} />

      <View style={styles.cardContent}>
        <ThemedText style={[styles.label, { color: colors.text3 }]}>
          {label}
        </ThemedText>
        <ThemedText style={[styles.value, { color: colors.text }]}>
          {value}
        </ThemedText>
        <View style={styles.changeRow}>
          <Ionicons
            name={isPositive ? 'trending-up' : 'trending-down'}
            size={12}
            color={isPositive ? colors.success : colors.error}
          />
          <ThemedText
            style={[
              styles.change,
              { color: isPositive ? colors.success : colors.error },
            ]}
          >
            {isPositive ? '+' : ''}{change.toFixed(1)}%
          </ThemedText>
        </View>
      </View>

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: color + '18' }]}>
        <Ionicons name={icon} size={18} color={color} />
      </View>
    </View>
  );
}

export function ReportMetrics({
  totalRevenue,
  totalProfit,
  totalUnitsSold,
  averageOrderValue,
  revenueChange,
  profitChange,
  unitsSoldChange,
  avgOrderChange,
}: Props) {
  const { colors } = useAppTheme();

  const metrics: Metric[] = [
    {
      label:  'Revenue',
      value:  `₦${totalRevenue.toLocaleString()}`,
      change: revenueChange,
      icon:   'cash-outline',
      color:  colors.primary,
    },
    {
      label:  'Profit',
      value:  `₦${totalProfit.toLocaleString()}`,
      change: profitChange,
      icon:   'trending-up-outline',
      color:  colors.success,
    },
    {
      label:  'Units Sold',
      value:  totalUnitsSold.toLocaleString(),
      change: unitsSoldChange,
      icon:   'cube-outline',
      color:  colors.golden_yellow,
    },
    {
      label:  'Avg Order',
      value:  `₦${averageOrderValue.toLocaleString()}`,
      change: avgOrderChange,
      icon:   'receipt-outline',
      color:  colors.purple,
    },
  ];

  return (
    <View style={styles.grid}>
      {metrics.map(m => (
        <View key={m.label} style={styles.cardWrap}>
          <MetricCard {...m} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           10,
  },
  cardWrap: {
    width: '47.5%',
  },
  card: {
    borderRadius:  14,
    overflow:      'hidden',
    flexDirection: 'row',
    alignItems:    'center',
    padding:       14,
    gap:           10,
  },
  accent: {
    position:     'absolute',
    left:         0,
    top:          0,
    bottom:       0,
    width:        3,
    borderRadius: 2,
  },
  cardContent: {
    flex: 1,
    paddingLeft: 6,
    gap: 3,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
  },
  value: {
    fontSize:   16,
    fontWeight: '700',
  },
  changeRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           3,
  },
  change: {
    fontSize:   11,
    fontWeight: '500',
  },
  iconWrap: {
    width:          36,
    height:         36,
    borderRadius:   10,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
});
