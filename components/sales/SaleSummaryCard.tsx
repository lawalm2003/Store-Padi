import useAppTheme from '@/hooks/useAppTheme';
import { PaymentMethod } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

const PAYMENT_OPTIONS: {
  value: PaymentMethod;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}[] = [
  { value: 'cash', label: 'Cash', icon: 'cash-outline' },
  { value: 'transfer', label: 'Transfer', icon: 'phone-portrait-outline' },
  { value: 'pos', label: 'POS', icon: 'card-outline' },
  { value: 'credit', label: 'Credit', icon: 'book-outline' },
];

type Props = {
  subtotal: number;
  discount: number;
  totalRevenue: number;
  totalProfit: number;
  paymentMethod: PaymentMethod;
  customerNote: string;
  onDiscountChange: (v: number) => void;
  onPaymentMethodChange: (v: PaymentMethod) => void;
  onNoteChange: (v: string) => void;
};

export function SaleSummaryCard({
  subtotal,
  discount,
  totalRevenue,
  totalProfit,
  paymentMethod,
  customerNote,
  onDiscountChange,
  onPaymentMethodChange,
  onNoteChange,
}: Props) {
  const { colors } = useAppTheme();
  const marginPct =
    totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : '0';

  return (
    <View style={styles.wrapper}>
      {/* ── Totals ────────────────────────────────────────────────────── */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
          Order Summary
        </ThemedText>

        {/* Subtotal */}
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.text3 }]}>
            Subtotal
          </ThemedText>
          <ThemedText style={[styles.summaryValue, { color: colors.text }]}>
            ₦{subtotal.toLocaleString()}
          </ThemedText>
        </View>

        {/* Discount */}
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.text3 }]}>
            Discount (₦)
          </ThemedText>
          <View
            style={[
              styles.discountInput,
              {
                backgroundColor: colors.surface2,
                borderColor: colors.input_Border,
              },
            ]}
          >
            <ThemedText
              style={[styles.discountPrefix, { color: colors.text3 }]}
            >
              ₦
            </ThemedText>
            <TextInput
              value={discount > 0 ? String(discount) : ''}
              onChangeText={(t) => {
                const n = Number(t.replace(/[^0-9]/g, ''));
                onDiscountChange(Math.min(n, subtotal));
              }}
              placeholder='0'
              placeholderTextColor={colors.input_placeholder}
              keyboardType='numeric'
              style={[styles.discountField, { color: colors.text }]}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Total */}
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.totalLabel, { color: colors.text }]}>
            Total
          </ThemedText>
          <ThemedText style={[styles.totalValue, { color: colors.text }]}>
            ₦{totalRevenue.toLocaleString()}
          </ThemedText>
        </View>

        {/* Profit strip */}
        <View
          style={[
            styles.profitStrip,
            { backgroundColor: colors.alert_success_bg },
          ]}
        >
          <View style={styles.profitItem}>
            <ThemedText style={[styles.profitLabel, { color: colors.success }]}>
              Net Profit
            </ThemedText>
            <ThemedText style={[styles.profitValue, { color: colors.success }]}>
              ₦{totalProfit.toLocaleString()}
            </ThemedText>
          </View>
          <View
            style={[
              styles.profitDivider,
              { backgroundColor: colors.success, opacity: 0.2 },
            ]}
          />
          <View style={styles.profitItem}>
            <ThemedText style={[styles.profitLabel, { color: colors.success }]}>
              Margin
            </ThemedText>
            <ThemedText style={[styles.profitValue, { color: colors.success }]}>
              {marginPct}%
            </ThemedText>
          </View>
        </View>
      </View>

      {/* ── Payment method ────────────────────────────────────────────── */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
          Payment Method
        </ThemedText>
        <View style={styles.paymentGrid}>
          {PAYMENT_OPTIONS.map((opt) => {
            const active = opt.value === paymentMethod;
            return (
              <TouchableOpacity
                key={opt.value}
                onPress={() => onPaymentMethodChange(opt.value)}
                activeOpacity={0.7}
                style={[
                  styles.paymentOption,
                  {
                    backgroundColor: active
                      ? colors.blue_soft
                      : colors.surface2,
                    borderColor: active ? colors.primary : colors.border,
                    borderWidth: active ? 1.5 : 0.5,
                  },
                ]}
              >
                <Ionicons
                  name={opt.icon}
                  size={18}
                  color={active ? colors.primary : colors.text3}
                />
                <ThemedText
                  style={[
                    styles.paymentLabel,
                    {
                      color: active ? colors.primary : colors.text3,
                      fontWeight: active ? '600' : '400',
                    },
                  ]}
                >
                  {opt.label}
                </ThemedText>
                {active && (
                  <View
                    style={[
                      styles.paymentCheck,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Ionicons name='checkmark' size={10} color='#FFF' />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Customer note ─────────────────────────────────────────────── */}
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ThemedText style={[styles.cardTitle, { color: colors.text }]}>
          Customer Note
          <ThemedText style={[styles.optional, { color: colors.text3 }]}>
            {' '}
            (optional)
          </ThemedText>
        </ThemedText>
        <View
          style={[
            styles.noteInput,
            {
              backgroundColor: colors.fixed_input_bg,
              borderColor: colors.input_Border,
            },
          ]}
        >
          <TextInput
            value={customerNote}
            onChangeText={onNoteChange}
            placeholder='e.g. Regular customer, bulk order...'
            placeholderTextColor={colors.input_placeholder}
            multiline
            numberOfLines={3}
            style={[styles.noteField, { color: colors.text }]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  optional: {
    fontSize: 13,
    fontWeight: '400',
  },

  // ── Summary rows ────────────────────────────────────────────────────────────
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 13,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  discountInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    gap: 4,
    minWidth: 90,
  },
  discountPrefix: {
    fontSize: 13,
  },
  discountField: {
    fontSize: 13,
    flex: 1,
    paddingVertical: 0,
  },
  divider: {
    height: 0.5,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  profitStrip: {
    flexDirection: 'row',
    borderRadius: 10,
    padding: 12,
  },
  profitItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  profitLabel: {
    fontSize: 11,
  },
  profitValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  profitDivider: {
    width: 1,
    marginVertical: 2,
  },

  // ── Payment ─────────────────────────────────────────────────────────────────
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    width: '47%',
    position: 'relative',
  },
  paymentLabel: {
    fontSize: 13,
  },
  paymentCheck: {
    position: 'absolute',
    top: 6,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Note ────────────────────────────────────────────────────────────────────
  noteInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  noteField: {
    fontSize: 13,
    minHeight: 70,
    textAlignVertical: 'top',
    paddingVertical: 0,
  },
});
