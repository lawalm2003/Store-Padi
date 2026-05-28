import useAppTheme from '@/hooks/useAppTheme';
import { useStockAlerts } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { AlertWithProduct } from '@/services/dataServices';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  visible: boolean;
  onClose: () => void;
};

// ── Item ─────────────────────────────────────────────────────
function LowStockItem({
  alert,
  onRestock,
}: {
  alert: AlertWithProduct;
  onRestock: (alert: AlertWithProduct) => void;
}) {
  const { colors } = useAppTheme();

  const product = alert.products;
  if (!product) return null;

  const isOutOfStock = product.stock === 0;
  const statusColor = isOutOfStock ? colors.error : '#FAB41E';
  const statusBg = isOutOfStock ? colors.red_soft : colors.amber_soft;
  const statusLabel = isOutOfStock ? 'Out of Stock' : 'Low Stock';

  const stockPct = isOutOfStock
    ? 0
    : Math.min(product.stock / Math.max(product.min_stock_alert, 1), 1);

  return (
    <View style={[styles.item, { borderBottomColor: colors.border }]}>
      <View style={[styles.itemIcon, { backgroundColor: colors.surface2 }]}>
        <Ionicons name='cube-outline' size={22} color={colors.primary} />
      </View>

      <View style={styles.itemInfo}>
        <View style={styles.itemNameRow}>
          <ThemedText
            style={[styles.itemName, { color: colors.text }]}
            numberOfLines={1}
          >
            {product.name}
          </ThemedText>

          <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
            <ThemedText style={[styles.statusText, { color: statusColor }]}>
              {statusLabel}
            </ThemedText>
          </View>
        </View>

        <ThemedText style={[styles.itemCategory, { color: colors.text3 }]}>
          {product.category}
        </ThemedText>

        <View style={styles.stockRow}>
          <View style={[styles.barTrack, { backgroundColor: colors.surface2 }]}>
            <View
              style={[
                styles.barFill,
                {
                  width: `${Math.round(stockPct * 100)}%`,
                  backgroundColor: statusColor,
                },
              ]}
            />
          </View>
          <ThemedText style={[styles.stockCount, { color: colors.text3 }]}>
            {product.stock}/{product.min_stock_alert}
          </ThemedText>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.restockBtn, { backgroundColor: colors.blue_soft }]}
        onPress={() => onRestock(alert)}
      >
        <Ionicons name='add' size={14} color={colors.primary} />
        <ThemedText style={[styles.restockBtnText, { color: colors.primary }]}>
          Restock
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

export default function LowStockModal({ visible, onClose }: Props) {
  const { colors } = useAppTheme();
  const { shop } = useAuth();

  const { data: alerts = [], isLoading, isFetching } = useStockAlerts(shop?.id);

  function handleRestock(alert: AlertWithProduct) {
    onClose();

    if (alert.products?.id) {
      router.push({
        pathname: '/product/[id]',
        params: { id: alert.product_id },
      });
    }
  }

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      animationType='slide'
      presentationStyle='pageSheet'
    >
      <ThemedView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Ionicons name='warning-outline' size={20} color='#FAB41E' />
            <View>
              <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
                Low Stock
              </ThemedText>
              <ThemedText style={[styles.headerSub, { color: colors.text3 }]}>
                {alerts.length} product{alerts.length !== 1 ? 's' : ''} need
                restocking
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity onPress={onClose}>
            <Ionicons name='close' size={22} color={colors.text3} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {isLoading || isFetching ? (
          <View style={styles.center}>
            <ActivityIndicator size='large' />
          </View>
        ) : (
          <FlatList
            data={alerts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LowStockItem alert={item} onRestock={handleRestock} />
            )}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.center}>
                <Ionicons
                  name='checkmark-circle-outline'
                  size={48}
                  color={colors.success}
                />
                <ThemedText style={{ color: colors.text3 }}>
                  All products are well stocked
                </ThemedText>
              </View>
            }
          />
        )}
      </ThemedView>
    </Modal>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },

  headerSub: {
    fontSize: 12,
  },

  list: {
    paddingBottom: 20,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 0.5,
  },

  itemIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemInfo: {
    flex: 1,
    gap: 4,
  },

  itemNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemName: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },

  itemCategory: {
    fontSize: 11,
  },

  statusBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },

  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  barTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },

  barFill: {
    height: 4,
  },

  stockCount: {
    fontSize: 10,
    minWidth: 32,
    textAlign: 'right',
  },

  restockBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
  },

  restockBtnText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
