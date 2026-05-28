import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

type Props = {
  totalRevenue: number;
  totalProfit: number;
  handleRecord: () => void;
  loading: boolean;
  totalUnits: number;
};

export default function RecordSaleFooter({
  totalProfit,
  totalRevenue,
  handleRecord,
  loading,
  totalUnits,
}: Props) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.footer,
        {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
        },
      ]}
    >
      {/* Mini totals strip */}
      <View style={styles.footerTotals}>
        <ThemedText style={[styles.footerTotal, { color: colors.text }]}>
          ₦{totalRevenue.toLocaleString()}
        </ThemedText>
        <ThemedText style={[styles.footerProfit, { color: colors.success }]}>
          +₦{totalProfit.toLocaleString()} profit
        </ThemedText>
      </View>

      <TouchableOpacity
        onPress={handleRecord}
        disabled={loading}
        activeOpacity={0.85}
        style={[
          styles.recordBtn,
          { backgroundColor: loading ? colors.disabled : colors.success },
        ]}
      >
        {loading ? (
          <ActivityIndicator size={'small'} />
        ) : (
          <>
            <Ionicons
              name={'checkmark-circle-outline'}
              size={20}
              color='#FFFFFF'
            />
            <ThemedText style={styles.recordBtnText}>
              {`Record Sale · ${totalUnits} unit${totalUnits > 1 ? 's' : ''}`}
            </ThemedText>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Sticky footer ─────────────────────────────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 36,
    borderTopWidth: 0.5,
    gap: 10,
  },
  footerTotals: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  footerTotal: {
    fontSize: 20,
    fontWeight: '700',
  },
  footerProfit: {
    fontSize: 13,
    fontWeight: '600',
  },
  recordBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  recordBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
