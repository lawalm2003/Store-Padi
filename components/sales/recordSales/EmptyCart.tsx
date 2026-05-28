import { ThemedText } from '@/components/ThemedText';
import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type Prop = {
  setShowSearch: () => void;
};

export default function EmptyCart({ setShowSearch }: Prop) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.emptyCart, { backgroundColor: colors.card }]}>
      <View
        style={[styles.emptyIconWrap, { backgroundColor: colors.surface2 }]}
      >
        <Ionicons name='cart-outline' size={40} color={colors.text3} />
      </View>
      <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
        Cart is empty
      </ThemedText>
      <ThemedText style={[styles.emptySubtitle, { color: colors.text3 }]}>
        {` Tap "Add Product" to start building this sale`}
      </ThemedText>
      <TouchableOpacity
        onPress={setShowSearch}
        style={[styles.emptyAddBtn, { backgroundColor: colors.blue_soft }]}
      >
        <Ionicons name='add' size={18} color={colors.primary} />
        <ThemedText style={[styles.emptyAddText, { color: colors.primary }]}>
          Add Product
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ── Empty cart ───────────────────────────────────────────────────────────────
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  emptyAddBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 4,
  },
  emptyAddText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
