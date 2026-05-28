import HomeContent from '@/components/home/HomeContent';
import HomeHeader from '@/components/home/HomeHeader';
import LowStockModal from '@/components/home/LowStockBottomSheet';
import ProductCardSkeleton from '@/components/Loaders/ProductCardSkeleton';
import SalesCard from '@/components/sales/SalesCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useDashboardStats, useSales } from '@/hooks/useData';
import { useToggle } from '@/hooks/useToggle';
import { useAuth } from '@/Providers/AuthContext';
import { DashboardMetrics } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const { colors } = useAppTheme();
  const { shop } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  // ── Data ─────────────────────────────────────────────
  const {
    data: sales = [],
    isLoading: salesLoading,
    isFetching: salesFetching,
    refetch: refetchSales,
  } = useSales(shop?.id);

  const {
    data: stats,
    isLoading: statsLoading,
    isFetching: statsFetching,
    refetch: refetchStats,
  } = useDashboardStats(shop?.id);

  const defaultStats: DashboardMetrics = {
    totalRevenue: 0,
    totalProfit: 0,
    totalProducts: 0,
    lowStockCount: 0,
    salesToday: 0,
    transactionsToday: 0,
    revenueChangePercent: 0,
    profitMarginPercent: 0,
  };
  const dashStats = stats ?? defaultStats;

  const recentSales = useMemo(() => sales.slice(0, 8), [sales]);

  const isLoading = salesLoading || statsLoading;
  const isFetching = salesFetching || statsFetching;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await Promise.all([refetchSales(), refetchStats()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchSales, refetchStats]);

  const { value, toggle } = useToggle();

  return (
    <ThemedView style={styles.container}>
      <HomeHeader shopName={shop?.name || ''} />

      <FlatList
        data={recentSales}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardSpacing}>
            <SalesCard sale={item} />
          </View>
        )}
        ListHeaderComponent={
          <>
            <HomeContent data={dashStats} onOpenModal={toggle} />

            <View style={styles.sectionHeader}>
              <ThemedText style={styles.sectionTitle}>Recent Sales</ThemedText>

              <TouchableOpacity onPress={() => router.push('/(tabs)/sale')}>
                <ThemedText style={[styles.seeAll, { color: colors.primary }]}>
                  See all
                </ThemedText>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
        scrollEnabled
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading || isFetching ? (
            <ProductCardSkeleton />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons
                name='receipt-outline'
                size={48}
                color={colors.border}
              />
              <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                No sales recorded
              </ThemedText>
              <ThemedText
                style={[styles.emptySubtitle, { color: colors.text3 }]}
              >
                Once you add a sale, it will appear here.
              </ThemedText>
            </View>
          )
        }
      />
      <LowStockModal visible={value} onClose={toggle} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    paddingBottom: 24,
  },

  cardSpacing: {
    paddingHorizontal: 16,
  },

  seeAll: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '500',
  },

  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },

  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
  },
});
