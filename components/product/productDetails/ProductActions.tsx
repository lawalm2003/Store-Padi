import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { useAdjustStock } from '@/hooks/useData';
import { useToggle } from '@/hooks/useToggle';
import { useAuth } from '@/Providers/AuthContext';
import { useCart } from '@/Providers/CartProvider';
import { ProductWithStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RestockSheet } from '../RestockSheet';

type Props = {
  product: ProductWithStatus;
  onEdit: () => void;
  onDelete: () => void;
};

export function ProductActions({ product, onEdit, onDelete }: Props) {
  const { colors } = useAppTheme();
  const { addProduct } = useCart();
  const { shop } = useAuth();

  const { mutate, isPending } = useAdjustStock(shop?.id || '');

  const { value, toggle } = useToggle();

  function confirmDelete() {
    Alert.alert(
      'Delete Product',
      `Remove "${product.name}" from your inventory? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: onDelete },
      ],
    );
  }

  const HandleRecordSale = () => {
    addProduct(product);
    router.push({
      pathname: '/record-sale',
    });
  };

  const confirmRestock = (qtyToAdd: number) => {
    mutate(
      { id: product.id, delta: qtyToAdd },
      {
        onSuccess: () => {
          toggle();
        },
      },
    );
  };
  const canSell = product.stock > 0;

  return (
    <View style={styles.container}>
      {/* Primary — Sell */}
      <TouchableOpacity
        style={[
          styles.sellBtn,
          { backgroundColor: canSell ? colors.primary : colors.disabled },
        ]}
        onPress={HandleRecordSale}
        disabled={!canSell}
        activeOpacity={0.8}
      >
        <Ionicons name='cart-outline' size={20} color='#FFFFFF' />
        <ThemedText style={styles.sellBtnText}>
          {canSell ? 'Record Sale' : 'Out of Stock'}
        </ThemedText>
      </TouchableOpacity>

      {/* Secondary row — Edit + Restock + Delete */}
      <View style={styles.secondaryRow}>
        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: colors.surface2 }]}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Ionicons name='create-outline' size={18} color={colors.text} />
          <ThemedText style={[styles.secondaryText, { color: colors.text }]}>
            Edit
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: colors.green_soft }]}
          activeOpacity={0.7}
          onPress={toggle}
        >
          <Ionicons
            name='add-circle-outline'
            size={18}
            color={colors.success}
          />
          <ThemedText style={[styles.secondaryText, { color: colors.success }]}>
            Restock
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, { backgroundColor: colors.red_soft }]}
          onPress={confirmDelete}
          activeOpacity={0.7}
        >
          <Ionicons name='trash-outline' size={18} color={colors.error} />
          <ThemedText style={[styles.secondaryText, { color: colors.error }]}>
            Delete
          </ThemedText>
        </TouchableOpacity>
      </View>
      <RestockSheet
        visible={value}
        onClose={toggle}
        onConfirm={confirmRestock}
        productName={product.name}
        currentStock={product.stock}
        unit={product.unit}
        loading={isPending}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 10,
  },
  sellBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
  },
  sellBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
  },
  secondaryText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
