import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Prop = {
  productCount: number;
  clearCart: () => void;
};

export default function RecordSaleTopBar({ productCount, clearCart }: Prop) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
      <TouchableOpacity
        onPress={() => router.back()}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name='arrow-back' size={22} color={colors.text} />
      </TouchableOpacity>

      <View style={styles.topCenter}>
        <ThemedText style={styles.topTitle}>Record Sale</ThemedText>
        {productCount > 0 && (
          <View style={[styles.cartBadge, { backgroundColor: colors.primary }]}>
            <ThemedText style={styles.cartBadgeText}>{productCount}</ThemedText>
          </View>
        )}
      </View>

      {productCount > 0 ? (
        <TouchableOpacity
          onPress={clearCart}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ThemedText style={[styles.clearText, { color: colors.error }]}>
            Clear
          </ThemedText>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Top bar ──────────────────────────────────────────────────────────────────
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    borderBottomWidth: 0.5,
  },
  topCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  topTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cartBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  cartBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  clearText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
