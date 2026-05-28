import useAppTheme from '@/hooks/useAppTheme';
import { SaleItem } from '@/types';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../ThemedText';

// ── Single line item inside the card ─────────────────────────────────────────
export default function SaleLineItem({
  item,
  isLast,
  colors,
}: {
  item: SaleItem;
  isLast: boolean;
  colors: ReturnType<typeof useAppTheme>['colors'];
}) {
  return (
    <View
      style={[
        styles.lineItem,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border },
      ]}
    >
      {/* Bullet dot */}
      <View style={[styles.lineItemDot, { backgroundColor: colors.primary }]} />

      {/* Name + qty */}
      <View style={styles.lineItemLeft}>
        <ThemedText style={styles.lineItemName} numberOfLines={1}>
          {item.productName}
        </ThemedText>
        <ThemedText style={[styles.lineItemMeta, { color: colors.text3 }]}>
          ×{item.quantity} · ₦{item.sellingPriceAtSale.toLocaleString()} each
        </ThemedText>
      </View>

      {/* Subtotal + per-item profit */}
      <View style={styles.lineItemRight}>
        <ThemedText style={[styles.lineItemSubtotal, { color: colors.text }]}>
          ₦{item.subtotal.toLocaleString()}
        </ThemedText>
        <ThemedText style={[styles.lineItemProfit, { color: colors.success }]}>
          +₦{item.profit.toLocaleString()}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Expanded line items ──────────────────────────────────────────────────────

  lineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 8,
  },

  lineItemDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },

  lineItemLeft: {
    flex: 1,
    gap: 2,
  },

  lineItemName: {
    fontSize: 13,
    fontWeight: '500',
  },

  lineItemMeta: {
    fontSize: 11,
  },

  lineItemRight: {
    alignItems: 'flex-end',
    gap: 2,
  },

  lineItemSubtotal: {
    fontSize: 13,
    fontWeight: '600',
  },

  lineItemProfit: {
    fontSize: 11,
    fontWeight: '500',
  },
});
