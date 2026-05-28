import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type prop = {
  totalProduct: number;
  onAddProduct: () => void;
};

export default function ProductHeader({ totalProduct, onAddProduct }: prop) {
  const { colors } = useAppTheme();
  return (
    <View style={styles.header}>
      <View>
        <ThemedText style={[styles.title, { color: colors.text }]}>
          Products
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: colors.text3 }]}>
          {totalProduct} items in catalogue
        </ThemedText>
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.primary }]}
        onPress={onAddProduct}
        activeOpacity={0.85}
      >
        <Ionicons name='add' size={22} color='#FFFFFF' />
        <ThemedText style={[styles.addLabel, { color: colors.white }]}>
          Add Product
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  addBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  addLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
});
