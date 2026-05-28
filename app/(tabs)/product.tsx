import { useAuth } from '@/Providers/AuthContext';
import ProductCardSkeleton from '@/components/Loaders/ProductCardSkeleton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProductCard from '@/components/product/ProductCard';
import ProductCategoryTabs, {
  CategoryFilter,
} from '@/components/product/ProductCategoryTabs';
import ProductEmptyState from '@/components/product/ProductEmptyState';
import ProductHeader from '@/components/product/ProductHeader';
import ProductSearchBar from '@/components/product/ProductSearchBar';
import ProductStatsStrip from '@/components/product/ProductStatsStrip';
import useAppTheme from '@/hooks/useAppTheme';
import { useProducts, useSearchProducts } from '@/hooks/useData';
import { Product } from '@/types';
import { useRouter } from 'expo-router';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Keyboard,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SortKey =
  | 'date_desc'
  | 'date_asc'
  | 'name'
  | 'price_asc'
  | 'price_desc'
  | 'stock_asc'
  | 'profit';

const DEBOUNCE_MS = 500;

export default function ProductsScreen() {
  const { colors } = useAppTheme();
  const router = useRouter();
  const inset = useSafeAreaInsets();
  const { shop } = useAuth();

  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [category, setCategory] = useState<CategoryFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('date_desc');

  // ── Debounce query ──────────────────────────────────────────────────────────
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query]);

  // ── Data fetching ───────────────────────────────────────────────────────────
  const {
    data: products = [],
    refetch: refetchProducts,
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
  } = useProducts(shop?.id);

  const {
    data: searchedProducts = [],
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    refetch: refetchSearch,
  } = useSearchProducts(shop?.id || '', debouncedQuery);

  const isSearching = debouncedQuery.length > 0;
  const isLoading = isLoadingProducts || (isSearching && isLoadingSearch);
  const isFetching = isFetchingProducts || (isSearching && isFetchingSearch);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      if (isSearching) {
        await Promise.all([refetchProducts(), refetchSearch()]);
      } else {
        await refetchProducts();
      }
    } finally {
      setRefreshing(false);
    }
  }, [refetchProducts, refetchSearch, isSearching]);

  // ── Filtered & sorted list ──────────────────────────────────────────────────
  const filtered = useMemo(() => {
    // Use search results when query is active, otherwise use all products
    let list = isSearching ? [...searchedProducts] : [...products];

    // Category filter applies in both modes
    if (category !== 'All') {
      list = list.filter((p) => p.category === category);
    }

    // Sort
    list.sort((a, b) => {
      switch (sortKey) {
        case 'date_asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );

        case 'date_desc':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case 'price_asc':
          return a.sellingPrice - b.sellingPrice;
        case 'price_desc':
          return b.sellingPrice - a.sellingPrice;
        case 'stock_asc':
          return a.stock - b.stock;
        case 'profit':
          return b.sellingPrice - b.costPrice - (a.sellingPrice - a.costPrice);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return list;
  }, [
    debouncedQuery,
    category,
    sortKey,
    products,
    searchedProducts,
    isSearching,
  ]);

  // ── Sort options ────────────────────────────────────────────────────────────
  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: 'date_desc', label: 'Date ↓' },
    { key: 'date_asc', label: 'Date ↑' },
    { key: 'name', label: 'Name A–Z' },
    { key: 'price_asc', label: 'Price ↑' },
    { key: 'price_desc', label: 'Price ↓' },
    { key: 'stock_asc', label: 'Stock ↑' },
    { key: 'profit', label: 'Profit ↓' },
  ];

  // ── Handlers ────────────────────────────────────────────────────────────────
  function handleEdit(product: Product) {
    router.push({
      pathname: '/edit-product',
      params: { id: product.id },
    });
  }
  function handleDetail(product: Product) {
    router.push({ pathname: '/product/[id]', params: { id: product.id } });
  }
  function handleAddProduct() {
    router.push('/add-product');
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ThemedView style={[styles.screen, { paddingTop: inset.top + 16 }]}>
        <View style={{ gap: 16 }}>
          <ProductHeader
            totalProduct={products.length}
            onAddProduct={handleAddProduct}
          />

          <ProductSearchBar
            value={query}
            onChangeText={setQuery}
            onFilterPress={() => {}}
          />

          <ProductCategoryTabs selected={category} onSelect={setCategory} />

          <ProductStatsStrip products={filtered} />

          {/* ── Sort row ───────────────────────────────────────────────────────── */}
          <FlatList
            data={SORT_OPTIONS}
            keyExtractor={(item) => item.key}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sortList}
            renderItem={({ item }) => {
              const active = sortKey === item.key;

              return (
                <TouchableOpacity
                  onPress={() => setSortKey(item.key)}
                  style={[
                    styles.sortChip,
                    {
                      backgroundColor: active
                        ? colors.primary
                        : colors.surface2,
                    },
                  ]}
                >
                  <ThemedText
                    style={{
                      fontSize: 12,
                      color: active ? '#fff' : colors.text3,
                      fontWeight: '500',
                    }}
                  >
                    {item.label}
                  </ThemedText>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* ── List ───────────────────────────────────────────────────────────── */}
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
          onScrollBeginDrag={Keyboard.dismiss}
          ListEmptyComponent={
            isLoading || isFetching ? (
              <ProductCardSkeleton />
            ) : (
              <ProductEmptyState
                query={query}
                onAddProduct={handleAddProduct}
              />
            )
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={handleDetail}
              onEdit={handleEdit}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </ThemedView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // ── Sort row ─────────────────────────────────────────────────────────────────
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  sortChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sortChipText: {
    fontSize: 11,
    fontWeight: '500',
  },

  // ── List ─────────────────────────────────────────────────────────────────────
  list: {
    paddingTop: 8,
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },

  sortList: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
});
