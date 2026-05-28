import ProductCardSkeleton from '@/components/Loaders/ProductCardSkeleton';
import SalesCard from '@/components/sales/SalesCard';
import SalesPageHeader from '@/components/sales/SalesPageHeader';
import SalesSummary from '@/components/sales/SalesSummary';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useSales, useSalesSummary } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { Sale, SaleFilterPeriod } from '@/types';
import { getDateRange } from '@/utils/helper';
import { filterSales, groupByDate } from '@/utils/sales';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS: { label: string; value: SaleFilterPeriod }[] = [
  { label: 'All', value: 'all' },
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'this_week' },
  { label: 'This Month', value: 'this_month' },
];

export default function SalesScreen() {
  const { colors } = useAppTheme();
  const inset = useSafeAreaInsets();

  const { shop } = useAuth();
  const {
    data: sales = [],
    isLoading,
    isFetching,
    refetch: refetchSales,
  } = useSales(shop?.id);

  const [activeFilter, setActiveFilter] = useState<SaleFilterPeriod>('all');
  const [refreshing, setRefreshing] = useState(false);

  const { from, to } = useMemo(
    () => getDateRange(activeFilter),
    [activeFilter], // only recomputes when filter changes, not on every render
  );

  const { data: summary, refetch: refetchSummary } = useSalesSummary(
    shop?.id,
    from,
    to,
  );

  const filtered = filterSales(sales, activeFilter);
  const grouped = groupByDate(filtered);

  const totalRevenue = summary?.total_revenue ?? 0;
  const totalProfit = summary?.total_profit ?? 0;

  // Flatten grouped data into a single list with section headers
  type ListItem =
    | { type: 'header'; date: string }
    | { type: 'sale'; sale: Sale };

  const listData: ListItem[] = grouped.flatMap((group) => [
    { type: 'header', date: group.date },
    ...group.data.map((sale) => ({ type: 'sale' as const, sale })),
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchSales(), refetchSummary()]);
    } finally {
      setRefreshing(false);
    }
  }, [refetchSales, refetchSummary]);

  return (
    <ThemedView style={[styles.screen, { paddingTop: inset.top + 16 }]}>
      <SalesPageHeader totalTransactions={filtered.length} />

      <SalesSummary totalRevenue={totalRevenue} totalProfit={totalProfit} />

      {/* ── Filter tabs ───────────────────────────────────────────────── */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => {
          const active = f.value === activeFilter;
          return (
            <TouchableOpacity
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[
                styles.filterTab,
                {
                  backgroundColor: active ? colors.primary : colors.surface2,
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.filterLabel,
                  { color: active ? '#FFFFFF' : colors.text3 },
                ]}
              >
                {f.label}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Sales list ────────────────────────────────────────────────── */}
      <FlatList
        data={listData}
        keyExtractor={(item, index) =>
          item.type === 'header' ? `header-${index}` : item.sale.id
        }
        contentContainerStyle={[
          styles.list,
          listData.length === 0 && { flex: 1 },
        ]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          if (item.type === 'header') {
            return (
              <ThemedText
                style={[styles.sectionHeader, { color: colors.text3 }]}
              >
                {item.date}
              </ThemedText>
            );
          }
          return <SalesCard sale={item.sale} />;
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={() =>
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
                No sales found
              </ThemedText>
              <ThemedText
                style={[styles.emptySubtitle, { color: colors.text3 }]}
              >
                Try a different filter or record a sale
              </ThemedText>
            </View>
          )
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },

  // ── Header ───────────────────────────────────────────────────────────────────

  // ── Summary strip ─────────────────────────────────────────────────────────

  // ── Filter tabs ───────────────────────────────────────────────────────────
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '500',
  },

  // ── List ──────────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyState: {
    marginTop: 20,
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
