import useAppTheme from '@/hooks/useAppTheme';
import { Sale } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import SaleLineItem from '../home/SaleLineItem';

const PAYMENT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  cash: 'cash-outline',
  transfer: 'phone-portrait-outline',
  pos: 'card-outline',
  credit: 'book-outline',
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash',
  transfer: 'Transfer',
  pos: 'POS',
  credit: 'Credit',
};

type Props = {
  sale: Sale;
};

export default function SalesCard({ sale }: Props) {
  const { colors } = useAppTheme();
  const [expanded, setExpanded] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isMultiItem = sale.items.length > 1;
  const date = new Date(sale.createdAt);

  const isToday = new Date().toDateString() === date.toDateString();
  const formattedDate = isToday
    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : date.toLocaleDateString([], { day: 'numeric', month: 'short' }) +
      '  ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const paymentIcon = PAYMENT_ICON[sale.paymentMethod] ?? 'wallet-outline';
  const paymentLabel = PAYMENT_LABELS[sale.paymentMethod] ?? sale.paymentMethod;

  const previewName = isMultiItem
    ? `${sale.items[0].productName} +${sale.items.length - 1} more`
    : sale.items[0].productName;

  function handlePressIn() {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
      tension: 120,
    }).start();
  }
  function handlePressOut() {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 120,
    }).start();
  }

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() =>
          router.push({ pathname: '/sales/[id]', params: { id: sale.id } })
        }
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* ── Left: icon box ─────────────────────────────────────────────── */}
        <View style={[styles.iconBox, { backgroundColor: colors.surface2 }]}>
          <Ionicons name='cart-outline' size={26} color={colors.primary} />
        </View>

        {/* ── Centre: info ───────────────────────────────────────────────── */}
        <View style={styles.info}>
          {/* Name row */}
          <TouchableOpacity
            onPress={() => isMultiItem && setExpanded((prev) => !prev)}
            activeOpacity={isMultiItem ? 0.7 : 1}
            style={styles.nameRow}
          >
            <ThemedText
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {previewName}
            </ThemedText>
            {isMultiItem && (
              <Ionicons
                name={expanded ? 'chevron-up' : 'chevron-down'}
                size={14}
                color={colors.text3}
              />
            )}
          </TouchableOpacity>
          {/* Date + payment method */}
          <ThemedText style={[styles.sub, { color: colors.text3 }]}>
            {formattedDate} · {paymentLabel}
          </ThemedText>
          {/* Revenue + profit row */}
          <View style={styles.priceRow}>
            <ThemedText style={[styles.revenue, { color: colors.primary }]}>
              ₦{sale.totalRevenue.toLocaleString()}
            </ThemedText>
            <View
              style={[
                styles.profitChip,
                { backgroundColor: colors.green_soft },
              ]}
            >
              <ThemedText
                style={[styles.profitText, { color: colors.success }]}
              >
                +₦{sale.totalProfit.toLocaleString()}
              </ThemedText>
            </View>
            {sale.discount > 0 && (
              <View
                style={[
                  styles.profitChip,
                  { backgroundColor: colors.amber_soft },
                ]}
              >
                <ThemedText
                  style={[styles.profitText, { color: colors.warning }]}
                >
                  −₦{sale.discount.toLocaleString()}
                </ThemedText>
              </View>
            )}
          </View>
          {/* Collapsed meta */}
          {!expanded && (
            <View style={styles.metaRow}>
              {isMultiItem ? (
                <>
                  <ThemedText style={[styles.meta, { color: colors.text3 }]}>
                    {sale.items.length} products
                  </ThemedText>
                  <View
                    style={[styles.dot, { backgroundColor: colors.border }]}
                  />
                  <ThemedText style={[styles.meta, { color: colors.text3 }]}>
                    {sale.items.reduce((s, i) => s + i.quantity, 0)} units
                  </ThemedText>
                </>
              ) : (
                <>
                  <ThemedText style={[styles.meta, { color: colors.text3 }]}>
                    ×{sale.items[0].quantity}
                  </ThemedText>
                  <View
                    style={[styles.dot, { backgroundColor: colors.border }]}
                  />
                  <ThemedText style={[styles.meta, { color: colors.text3 }]}>
                    ₦{sale.items[0].sellingPriceAtSale.toLocaleString()} / unit
                  </ThemedText>
                </>
              )}
            </View>
          )}
          {/* Expanded line items */}
          {expanded && (
            <View
              style={[
                styles.lineItemsContainer,
                { borderColor: colors.border },
              ]}
            >
              {sale.items.map((item, index) => (
                <SaleLineItem
                  key={item.productId + index}
                  item={item}
                  isLast={index === sale.items.length - 1}
                  colors={colors}
                />
              ))}
            </View>
          )}
          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: colors.blue_soft }]}
              onPress={() =>
                router.push({
                  pathname: '/sales/[id]',
                  params: { id: sale.id },
                })
              }
            >
              <Ionicons
                name='receipt-outline'
                size={12}
                color={colors.primary}
              />
              <ThemedText
                style={[styles.actionBtnText, { color: colors.primary }]}
              >
                Receipt
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Right: payment icon badge + chevron ────────────────────────── */}
        <View style={styles.right}>
          <View
            style={[styles.statusBadge, { backgroundColor: colors.surface2 }]}
          >
            <Ionicons name={paymentIcon} size={13} color={colors.text3} />
          </View>
          <Ionicons
            name='chevron-forward'
            size={14}
            color={colors.text3}
            style={{ marginTop: 'auto' }}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    gap: 10,
    marginBottom: 10,
  },

  // ── Icon ───────────────────────────────────────────────────────────────────
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  // ── Info ───────────────────────────────────────────────────────────────────
  info: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  sub: {
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  revenue: {
    fontSize: 15,
    fontWeight: '700',
  },
  profitChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  profitText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Meta row ───────────────────────────────────────────────────────────────
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 12,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
  },

  // ── Line items ─────────────────────────────────────────────────────────────
  lineItemsContainer: {
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 2,
  },

  // ── Action buttons ─────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // ── Right ──────────────────────────────────────────────────────────────────
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  statusBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
