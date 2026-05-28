import useAppTheme from '@/hooks/useAppTheme';
import { useCart } from '@/Providers/CartProvider';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

// ── Helpers ───────────────────────────────────────────────────────────────────
function getStockStatus(product: Product) {
  if (product.stock === 0)
    return {
      label: 'Out of Stock',
      color: '#E84A4A',
      softKey: 'red_soft',
    } as const;
  if (product.stock <= product.minStockAlert)
    return {
      label: 'Low Stock',
      color: '#FAB41E',
      softKey: 'amber_soft',
    } as const;
  return {
    label: 'In Stock',
    color: '#1EB27C',
    softKey: 'green_soft',
  } as const;
}

function getMargin(product: Product) {
  if (product.sellingPrice === 0) return 0;
  return Math.round(
    ((product.sellingPrice - product.costPrice) / product.sellingPrice) * 100,
  );
}

function formatMoney(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}

// ── Types ─────────────────────────────────────────────────────────────────────
type Props = {
  product: Product;
  onPress: (product: Product) => void;
  onEdit: (product: Product) => void;
};

export default function ProductCard({ product, onPress, onEdit }: Props) {
  const { colors } = useAppTheme();
  const { addProduct } = useCart();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const status = getStockStatus(product);
  const margin = getMargin(product);
  const stockPct = Math.min(
    product.stock / Math.max(product.minStockAlert, 1),
    1,
  );
  const softBg = colors[status.softKey as keyof typeof colors] as string;

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

  const HandleRecordSale = () => {
    addProduct(product);
    router.push({
      pathname: '/record-sale',
    });
  };
  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card }]}
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {/* ── Left: icon placeholder ─────────────────────────────────────── */}
        <View style={[styles.iconBox, { backgroundColor: colors.surface2 }]}>
          <Ionicons name='cube-outline' size={26} color={colors.primary} />
        </View>

        {/* ── Centre: info ───────────────────────────────────────────────── */}
        <View style={styles.info}>
          {/* Name + category */}
          <View style={styles.nameRow}>
            <ThemedText
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {product.name}
            </ThemedText>
          </View>
          <ThemedText style={[styles.category, { color: colors.text3 }]}>
            {product.category} · {product.unit}
          </ThemedText>

          {/* Price row */}
          <View style={styles.priceRow}>
            <ThemedText style={[styles.price, { color: colors.primary }]}>
              {formatMoney(product.sellingPrice)}
            </ThemedText>
            <ThemedText style={[styles.margin, { color: colors.success }]}>
              +{margin}%
            </ThemedText>
            <ThemedText style={[styles.cost, { color: colors.text3 }]}>
              cost {formatMoney(product.costPrice)}
            </ThemedText>
          </View>

          {/* Stock bar */}
          <View style={styles.stockRow}>
            <View
              style={[styles.barTrack, { backgroundColor: colors.surface2 }]}
            >
              <View
                style={[
                  styles.barFill,
                  {
                    width: `${Math.round(stockPct * 100)}%`,
                    backgroundColor: status.color,
                  },
                ]}
              />
            </View>
            <ThemedText style={[styles.stockCount, { color: colors.text3 }]}>
              {product.stock}/{product.minStockAlert}
            </ThemedText>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[
                styles.sellBtn,
                {
                  backgroundColor:
                    product.stock === 0 ? colors.surface2 : colors.blue_soft,
                  opacity: product.stock === 0 ? 0.5 : 1,
                },
              ]}
              onPress={HandleRecordSale}
              disabled={product.stock === 0}
            >
              <Ionicons
                name='cart-outline'
                size={12}
                color={product.stock === 0 ? colors.text3 : colors.primary}
              />
              <ThemedText
                style={[
                  styles.sellBtnText,
                  {
                    color: product.stock === 0 ? colors.text3 : colors.primary,
                  },
                ]}
              >
                Sell 1
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.editBtn, { backgroundColor: colors.surface2 }]}
              onPress={() => onEdit(product)}
            >
              <Ionicons name='pencil-outline' size={12} color={colors.text3} />
              <ThemedText style={[styles.editBtnText, { color: colors.text3 }]}>
                Edit
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Right: status badge + chevron ──────────────────────────────── */}
        <View style={styles.right}>
          <View style={[styles.statusBadge, { backgroundColor: softBg }]}>
            <ThemedText style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </ThemedText>
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
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  category: {
    fontSize: 11,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  price: {
    fontSize: 15,
    fontWeight: '700',
  },
  margin: {
    fontSize: 11,
    fontWeight: '600',
  },
  cost: {
    fontSize: 11,
  },

  // ── Stock bar ──────────────────────────────────────────────────────────────
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: 4,
    borderRadius: 2,
    minWidth: 4,
  },
  stockCount: {
    fontSize: 10,
    minWidth: 36,
    textAlign: 'right',
  },

  // ── Action buttons ─────────────────────────────────────────────────────────
  actionRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  sellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  sellBtnText: {
    fontSize: 11,
    fontWeight: '600',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  editBtnText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // ── Right ──────────────────────────────────────────────────────────────────
  right: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
