import useAppTheme from '@/hooks/useAppTheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';

type Props = {
  query: string;
  onAddProduct: () => void;
};

export default function ProductEmptyState({ query, onAddProduct }: Props) {
  const { colors } = useAppTheme();

  const isSearch = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surface2 }]}>
        <Ionicons
          name={isSearch ? 'search-outline' : 'cube-outline'}
          size={36}
          color={colors.text3}
        />
      </View>

      <ThemedText style={[styles.title, { color: colors.text }]}>
        {isSearch ? `No results for "${query}"` : 'No products yet'}
      </ThemedText>

      <ThemedText style={[styles.subtitle, { color: colors.text3 }]}>
        {isSearch
          ? 'Try a different name or category'
          : 'Add your first product to start tracking inventory'}
      </ThemedText>

      {!isSearch && (
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: colors.primary }]}
          onPress={onAddProduct}
        >
          <Ionicons name='add' size={18} color='#FFFFFF' />
          <ThemedText style={styles.addBtnText}>Add First Product</ThemedText>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 12,
    paddingBottom: 60,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
