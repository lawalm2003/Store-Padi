import { useAuth } from '@/Providers/AuthContext';
import { useCart } from '@/Providers/CartProvider';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { CartItem } from '@/components/sales/CartItem';
import { ProductSearchSheet } from '@/components/sales/ProductSearchSheet';
import { SaleSummaryCard } from '@/components/sales/SaleSummaryCard';
import EmptyCart from '@/components/sales/recordSales/EmptyCart';
import RecordSaleFooter from '@/components/sales/recordSales/RecordSaleFooter';
import RecordSaleTopBar from '@/components/sales/recordSales/RecordSaleTopBar';
import useAppTheme from '@/hooks/useAppTheme';
import { useCreateSale, useProducts } from '@/hooks/useData';
import { mapSaleToDbCreate } from '@/mapper/sales.mapper';
import { PaymentMethod } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function RecordSaleScreen() {
  const { colors, dark } = useAppTheme();
  const router = useRouter();
  const { shop } = useAuth();

  const {
    data: products = [],
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useProducts(shop?.id);

  const { mutate, isPending } = useCreateSale(shop?.id || '');

  //  Cart + barcode scan data from context
  const {
    cart,
    addProduct,
    increment,
    decrement,
    remove,
    clearCart,
    subtotal,
    totalProfit,
    totalUnits,
    cartProductIds,
    totalRevenue,
    barcodeScanData,
    clearBarcodeScanData,
  } = useCart();

  const lastSeededId = useRef<string | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      const productId = barcodeScanData?.productId;
      if (!productId || productId === lastSeededId.current) return;

      lastSeededId.current = productId;
      const product = products.find((p) => p.id === productId);
      if (product && product.stock > 0) {
        addProduct(product);
      }
      // Clear scan data after consuming it so it doesn't re-seed on next focus
      clearBarcodeScanData();
    }, [barcodeScanData, products, addProduct, clearBarcodeScanData]),
  );

  // Local state
  const [showSearch, setShowSearch] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [customerNote, setCustomerNote] = useState('');

  const revenue = totalRevenue(discount);

  //  Clear cart with confirmation
  function handleClearCart() {
    Alert.alert('Clear Cart', 'Remove all items from this sale?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          clearCart();
          setDiscount(0);
          setCustomerNote('');
          lastSeededId.current = undefined;
        },
      },
    ]);
  }

  async function handleRecord() {
    if (!shop) return;
    if (cart.length === 0) return;

    const { sale, items } = mapSaleToDbCreate({
      shopId: shop.id,
      items: cart.map((e) => ({
        productId: e.product.id,
        productName: e.product.name,
        quantity: e.quantity,
        costPriceAtSale: e.product.costPrice,
        sellingPriceAtSale: e.product.sellingPrice,
      })),
      discount,
      paymentMethod,
      customerNote: customerNote.trim() || undefined,
    });

    mutate(
      { sale, items },
      {
        onSuccess: () => {
          clearCart();
          lastSeededId.current = undefined;
          setDiscount(0);
          setCustomerNote('');
          router.back();
        },
      },
    );
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <RecordSaleTopBar
        productCount={cart.length}
        clearCart={handleClearCart}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={[styles.sectionTitle, { color: colors.text }]}>
              Items{' '}
              {cart.length > 0 && (
                <ThemedText style={{ color: colors.text3, fontWeight: '400' }}>
                  ({cart.length} product{cart.length > 1 ? 's' : ''})
                </ThemedText>
              )}
            </ThemedText>

            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={() => setShowSearch(true)}
                style={[
                  styles.addItemBtn,
                  { backgroundColor: colors.blue_soft },
                ]}
              >
                <Ionicons name='add' size={15} color={colors.primary} />
                <ThemedText
                  style={[styles.addItemText, { color: colors.primary }]}
                >
                  Add
                </ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/scanner',
                    params: { returnTo: 'RecordSale' },
                  })
                }
                style={[
                  styles.scanBtn,
                  {
                    backgroundColor: colors.surface2,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Ionicons
                  name='barcode-outline'
                  size={17}
                  color={colors.text3}
                />
              </TouchableOpacity>
            </View>
          </View>

          {cart.length === 0 ? (
            <EmptyCart setShowSearch={() => setShowSearch(true)} />
          ) : (
            <View style={styles.cartList}>
              {cart.map((entry) => (
                <CartItem
                  key={entry.product.id}
                  entry={entry}
                  onIncrement={() => increment(entry.product.id)}
                  onDecrement={() => decrement(entry.product.id)}
                  onRemove={() => remove(entry.product.id)}
                />
              ))}
            </View>
          )}
        </View>

        {cart.length > 0 && (
          <SaleSummaryCard
            subtotal={subtotal}
            discount={discount}
            totalRevenue={revenue}
            totalProfit={totalProfit}
            paymentMethod={paymentMethod}
            customerNote={customerNote}
            onDiscountChange={setDiscount}
            onPaymentMethodChange={setPaymentMethod}
            onNoteChange={setCustomerNote}
          />
        )}
      </ScrollView>

      {cart.length > 0 && (
        <RecordSaleFooter
          totalRevenue={revenue}
          totalProfit={totalProfit}
          totalUnits={totalUnits}
          loading={isPending}
          handleRecord={handleRecord}
        />
      )}

      <ProductSearchSheet
        visible={showSearch}
        products={products}
        cartProductIds={cartProductIds}
        onSelect={(product) => {
          addProduct(product);
          setShowSearch(false);
        }}
        onClose={() => setShowSearch(false)}
        isLoadingProducts={isLoadingProduct}
        isFetchingProducts={isFetchingProduct}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 160,
    gap: 16,
  },
  section: { gap: 12 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  addItemBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  addItemText: { fontSize: 13, fontWeight: '600' },
  scanBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartList: { gap: 10 },
});
