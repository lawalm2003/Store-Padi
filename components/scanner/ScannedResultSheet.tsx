import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';

export type ScannedProduct = {
  barcode: string;
  name: string;
  brand: string;
  category: string;
  imageUrl?: string;
  localId?: string;
  stock?: number;
  sellingPrice?: number;
  costPrice?: number;
};

type Props = {
  barcode: string;
  loading: boolean;
  product: ScannedProduct | null;
  notFound: boolean;
  returnTo: 'AddProduct' | 'RecordSale' | undefined;
  onUseDetails: (product: ScannedProduct) => void;
  onAddToSale: (product: ScannedProduct) => void;
  onRescan: () => void;
  onAddProduct: (barcode: string) => void; // ← added
};

export function ScannedResultSheet({
  barcode,
  loading,
  product,
  notFound,
  returnTo,
  onUseDetails,
  onAddToSale,
  onRescan,
  onAddProduct, // ← added
}: Props) {
  const { colors } = useAppTheme();

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.stateWrap}>
        <ActivityIndicator color={colors.primary} size='small' />
        <ThemedText style={[styles.stateText, { color: colors.text3 }]}>
          Looking up barcode...
        </ThemedText>
      </View>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <View style={styles.stateWrap}>
        <Ionicons name='help-circle-outline' size={28} color={colors.warning} />
        <ThemedText style={[styles.stateText, { color: colors.text }]}>
          No product found for{' '}
          <ThemedText style={{ fontWeight: '700' }}>{barcode}</ThemedText>
        </ThemedText>
        <ThemedText style={[styles.stateSub, { color: colors.text3 }]}>
          You can still add this product manually
        </ThemedText>
        <View style={styles.rescanContainer}>
          <TouchableOpacity
            onPress={onRescan}
            style={[styles.rescanBtn, { backgroundColor: colors.surface2 }]}
          >
            <Ionicons name='scan-outline' size={15} color={colors.text} />
            <ThemedText style={[styles.rescanText, { color: colors.text }]}>
              Scan again
            </ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onAddProduct(barcode)}
            style={[styles.rescanBtn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name='add' size={15} color={colors.white} />
            <ThemedText style={[styles.rescanText, { color: colors.white }]}>
              Add Product
            </ThemedText>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const isLocal = !!product.localId;
  const inStock = (product.stock ?? 0) > 0;
  const canAddToSale = isLocal && inStock;

  return (
    <View style={styles.resultWrap}>
      <View style={styles.productRow}>
        <View style={[styles.iconBox, { backgroundColor: colors.surface2 }]}>
          <Ionicons name='cube-outline' size={22} color={colors.primary} />
        </View>
        <View style={styles.productInfo}>
          <ThemedText
            style={[styles.productName, { color: colors.text }]}
            numberOfLines={1}
          >
            {product.name}
          </ThemedText>
          <ThemedText style={[styles.productMeta, { color: colors.text3 }]}>
            {[product.brand, product.category].filter(Boolean).join('  ·  ')}
          </ThemedText>
        </View>
        {isLocal && (
          <View
            style={[
              styles.stockBadge,
              {
                backgroundColor: inStock ? colors.green_soft : colors.red_soft,
              },
            ]}
          >
            <ThemedText
              style={[
                styles.stockText,
                { color: inStock ? colors.success : colors.error },
              ]}
            >
              {inStock ? `${product.stock} in stock` : 'Out of stock'}
            </ThemedText>
          </View>
        )}
      </View>

      {isLocal && product.sellingPrice && (
        <View style={[styles.priceRow, { backgroundColor: colors.surface2 }]}>
          <View style={styles.priceItem}>
            <ThemedText style={[styles.priceLabel, { color: colors.text3 }]}>
              Cost
            </ThemedText>
            <ThemedText style={[styles.priceValue, { color: colors.text }]}>
              ₦{product.costPrice?.toLocaleString()}
            </ThemedText>
          </View>
          <View
            style={[styles.priceDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.priceItem}>
            <ThemedText style={[styles.priceLabel, { color: colors.text3 }]}>
              Selling
            </ThemedText>
            <ThemedText style={[styles.priceValue, { color: colors.primary }]}>
              ₦{product.sellingPrice.toLocaleString()}
            </ThemedText>
          </View>
          <View
            style={[styles.priceDivider, { backgroundColor: colors.border }]}
          />
          <View style={styles.priceItem}>
            <ThemedText style={[styles.priceLabel, { color: colors.text3 }]}>
              Profit
            </ThemedText>
            <ThemedText style={[styles.priceValue, { color: colors.success }]}>
              ₦
              {(
                (product.sellingPrice ?? 0) - (product.costPrice ?? 0)
              ).toLocaleString()}
            </ThemedText>
          </View>
        </View>
      )}

      <View style={styles.actions}>
        {returnTo === 'AddProduct' && (
          <TouchableOpacity
            onPress={() => onUseDetails(product)}
            style={[styles.btn, { backgroundColor: colors.primary }]}
          >
            <Ionicons name='create-outline' size={16} color='#FFF' />
            <ThemedText style={styles.btnText}>
              {isLocal ? 'Edit Product' : 'Use Details'}
            </ThemedText>
          </TouchableOpacity>
        )}

        {returnTo === 'RecordSale' && (
          <TouchableOpacity
            onPress={() => canAddToSale && onAddToSale(product)}
            disabled={!canAddToSale}
            style={[
              styles.btn,
              {
                backgroundColor: canAddToSale
                  ? colors.success
                  : colors.disabled,
              },
            ]}
          >
            <Ionicons name='cart-outline' size={16} color='#FFF' />
            <ThemedText style={styles.btnText}>
              {canAddToSale ? 'Add to Sale' : 'Not in Catalogue'}
            </ThemedText>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          onPress={onRescan}
          style={[
            styles.btn,
            styles.btnSecondary,
            { backgroundColor: colors.surface2 },
          ]}
        >
          <Ionicons name='scan-outline' size={16} color={colors.text} />
          <ThemedText style={[styles.btnText, { color: colors.text }]}>
            Rescan
          </ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stateWrap: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  stateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  stateSub: {
    fontSize: 12,
    textAlign: 'center',
  },
  rescanContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rescanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    marginTop: 4,
  },
  rescanText: {
    fontSize: 13,
    fontWeight: '500',
  },
  resultWrap: {
    gap: 12,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    gap: 3,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
  },
  productMeta: {
    fontSize: 12,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flexShrink: 0,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '600',
  },
  priceRow: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 12,
  },
  priceItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  priceLabel: {
    fontSize: 11,
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '700',
  },
  priceDivider: {
    width: 1,
    marginVertical: 2,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnSecondary: {
    flex: 0.6,
  },
  btnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
