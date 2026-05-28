import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type PaymentBreakdown = {
  method:   string;
  count:    number;
  revenue:  number;
  percent:  number;   // 0–100
};

type Props = {
  data: PaymentBreakdown[];
};

const METHOD_CONFIG: Record<string, {
  label: string;
  icon:  keyof typeof Ionicons.glyphMap;
  color: string;
}> = {
  cash:     { label: 'Cash',     icon: 'cash-outline',           color: '#1EB27C' },
  transfer: { label: 'Transfer', icon: 'phone-portrait-outline', color: '#1899FA' },
  pos:      { label: 'POS',      icon: 'card-outline',           color: '#FAB41E' },
  credit:   { label: 'Credit',   icon: 'book-outline',           color: '#B866FA' },
};

export function PaymentBreakdownCard({ data }: Props) {
  const { colors } = useAppTheme();

  if (!data || data.length === 0) {
    return null;
  }

  const totalRevenue = data.reduce((s, d) => s + d.revenue, 0);

  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <ThemedText style={[styles.title, { color: colors.text }]}>
        Payment Methods
      </ThemedText>

      {/* Stacked bar */}
      <View style={[styles.stackedBar, { backgroundColor: colors.surface2 }]}>
        {data.map(d => {
          const cfg = METHOD_CONFIG[d.method] ?? {
            label: d.method,
            icon:  'wallet-outline',
            color: colors.text3,
          };
          return (
            <View
              key={d.method}
              style={[
                styles.barSegment,
                {
                  width:           `${d.percent}%`,
                  backgroundColor: cfg.color,
                },
              ]}
            />
          );
        })}
      </View>

      {/* Rows */}
      <View style={styles.rows}>
        {data.map((d, i) => {
          const cfg = METHOD_CONFIG[d.method] ?? {
            label: d.method,
            icon:  'wallet-outline',
            color: colors.text3,
          };
          return (
            <View
              key={d.method}
              style={[
                styles.row,
                i < data.length - 1 && {
                  borderBottomWidth: 0.5,
                  borderBottomColor: colors.border,
                },
              ]}
            >
              {/* Icon + label */}
              <View style={styles.methodLeft}>
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: cfg.color + '18' },
                  ]}
                >
                  <Ionicons name={cfg.icon} size={14} color={cfg.color} />
                </View>
                <ThemedText style={[styles.methodLabel, { color: colors.text }]}>
                  {cfg.label}
                </ThemedText>
              </View>

              {/* Bar */}
              <View style={styles.miniBarWrap}>
                <View style={[styles.miniBarTrack, { backgroundColor: colors.surface2 }]}>
                  <View
                    style={[
                      styles.miniBarFill,
                      {
                        width:           `${d.percent}%`,
                        backgroundColor: cfg.color,
                      },
                    ]}
                  />
                </View>
                <ThemedText style={[styles.percent, { color: colors.text3 }]}>
                  {d.percent.toFixed(0)}%
                </ThemedText>
              </View>

              {/* Stats */}
              <View style={styles.methodRight}>
                <ThemedText style={[styles.methodRevenue, { color: colors.text }]}>
                  ₦{d.revenue.toLocaleString()}
                </ThemedText>
                <ThemedText style={[styles.methodCount, { color: colors.text3 }]}>
                  {d.count} sale{d.count !== 1 ? 's' : ''}
                </ThemedText>
              </View>
            </View>
          );
        })}
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
  title: {
    fontSize:   14,
    fontWeight: '700',
  },
  stackedBar: {
    height:        10,
    borderRadius:  5,
    flexDirection: 'row',
    overflow:      'hidden',
  },
  barSegment: {
    height: 10,
  },
  rows: {
    gap: 0,
  },
  row: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingVertical: 10,
    gap:            10,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    width:         90,
  },
  iconWrap: {
    width:          28,
    height:         28,
    borderRadius:   8,
    alignItems:     'center',
    justifyContent: 'center',
  },
  methodLabel: {
    fontSize:   13,
    fontWeight: '500',
  },
  miniBarWrap: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  miniBarTrack: {
    flex:         1,
    height:       4,
    borderRadius: 2,
    overflow:     'hidden',
  },
  miniBarFill: {
    height:       4,
    borderRadius: 2,
  },
  percent: {
    fontSize: 10,
    width:    28,
    textAlign: 'right',
  },
  methodRight: {
    alignItems: 'flex-end',
    gap:        2,
    width:      80,
  },
  methodRevenue: {
    fontSize:   12,
    fontWeight: '600',
  },
  methodCount: {
    fontSize: 10,
  },
});
