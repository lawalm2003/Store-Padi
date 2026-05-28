// ── SaleReceiptScreen.tsx ─────────────────────────────────────────────────────
// Orchestrator screen. Composes all sub-components; contains only layout and
// business logic (share text generation, press animation).

import DashedDivider from '@/components/reciept/DashedDivider';
import HolePunchRow from '@/components/reciept/HolePunchRow';
import ProfitSummary from '@/components/reciept/ProfitSummary';
import ReceiptActions from '@/components/reciept/ReceiptActions';
import ReceiptFooter from '@/components/reciept/ReceiptFooter';
import ReceiptHeader from '@/components/reciept/ReceiptHeader';
import ReceiptItemsTable from '@/components/reciept/ReceiptItemsTable';
import ReceiptMeta from '@/components/reciept/ReceiptMeta';
import ReceiptTopBar from '@/components/reciept/ReceiptTopBar';
import ReceiptTotals from '@/components/reciept/ReceiptTotals';
import useAppTheme from '@/hooks/useAppTheme';
import { Sale } from '@/types';
import {
  PAYMENT_LABELS,
  formatDate,
  formatMoney,
  formatTime,
} from '@/utils/receiptUtils';
import React, { useRef } from 'react';
import {
  Animated,
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { ThemedView } from '../ThemedView';

type Props = {
  sale: Sale;
  onClose: () => void;
};

export default function SaleReceiptScreen({ sale, onClose }: Props) {
  const { colors, dark } = useAppTheme();
  const pressAnim = useRef(new Animated.Value(1)).current;

  // ── Derived values ──────────────────────────────────────────────────────────
  const subtotal = sale.items.reduce((s, i) => s + i.subtotal, 0);
  const totalUnits = sale.items.reduce((s, i) => s + i.quantity, 0);

  // ── Colors ──────────────────────────────────────────────────────────────────
  const receiptBg = dark ? '#1A1A1E' : '#FFFFFF';
  const receiptBorder = dark ? '#2E2E38' : '#E8EBF0';
  const holeBg = dark ? colors.background : '#F2F4F7';
  const dividerColor = dark ? '#2E2E38' : '#D8DCE6';

  // ── Actions ─────────────────────────────────────────────────────────────────
  async function handleShare() {
    const lines = [
      `StorePadi Receipt`,
      `─────────────────`,
      `ID: ${sale.id.toUpperCase()}`,
      `Date: ${formatDate(sale.createdAt)}  ${formatTime(sale.createdAt)}`,
      ``,
      ...sale.items.map(
        (i) =>
          `${i.productName}\n  ×${i.quantity} @ ${formatMoney(i.sellingPriceAtSale)} = ${formatMoney(i.subtotal)}`,
      ),
      ``,
      sale.discount > 0 ? `Discount: -${formatMoney(sale.discount)}` : null,
      `Total: ${formatMoney(sale.totalRevenue)}`,
      `Payment: ${PAYMENT_LABELS[sale.paymentMethod] ?? sale.paymentMethod}`,
      ``,
      `Thank you for your business!`,
    ]
      .filter(Boolean)
      .join('\n');

    await Share.share({ message: lines, title: 'StorePadi Receipt' });
  }

  function handlePressIn() {
    Animated.spring(pressAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
    }).start();
  }
  function handlePressOut() {
    Animated.spring(pressAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
    }).start();
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <ReceiptTopBar onClose={onClose} onShare={handleShare} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Receipt card ─────────────────────────────────────────────────── */}
        <Animated.View
          style={[
            styles.receipt,
            {
              backgroundColor: receiptBg,
              borderColor: receiptBorder,
              transform: [{ scale: pressAnim }],
            },
          ]}
        >
          <ReceiptHeader />
          <DashedDivider color={dividerColor} />

          <ReceiptMeta
            id={sale.id}
            createdAt={sale.createdAt}
            paymentMethod={sale.paymentMethod}
            customerNote={sale.customerNote}
          />
          <DashedDivider color={dividerColor} />

          <ReceiptItemsTable items={sale.items} dividerColor={dividerColor} />
          <DashedDivider color={dividerColor} />

          <ReceiptTotals
            subtotal={subtotal}
            discount={sale.discount}
            total={sale.totalRevenue}
            dividerColor={dividerColor}
          />
          <DashedDivider color={dividerColor} />

          <ProfitSummary
            totalProfit={sale.totalProfit}
            totalRevenue={sale.totalRevenue}
            totalUnits={totalUnits}
          />

          <HolePunchRow holeBg={holeBg} borderColor={receiptBorder} />
          <ReceiptFooter />
        </Animated.View>

        {/* ── Action buttons ───────────────────────────────────────────────── */}
        <ReceiptActions
          pressAnim={pressAnim}
          onShare={handleShare}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 48,
    gap: 16,
  },
  receipt: {
    borderRadius: 16,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
});
