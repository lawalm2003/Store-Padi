import useAppTheme from '@/hooks/useAppTheme';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

export type CartEntry = {
  product: Product;
  quantity: number;
};

type Props = {
  entry: CartEntry;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
};

export function CartItem({ entry, onIncrement, onDecrement, onRemove }: Props) {
  const { colors } = useAppTheme();
  const { product, quantity } = entry;
  const subtotal = product.sellingPrice * quantity;
  const profit = (product.sellingPrice - product.costPrice) * quantity;

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: colors.primary }]} />

      <View style={styles.content}>
        {/* Top row — name + remove */}
        <View style={styles.topRow}>
          <ThemedText
            style={[styles.name, { color: colors.text }]}
            numberOfLines={1}
          >
            {product.name}
          </ThemedText>
          <TouchableOpacity
            onPress={onRemove}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name='close-circle' size={18} color={colors.text3} />
          </TouchableOpacity>
        </View>

        {/* Middle row — unit price + stock warning */}
        <View style={styles.midRow}>
          <ThemedText style={[styles.unitPrice, { color: colors.text3 }]}>
            ₦{product.sellingPrice.toLocaleString()} / {product.unit}
          </ThemedText>
          {quantity >= product.stock && (
            <View
              style={[styles.stockWarn, { backgroundColor: colors.amber_soft }]}
            >
              <ThemedText
                style={[styles.stockWarnText, { color: colors.warning }]}
              >
                Max stock
              </ThemedText>
            </View>
          )}
        </View>

        {/* Bottom row — stepper + subtotal + profit */}
        <View style={styles.bottomRow}>
          {/* Stepper */}
          <View style={[styles.stepper, { backgroundColor: colors.surface2 }]}>
            <TouchableOpacity
              onPress={onDecrement}
              style={[styles.stepBtn, { opacity: quantity <= 1 ? 0.4 : 1 }]}
              disabled={quantity <= 1}
            >
              <Ionicons name='remove' size={16} color={colors.text} />
            </TouchableOpacity>

            <ThemedText style={[styles.qty, { color: colors.text }]}>
              {quantity}
            </ThemedText>

            <TouchableOpacity
              onPress={onIncrement}
              style={[
                styles.stepBtn,
                { opacity: quantity >= product.stock ? 0.4 : 1 },
              ]}
              disabled={quantity >= product.stock}
            >
              <Ionicons name='add' size={16} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Subtotal + profit */}
          <View style={styles.priceCol}>
            <ThemedText style={[styles.subtotal, { color: colors.text }]}>
              ₦{subtotal.toLocaleString()}
            </ThemedText>
            <ThemedText style={[styles.profit, { color: colors.success }]}>
              +₦{profit.toLocaleString()} profit
            </ThemedText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  accent: {
    width: 4,
  },
  content: {
    flex: 1,
    padding: 12,
    gap: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  midRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  unitPrice: {
    fontSize: 12,
  },
  stockWarn: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
  },
  stockWarnText: {
    fontSize: 10,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontSize: 15,
    fontWeight: '700',
    minWidth: 32,
    textAlign: 'center',
  },
  priceCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  subtotal: {
    fontSize: 15,
    fontWeight: '700',
  },
  profit: {
    fontSize: 11,
    fontWeight: '500',
  },
});
