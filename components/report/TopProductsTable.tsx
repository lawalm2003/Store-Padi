import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type TopProduct = {
  productId:          string;
  productName:        string;
  totalRevenue:       number;
  totalProfit:        number;
  totalUnitsSold:     number;
  marginPercent:      number;
  profitSharePercent: number;   // 0–100, width of the bar
};

type Props = {
  products: TopProduct[];
};

export function TopProductsTable({ products }: Props) {
  const { colors } = useAppTheme();

  if (!products || products.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Top Products
        </ThemedText>
        <View style={styles.empty}>
          <Ionicons name="cube-outline" size={32} color={colors.border} />
          <ThemedText style={[styles.emptyText, { color: colors.text3 }]}>
            No sales data yet
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Top Products by Profit
        </ThemedText>
        <View style={[styles.badge, { backgroundColor: colors.blue_soft }]}>
          <ThemedText style={[styles.badgeText, { color: colors.primary }]}>
            {products.length} products
          </ThemedText>
        </View>
      </View>

      {/* Column labels */}
      <View style={styles.colHeaders}>
        <ThemedText style={[styles.colLabel, { color: colors.text3, flex: 1 }]}>
          PRODUCT
        </ThemedText>
        <ThemedText style={[styles.colLabel, { color: colors.text3, width: 60, textAlign: 'right' }]}>
          REVENUE
        </ThemedText>
        <ThemedText style={[styles.colLabel, { color: colors.text3, width: 60, textAlign: 'right' }]}>
          PROFIT
        </ThemedText>
      </View>

      {/* Rows */}
      {products.map((p, i) => (
        <View
          key={p.productId}
          style={[
            styles.row,
            i < products.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: colors.border,
            },
          ]}
        >
          {/* Rank + name */}
          <View style={styles.nameCol}>
            <View
              style={[
                styles.rank,
                {
                  backgroundColor:
                    i === 0 ? colors.golden_yellow + '22' :
                    i === 1 ? colors.text3 + '18' :
                    colors.surface2,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.rankText,
                  {
                    color:
                      i === 0 ? colors.golden_yellow :
                      i === 1 ? colors.text3 :
                      colors.text3,
                  },
                ]}
              >
                {i + 1}
              </ThemedText>
            </View>
            <View style={styles.nameWrap}>
              <ThemedText
                style={[styles.productName, { color: colors.text }]}
                numberOfLines={1}
              >
                {p.productName}
              </ThemedText>
              {/* Profit share bar */}
              <View style={[styles.barTrack, { backgroundColor: colors.surface2 }]}>
                <View
                  style={[
                    styles.barFill,
                    {
                      width:           `${p.profitSharePercent}%`,
                      backgroundColor: colors.success,
                    },
                  ]}
                />
              </View>
              <ThemedText style={[styles.units, { color: colors.text3 }]}>
                {p.totalUnitsSold} units · {p.marginPercent.toFixed(1)}% margin
              </ThemedText>
            </View>
          </View>

          {/* Revenue */}
          <ThemedText style={[styles.revenue, { color: colors.text }]}>
            ₦{(p.totalRevenue / 1000).toFixed(0)}K
          </ThemedText>

          {/* Profit */}
          <ThemedText style={[styles.profit, { color: colors.success }]}>
            ₦{(p.totalProfit / 1000).toFixed(0)}K
          </ThemedText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding:      16,
    gap:          12,
  },
  header: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize:   14,
    fontWeight: '700',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      20,
  },
  badgeText: {
    fontSize:   11,
    fontWeight: '600',
  },
  colHeaders: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingBottom: 4,
  },
  colLabel: {
    fontSize:      10,
    fontWeight:    '600',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    paddingVertical: 10,
    gap:           8,
  },
  nameCol: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    marginRight:   4,
  },
  rank: {
    width:          24,
    height:         24,
    borderRadius:   8,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  rankText: {
    fontSize:   12,
    fontWeight: '700',
  },
  nameWrap: {
    flex: 1,
    gap:  4,
  },
  productName: {
    fontSize:   13,
    fontWeight: '500',
  },
  barTrack: {
    height:       4,
    borderRadius: 2,
    overflow:     'hidden',
  },
  barFill: {
    height:       4,
    borderRadius: 2,
  },
  units: {
    fontSize: 10,
  },
  revenue: {
    width:      60,
    fontSize:   12,
    fontWeight: '500',
    textAlign:  'right',
  },
  profit: {
    width:      60,
    fontSize:   13,
    fontWeight: '700',
    textAlign:  'right',
  },
  empty: {
    height:         100,
    alignItems:     'center',
    justifyContent: 'center',
    gap:            8,
  },
  emptyText: {
    fontSize: 13,
  },
});
