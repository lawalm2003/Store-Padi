import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useDeleteProduct } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { Product, ProductWithStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import {
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ProductActions } from './ProductActions';
import { ProductDetailHeader } from './ProductDetailHeader';
import { ProductInfoBlock } from './ProductInfoBlock';
import { ProductStatsRow } from './ProductStatsRow';

// ── Derive ProductWithStatus from raw Product ──────────────────────────────────
function enrichProduct(p: Product): ProductWithStatus {
  const profitPerUnit = p.sellingPrice - p.costPrice;
  const marginPercent =
    p.sellingPrice > 0 ? (profitPerUnit / p.sellingPrice) * 100 : 0;
  const stockStatus =
    p.stock === 0
      ? 'out_of_stock'
      : p.stock <= p.minStockAlert
        ? 'low_stock'
        : 'in_stock';

  return { ...p, profitPerUnit, marginPercent, stockStatus };
}

// ── Props ─────────────────────────────────────────────────────────────────────
type Props = {
  product: Product;
};

export default function ProductDetailScreen({ product }: Props) {
  const { colors, dark } = useAppTheme();
  const { shop } = useAuth();
  const router = useRouter();
  const { mutate, isPending } = useDeleteProduct(shop?.id || '');

  const enriched = useMemo(() => enrichProduct(product), [product]);

  async function handleShare() {
    await Share.share({
      title: product.name,
      message: [
        `${product.name}`,
        `Category: ${product.category}`,
        `Selling Price: ₦${product.sellingPrice.toLocaleString()}`,
        `Stock: ${product.stock} units`,
        `Profit/unit: ₦${enriched.profitPerUnit.toLocaleString()} (${enriched.marginPercent.toFixed(1)}%)`,
        ``,
        `Powered by StorePadi`,
      ].join('\n'),
    });
  }

  const onDelete = (productId: string) => {
    mutate(productId, { onSuccess: () => router.back() });
  };

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Top bar ──────────────────────────────────────────────────────── */}
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name='arrow-back' size={22} color={colors.text} />
        </TouchableOpacity>

        <ThemedText style={styles.topTitle} numberOfLines={1}>
          Product
        </ThemedText>

        <TouchableOpacity
          onPress={handleShare}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Ionicons name='share-outline' size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Image + name + status */}
        <ProductDetailHeader product={enriched} />

        {/* 2. Stock bar + profit stats */}
        <ProductStatsRow product={enriched} />

        {/* 3. Full detail table */}
        <ProductInfoBlock product={enriched} />

        {/* 4. Action buttons */}
        <ProductActions
          product={enriched}
          onEdit={() =>
            router.push({
              pathname: '/edit-product',
              params: { id: product.id },
            })
          }
          onDelete={() => onDelete(product.id)}
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  scroll: {
    paddingTop: 24,
    paddingBottom: 48,
    gap: 16,
  },
});
