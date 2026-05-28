import useAppTheme from '@/hooks/useAppTheme';
import { useSearchProducts } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Modal,
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';

type Props = {
  visible: boolean;
  products: Product[];
  cartProductIds: string[];
  onSelect: (product: Product) => void;
  onClose: () => void;
  isLoadingProducts: boolean;
  isFetchingProducts: boolean;
};

const DEBOUNCE_MS = 500;

export function ProductSearchSheet({
  visible,
  products,
  cartProductIds,
  onSelect,
  onClose,
  isLoadingProducts,
  isFetchingProducts,
}: Props) {
  const { colors } = useAppTheme();
  const { shop } = useAuth();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<TextInput>(null);

  const inset = useSafeAreaInsets();

  // ── debounce ─────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // ── focus input on open ──────────────────
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQuery('');
      setDebouncedQuery('');
    }
  }, [visible]);

  const isSearching = debouncedQuery.length > 0;

  const {
    data: searchedProducts = [],
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
  } = useSearchProducts(shop?.id || '', debouncedQuery);

  const list = isSearching ? searchedProducts : products;

  const isLoading = isSearching ? isLoadingSearch : isLoadingProducts;
  const isFetching = isSearching ? isFetchingSearch : isFetchingProducts;

  function renderProduct({ item }: { item: Product }) {
    const inCart = cartProductIds.includes(item.id);
    const outOfStock = item.stock === 0;

    return (
      <TouchableOpacity
        onPress={() => {
          if (outOfStock) return;
          onSelect(item);
          Keyboard.dismiss();
        }}
        activeOpacity={0.7}
        style={[
          styles.productRow,
          { borderBottomColor: colors.border },
          outOfStock && { opacity: 0.4 },
        ]}
      >
        <View
          style={[styles.productIcon, { backgroundColor: colors.surface2 }]}
        >
          <Ionicons name='cube-outline' size={18} color={colors.text3} />
        </View>

        <View style={styles.productInfo}>
          <ThemedText
            numberOfLines={1}
            style={[styles.productName, { color: colors.text }]}
          >
            {item.name}
          </ThemedText>
          <ThemedText style={[styles.productMeta, { color: colors.text3 }]}>
            {item.category} · {item.stock} in stock
          </ThemedText>
        </View>

        <View style={styles.productRight}>
          <ThemedText style={[styles.productPrice, { color: colors.primary }]}>
            ₦{item.sellingPrice.toLocaleString()}
          </ThemedText>

          {inCart && (
            <View style={[styles.badge, { backgroundColor: colors.blue_soft }]}>
              <ThemedText style={{ color: colors.primary, fontSize: 10 }}>
                In cart
              </ThemedText>
            </View>
          )}

          {outOfStock && (
            <View style={[styles.badge, { backgroundColor: colors.red_soft }]}>
              <ThemedText style={{ color: colors.error, fontSize: 10 }}>
                Out of stock
              </ThemedText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <Modal visible={visible} animationType='slide' transparent>
      {/* Backdrop */}
      <Pressable
        style={styles.backdrop}
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      />

      {/* Sheet */}
      <ThemedView style={[styles.sheet, { backgroundColor: colors.card }]}>
        <TouchableOpacity activeOpacity={1} onPress={() => Keyboard.dismiss()}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          {/* Header */}
          <View style={styles.header}>
            <ThemedText
              style={{ fontSize: 16, fontWeight: '700', color: colors.text }}
            >
              Add Product
            </ThemedText>

            <TouchableOpacity onPress={onClose}>
              <Ionicons name='close' size={22} color={colors.text3} />
            </TouchableOpacity>
          </View>

          {/* Search */}
          <View
            style={[styles.search, { backgroundColor: colors.fixed_input_bg }]}
          >
            <Ionicons name='search-outline' size={16} color={colors.text3} />
            <TextInput
              ref={inputRef}
              value={query}
              onChangeText={setQuery}
              placeholder='Search products...'
              placeholderTextColor={colors.input_placeholder}
              style={[styles.input, { color: colors.text }]}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name='close-circle' size={16} color={colors.text3} />
              </TouchableOpacity>
            )}
          </View>

          {/* List */}
          <FlatList
            data={list}
            keyExtractor={(item) => item.id}
            renderItem={renderProduct}
            keyboardShouldPersistTaps='handled'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: inset.bottom + 120,
            }}
            onScrollBeginDrag={Keyboard.dismiss}
            ListEmptyComponent={
              isLoading || isFetching ? (
                <View style={{ marginTop: 16 }}>
                  <ActivityIndicator size='large' />
                </View>
              ) : (
                <View style={styles.empty}>
                  <Ionicons
                    name='search-outline'
                    size={40}
                    color={colors.border}
                  />
                  <ThemedText style={{ color: colors.text3 }}>
                    {isSearching
                      ? 'No matching products'
                      : 'No products available'}
                  </ThemedText>
                </View>
              )
            }
          />
        </TouchableOpacity>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },

  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    height: '80%',
  },

  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginVertical: 10,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 44,
    borderRadius: 10,
    marginBottom: 10,
    gap: 8,
  },

  input: {
    flex: 1,
    fontSize: 14,
  },

  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    gap: 12,
  },

  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  productInfo: {
    flex: 1,
  },

  productName: {
    fontSize: 14,
    fontWeight: '500',
  },

  productMeta: {
    fontSize: 12,
  },

  productRight: {
    alignItems: 'flex-end',
    gap: 4,
  },

  productPrice: {
    fontSize: 13,
    fontWeight: '700',
  },

  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },

  empty: {
    alignItems: 'center',
    marginTop: 40,
    gap: 8,
  },
});
