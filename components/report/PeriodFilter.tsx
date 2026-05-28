import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

export type ReportPeriod = 'today' | 'this_week' | 'this_month' | 'custom';

type Filter = {
  value: ReportPeriod;
  label: string;
};

const FILTERS: Filter[] = [
  { value: 'today',      label: 'Today'      },
  { value: 'this_week',  label: 'This Week'  },
  { value: 'this_month', label: 'This Month' },
];

type Props = {
  selected:  ReportPeriod;
  onChange:  (period: ReportPeriod) => void;
};

export function PeriodFilter({ selected, onChange }: Props) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {FILTERS.map(f => {
        const active = f.value === selected;
        return (
          <TouchableOpacity
            key={f.value}
            onPress={() => onChange(f.value)}
            activeOpacity={0.7}
            style={[
              styles.tab,
              {
                backgroundColor: active ? colors.primary   : colors.surface2,
                borderColor:     active ? colors.primary   : colors.border,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.tabText,
                {
                  color:      active ? '#FFFFFF' : colors.text3,
                  fontWeight: active ? '600'     : '400',
                },
              ]}
            >
              {f.label}
            </ThemedText>
          </TouchableOpacity>
        );
      })}

      {/* Export button */}
      <TouchableOpacity
        style={[styles.exportBtn, { backgroundColor: colors.surface2, borderColor: colors.border }]}
        activeOpacity={0.7}
      >
        <Ionicons name="download-outline" size={15} color={colors.text3} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
  tab: {
    flex:              1,
    paddingVertical:   8,
    paddingHorizontal: 4,
    borderRadius:      20,
    borderWidth:       0.5,
    alignItems:        'center',
  },
  tabText: {
    fontSize: 12,
  },
  exportBtn: {
    width:          36,
    height:         36,
    borderRadius:   10,
    borderWidth:    0.5,
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
});
