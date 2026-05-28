import ScreenHeader from '@/components/profile/ScreenHeader';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type ExportFormat = 'csv' | 'excel' | 'pdf';
type ExportType = 'sales' | 'products' | 'reports';

type ExportOption = {
  type: ExportType;
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const EXPORT_OPTIONS: ExportOption[] = [
  {
    type: 'sales',
    label: 'Sales History',
    sub: 'All recorded transactions',
    icon: 'receipt-outline',
  },
  {
    type: 'products',
    label: 'Product Inventory',
    sub: 'Full catalogue with prices & stock',
    icon: 'cube-outline',
  },
  {
    type: 'reports',
    label: 'Profit & Revenue Report',
    sub: 'Analytics summary',
    icon: 'bar-chart-outline',
  },
];

const FORMAT_OPTIONS: {
  value: ExportFormat;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'csv', label: 'CSV', icon: 'document-text-outline' },
  { value: 'excel', label: 'Excel', icon: 'grid-outline' },
  { value: 'pdf', label: 'PDF', icon: 'document-outline' },
];

export default function ExportScreen() {
  const { colors } = useAppTheme();
  const [selectedType, setSelectedType] = useState<ExportType>('sales');
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('csv');
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      // TODO: generate and share file
      await new Promise((r) => setTimeout(r, 1500));
      console.log('Exported:', selectedType, selectedFormat);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader title='Export Data' />

      <View style={styles.content}>
        {/* What to export */}
        <ThemedText style={[styles.sectionLabel, { color: colors.text3 }]}>
          What to export
        </ThemedText>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {EXPORT_OPTIONS.map((opt, i) => {
            const active = selectedType === opt.type;
            return (
              <TouchableOpacity
                key={opt.type}
                onPress={() => setSelectedType(opt.type)}
                activeOpacity={0.7}
                style={[
                  styles.row,
                  i < EXPORT_OPTIONS.length - 1 && {
                    borderBottomWidth: 0.5,
                    borderBottomColor: colors.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.iconWrap,
                    {
                      backgroundColor: active
                        ? colors.blue_soft
                        : colors.surface2,
                    },
                  ]}
                >
                  <Ionicons
                    name={opt.icon}
                    size={17}
                    color={active ? colors.primary : colors.text3}
                  />
                </View>
                <View style={styles.labels}>
                  <ThemedText style={[styles.rowLabel, { color: colors.text }]}>
                    {opt.label}
                  </ThemedText>
                  <ThemedText style={[styles.rowSub, { color: colors.text3 }]}>
                    {opt.sub}
                  </ThemedText>
                </View>
                <View
                  style={[
                    styles.radio,
                    { borderColor: active ? colors.primary : colors.border },
                  ]}
                >
                  {active && (
                    <View
                      style={[
                        styles.radioDot,
                        { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Format */}
        <ThemedText style={[styles.sectionLabel, { color: colors.text3 }]}>
          File format
        </ThemedText>
        <View style={styles.formatRow}>
          {FORMAT_OPTIONS.map((fmt) => {
            const active = selectedFormat === fmt.value;
            return (
              <TouchableOpacity
                key={fmt.value}
                onPress={() => setSelectedFormat(fmt.value)}
                activeOpacity={0.7}
                style={[
                  styles.formatBtn,
                  {
                    backgroundColor: active ? colors.blue_soft : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                    borderWidth: active ? 1.5 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name={fmt.icon}
                  size={16}
                  color={active ? colors.primary : colors.text3}
                />
                <ThemedText
                  style={[
                    styles.formatLabel,
                    {
                      color: active ? colors.primary : colors.text3,
                      fontWeight: active ? '700' : '500',
                    },
                  ]}
                >
                  {fmt.label}
                </ThemedText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Export button */}
        <TouchableOpacity
          onPress={handleExport}
          disabled={loading}
          activeOpacity={0.85}
          style={[
            styles.exportBtn,
            { backgroundColor: loading ? colors.disabled : colors.primary },
          ]}
        >
          {loading ? (
            <ActivityIndicator color='#FFF' size='small' />
          ) : (
            <>
              <Ionicons name='download-outline' size={18} color='#FFF' />
              <ThemedText style={styles.exportBtnText}>
                Export{' '}
                {FORMAT_OPTIONS.find((f) => f.value === selectedFormat)?.label}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 20, gap: 12 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  card: { borderRadius: 14, paddingHorizontal: 14 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    gap: 12,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  labels: { flex: 1, gap: 2 },
  rowLabel: { fontSize: 14, fontWeight: '500' },
  rowSub: { fontSize: 12 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  formatRow: { flexDirection: 'row', gap: 10 },
  formatBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  formatLabel: { fontSize: 13 },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    marginTop: 8,
  },
  exportBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
