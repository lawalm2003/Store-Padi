import useAppTheme from '@/hooks/useAppTheme';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type DataPoint = {
  date:     string;   // ISO date string
  revenue:  number;
  profit:   number;
};

type Props = {
  data:   DataPoint[];
  period: 'today' | 'this_week' | 'this_month' | 'custom';
};

function formatLabel(date: string, period: Props['period']): string {
  const d = new Date(date);
  if (period === 'this_month') {
    return d.getDate().toString();                                    // 1..31
  }
  return d.toLocaleDateString('en-NG', { weekday: 'short' }).slice(0, 3); // Mon
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `₦${(n / 1_000).toFixed(0)}K`;
  return `₦${n}`;
}

export function RevenueBarChart({ data, period }: Props) {
  const { colors } = useAppTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Revenue
        </ThemedText>
        <View style={styles.empty}>
          <ThemedText style={[styles.emptyText, { color: colors.text3 }]}>
            No data for this period
          </ThemedText>
        </View>
      </View>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
  const maxProfit  = Math.max(...data.map(d => d.profit),  1);
  const CHART_H    = 120;

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Revenue
        </ThemedText>
        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <ThemedText style={[styles.legendLabel, { color: colors.text3 }]}>
              Revenue
            </ThemedText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
            <ThemedText style={[styles.legendLabel, { color: colors.text3 }]}>
              Profit
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Y-axis labels + bars */}
      <View style={styles.chartArea}>
        {/* Y-axis */}
        <View style={styles.yAxis}>
          {[1, 0.5, 0].map(pct => (
            <ThemedText
              key={pct}
              style={[styles.yLabel, { color: colors.text3 }]}
            >
              {formatMoney(maxRevenue * pct)}
            </ThemedText>
          ))}
        </View>

        {/* Bars */}
        <View style={styles.barsArea}>
          {/* Grid lines */}
          {[0, 0.5, 1].map(pct => (
            <View
              key={pct}
              style={[
                styles.gridLine,
                {
                  bottom:          pct * CHART_H,
                  backgroundColor: colors.border,
                },
              ]}
            />
          ))}

          {/* Bar groups */}
          <View style={[styles.bars, { height: CHART_H }]}>
            {data.map((d, i) => {
              const revH    = Math.max((d.revenue / maxRevenue) * CHART_H, 2);
              const profH   = Math.max((d.profit  / maxRevenue) * CHART_H, 2);
              const label   = formatLabel(d.date, period);
              const isToday = i === data.length - 1;

              return (
                <View key={d.date} style={styles.barGroup}>
                  {/* Revenue bar (back) */}
                  <View style={styles.barPair}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height:          revH,
                          backgroundColor: colors.primary,
                          opacity:         isToday ? 1 : 0.6,
                          borderRadius:    4,
                        },
                      ]}
                    />
                    {/* Profit bar (front, overlaid) */}
                    <View
                      style={[
                        styles.bar,
                        styles.profitBar,
                        {
                          height:          profH,
                          backgroundColor: colors.success,
                          opacity:         isToday ? 1 : 0.7,
                          borderRadius:    4,
                        },
                      ]}
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.barLabel,
                      {
                        color:      isToday ? colors.primary : colors.text3,
                        fontWeight: isToday ? '700' : '400',
                      },
                    ]}
                  >
                    {label}
                  </ThemedText>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding:      16,
    gap:          14,
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
  legend: {
    flexDirection: 'row',
    gap:           12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           5,
  },
  legendDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
  },

  // ── Chart ─────────────────────────────────────────────────────────────────
  chartArea: {
    flexDirection: 'row',
    gap:           8,
  },
  yAxis: {
    justifyContent: 'space-between',
    alignItems:     'flex-end',
    paddingBottom:  20,
    width:          40,
  },
  yLabel: {
    fontSize: 9,
  },
  barsArea: {
    flex:     1,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left:     0,
    right:    0,
    height:   0.5,
    opacity:  0.4,
  },
  bars: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    justifyContent: 'space-between',
    paddingBottom:  20,
  },
  barGroup: {
    flex:           1,
    alignItems:     'center',
    gap:            4,
  },
  barPair: {
    width:          '70%',
    position:       'relative',
    alignItems:     'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
  },
  profitBar: {
    position: 'absolute',
    bottom:   0,
    width:    '60%',
  },
  barLabel: {
    fontSize: 9,
    position: 'absolute',
    bottom:   0,
  },
  empty: {
    height:         100,
    alignItems:     'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
});
