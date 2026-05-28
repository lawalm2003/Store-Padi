import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import useAppTheme from '@/hooks/useAppTheme';
import { useSales, useSalesSummary } from '@/hooks/useData';
import { useAuth } from '@/Providers/AuthContext';
import { ReportPeriod } from '@/types';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { PaymentBreakdownCard } from './PaymentBreakdownCard';
import { PeriodFilter } from './PeriodFilter';
import { ReportMetrics } from './ReportMetrics';
import { RevenueBarChart } from './RevenueBarChart';
import { TopProductsTable } from './TopProductsTable';

// ── Date range helpers ────────────────────────────────────────────────────────
function getDateRange(period: ReportPeriod): { from: string; to: string } {
  const now = new Date();
  const to = now.toISOString();

  if (period === 'today') {
    const from = new Date(now);
    from.setHours(0, 0, 0, 0);
    return { from: from.toISOString(), to };
  }
  if (period === 'this_week') {
    const from = new Date(now);
    from.setDate(now.getDate() - 7);
    return { from: from.toISOString(), to };
  }
  if (period === 'this_month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: from.toISOString(), to };
  }
  // custom — default to last 30 days
  const from = new Date(now);
  from.setDate(now.getDate() - 30);
  return { from: from.toISOString(), to };
}

// ── Derive daily data points from sales list ──────────────────────────────────
function buildDailyData(sales: any[], period: ReportPeriod) {
  const map: Record<string, { revenue: number; profit: number }> = {};

  sales.forEach((sale) => {
    const date = new Date(sale.created_at).toISOString().split('T')[0];
    if (!map[date]) map[date] = { revenue: 0, profit: 0 };
    map[date].revenue += Number(sale.total_revenue);
    map[date].profit += Number(sale.total_profit);
  });

  return Object.entries(map)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, vals]) => ({ date, ...vals }));
}

// ── Derive top products from sale items ───────────────────────────────────────
function buildTopProducts(sales: any[]) {
  const map: Record<
    string,
    {
      productId: string;
      productName: string;
      totalRevenue: number;
      totalProfit: number;
      totalUnitsSold: number;
    }
  > = {};

  sales.forEach((sale) => {
    (sale.sale_items ?? []).forEach((item: any) => {
      const key = item.product_id ?? item.product_name;
      if (!map[key]) {
        map[key] = {
          productId: item.product_id ?? key,
          productName: item.product_name,
          totalRevenue: 0,
          totalProfit: 0,
          totalUnitsSold: 0,
        };
      }
      map[key].totalRevenue += Number(item.subtotal);
      map[key].totalProfit += Number(item.profit);
      map[key].totalUnitsSold += Number(item.quantity);
    });
  });

  const products = Object.values(map)
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5);

  const maxProfit = products[0]?.totalProfit ?? 1;

  return products.map((p) => ({
    ...p,
    marginPercent:
      p.totalRevenue > 0 ? (p.totalProfit / p.totalRevenue) * 100 : 0,
    profitSharePercent: (p.totalProfit / maxProfit) * 100,
  }));
}

// ── Derive payment breakdown ──────────────────────────────────────────────────
function buildPaymentBreakdown(sales: any[]) {
  const map: Record<string, { count: number; revenue: number }> = {};

  sales.forEach((sale) => {
    const method = sale.payment_method ?? 'cash';
    if (!map[method]) map[method] = { count: 0, revenue: 0 };
    map[method].count += 1;
    map[method].revenue += Number(sale.total_revenue);
  });

  const total = Object.values(map).reduce((s, v) => s + v.revenue, 0) || 1;

  return Object.entries(map)
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .map(([method, vals]) => ({
      method,
      ...vals,
      percent: (vals.revenue / total) * 100,
    }));
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function ReportsScreen() {
  const { colors, dark } = useAppTheme();
  const { shop } = useAuth();
  const [period, setPeriod] = useState<ReportPeriod>('this_week');

  const { from, to } = getDateRange(period);

  // ── Data fetching ─────────────────────────────────────────────────────────
  const {
    data: salesData,
    isLoading: salesLoading,
    refetch: refetchSales,
    isRefetching,
  } = useSales(shop?.id);

  const {
    data: summary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useSalesSummary(shop?.id, from, to);

  const isLoading = salesLoading || summaryLoading;

  // ── Filter sales to current period ────────────────────────────────────────
  const filteredSales = useMemo(() => {
    if (!salesData) return [];
    const fromDate = new Date(from);
    const toDate = new Date(to);
    return salesData.filter((s) => {
      const d = new Date(s.createdAt);
      return d >= fromDate && d <= toDate;
    });
  }, [salesData, from, to]);

  // ── Derived data ──────────────────────────────────────────────────────────
  const dailyData = useMemo(
    () => buildDailyData(filteredSales, period),
    [filteredSales, period],
  );
  const topProducts = useMemo(
    () => buildTopProducts(filteredSales),
    [filteredSales],
  );
  const paymentBreakdown = useMemo(
    () => buildPaymentBreakdown(filteredSales),
    [filteredSales],
  );

  function handleRefresh() {
    refetchSales();
    refetchSummary();
  }

  return (
    <ThemedView style={[styles.screen, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <View style={[styles.pageHeader, { borderBottomColor: colors.border }]}>
        <ThemedText style={[styles.pageTitle, { color: colors.text }]}>
          Reports
        </ThemedText>
      </View>

      {isLoading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} size='large' />
          <ThemedText style={[styles.loadingText, { color: colors.text3 }]}>
            Loading report...
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
        >
          {/* ── Period filter ───────────────────────────────────────────── */}
          <PeriodFilter selected={period} onChange={setPeriod} />

          {/* ── Metric cards ────────────────────────────────────────────── */}
          <ReportMetrics
            totalRevenue={summary?.total_revenue ?? 0}
            totalProfit={summary?.total_profit ?? 0}
            totalUnitsSold={filteredSales.reduce(
              (s, sale) =>
                s +
                (sale.items ?? []).reduce(
                  (ss: number, i: any) => ss + Number(i.quantity),
                  0,
                ),
              0,
            )}
            averageOrderValue={
              filteredSales.length > 0
                ? Math.round(
                    (summary?.total_revenue ?? 0) / filteredSales.length,
                  )
                : 0
            }
            revenueChange={summary ? 12 : 0} // TODO: compute vs previous period
            profitChange={summary ? 8.4 : 0}
            unitsSoldChange={5}
            avgOrderChange={3}
          />

          {/* ── Revenue bar chart ────────────────────────────────────────── */}
          <RevenueBarChart data={dailyData} period={period} />

          {/* ── Top products ─────────────────────────────────────────────── */}
          <TopProductsTable products={topProducts} />

          {/* ── Payment breakdown ────────────────────────────────────────── */}
          <PaymentBreakdownCard data={paymentBreakdown} />

          {/* ── Empty state ──────────────────────────────────────────────── */}
          {filteredSales.length === 0 && !isLoading && (
            <View style={[styles.emptyCard, { backgroundColor: colors.card }]}>
              <ThemedText style={[styles.emptyTitle, { color: colors.text }]}>
                No sales this period
              </ThemedText>
              <ThemedText style={[styles.emptySub, { color: colors.text3 }]}>
                Record a sale to see your reports here
              </ThemedText>
            </View>
          )}
        </ScrollView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  scroll: {
    padding: 20,
    gap: 16,
    paddingBottom: 48,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  emptySub: {
    fontSize: 13,
    textAlign: 'center',
  },
});
