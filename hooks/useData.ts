import { Database } from '@/lib/database.types';
import { mapProductFromDb } from '@/mapper/product.mapper';
import { mapSaleFromDb } from '@/mapper/sales.mapper';
import {
  computeAndSaveForecasts,
  createPurchaseOrder,
  getForecasts,
  getProfile,
  getPurchaseOrders,
  getShop,
  getStockAlerts,
  resolveAlert,
  resolveAllAlerts,
  updatePOStatus,
  updateProfile,
  updateShop,
} from '@/services/dataServices';
import {
  adjustStock,
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  searchProducts,
  updateProduct,
} from '@/services/productServices';
import {
  CreateSalePayload,
  createSale,
  deleteSale,
  getSale,
  getSales,
  getSalesSummary,
} from '@/services/salesServices';
import { DashboardMetrics, Product, Sale } from '@/types';
import { calcGrowth, getWeekRange } from '@/utils/helper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner-native';

// ── Query key factory — keeps keys consistent everywhere ──────────────────────
export const QK = {
  shop: (ownerId: string) => ['shop', ownerId],
  profile: (userId: string) => ['profile', userId],
  products: (shopId: string) => ['products', shopId],
  product: (id: string) => ['product', id],
  sales: (shopId: string) => ['sales', shopId],
  sale: (id: string) => ['sale', id],
  summary: (shopId: string, from: string, to: string) => [
    'summary',
    shopId,
    from,
    to,
  ],
  alerts: (shopId: string) => ['alerts', shopId],
  forecasts: (shopId: string) => ['forecasts', shopId],
  orders: (shopId: string) => ['orders', shopId],
};

// ─────────────────────────────────────────────────────────────────────────────
// SHOP
// ─────────────────────────────────────────────────────────────────────────────
export function useShop(ownerId: string | undefined) {
  return useQuery({
    queryKey: QK.shop(ownerId ?? ''),
    queryFn: () => getShop(ownerId!),
    enabled: !!ownerId,
  });
}

export function useUpdateShop(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Database['public']['Tables']['shops']['Update']) =>
      updateShop(shopId, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QK.shop(data.owner_id) });
      toast.success('Shop updated');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Update failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE
// ─────────────────────────────────────────────────────────────────────────────
export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: QK.profile(userId ?? ''),
    queryFn: () => getProfile(userId!),
    enabled: !!userId,
  });
}

export function useUpdateProfile(userId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Database['public']['Tables']['profiles']['Update']) =>
      updateProfile(userId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.profile(userId) });
      toast.success('Profile updated');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Update failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────────────────────────────────────
export function useProducts(shopId: string | undefined) {
  return useQuery<Product[]>({
    queryKey: QK.products(shopId ?? ''),
    queryFn: async () => {
      const data = await getProducts(shopId!);
      return data.map(mapProductFromDb);
    },
    enabled: !!shopId,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: QK.product(id ?? ''),
    queryFn: async () => {
      const data = await getProduct(id!);
      return mapProductFromDb(data);
    },
    enabled: !!id,
  });
}

export function useSearchProducts(shopId: string, query: string) {
  return useQuery<Product[]>({
    queryKey: [...QK.products(shopId), 'search', query],
    queryFn: async () => {
      const data = await searchProducts(shopId, query);
      return data.map(mapProductFromDb);
    },
    enabled: !!shopId && query.length > 1,
  });
}

export function useCreateProduct(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      payload: Omit<
        Database['public']['Tables']['products']['Insert'],
        'id' | 'created_at' | 'updated_at'
      >,
    ) => createProduct(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.products(shopId) });
      qc.invalidateQueries({ queryKey: ['dashboard-stats', shopId] });

      toast.success('Product added');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to add product'),
  });
}

export function useUpdateProduct(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Database['public']['Tables']['products']['Update'];
    }) => updateProduct(id, payload),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: QK.products(shopId) });
      qc.invalidateQueries({ queryKey: QK.product(data.id) });
      toast.success('Product updated');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Update failed'),
  });
}

export function useDeleteProduct(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.products(shopId) });
      qc.invalidateQueries({ queryKey: ['dashboard-stats', shopId] });
      toast.success('Product deleted');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Delete failed'),
  });
}

export function useAdjustStock(shopId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, delta }: { id: string; delta: number }) =>
      adjustStock(id, delta),

    onSuccess: (data) => {
      // ── Invalidate all caches affected by a stock change ─────────────────
      qc.invalidateQueries({ queryKey: QK.products(shopId) });
      qc.invalidateQueries({ queryKey: QK.product(data.id) });
      qc.invalidateQueries({ queryKey: QK.alerts(shopId) });
      qc.invalidateQueries({ queryKey: QK.forecasts(shopId) });
      qc.invalidateQueries({ queryKey: ['dashboard-stats', shopId] });

      // ── Toast feedback based on direction of change ───────────────────────
      const added = data.stock;
      const wasLow = data.stock <= data.min_stock_alert;
      const wasOut = data.stock === 0;

      if (wasOut) {
        toast.error(`Still out of stock — add more units`);
      } else if (wasLow) {
        toast(`Stock updated to ${data.stock} units`, {
          description: 'Still below minimum alert level',
          icon: '⚠️',
        });
      } else {
        toast.success(`Stock updated to ${data.stock} units`);
      }
    },

    onError: (e: any) => {
      toast.error(e?.message ?? 'Failed to adjust stock');
    },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SALES
// ─────────────────────────────────────────────────────────────────────────────
export function useSales(shopId?: string) {
  return useQuery<Sale[]>({
    queryKey: ['sales', shopId],
    enabled: !!shopId,
    queryFn: async () => {
      const data = await getSales(shopId!);
      return data.map(mapSaleFromDb); // 👈 transformation here
    },
  });
}

export function useSale(id: string | undefined) {
  return useQuery({
    queryKey: QK.sale(id ?? ''),
    queryFn: async () => {
      const data = await getSale(id!);
      return mapSaleFromDb(data);
    },
    enabled: !!id,
  });
}

export function useSalesSummary(
  shopId: string | undefined,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: QK.summary(shopId ?? '', from, to),
    queryFn: () => getSalesSummary(shopId!, from, to),
    enabled: !!shopId && !!from && !!to,
  });
}

export function useCreateSale(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSalePayload) => createSale(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.sales(shopId) });
      qc.invalidateQueries({ queryKey: QK.products(shopId) });
      qc.invalidateQueries({ queryKey: QK.alerts(shopId) });
      qc.invalidateQueries({ queryKey: ['dashboard-stats', shopId] });

      toast.success('Sale recorded ✓');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to record sale'),
  });
}

export function useDeleteSale(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSale(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.sales(shopId) });
      qc.invalidateQueries({ queryKey: ['dashboard-stats', shopId] });
      toast.success('Sale deleted');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Delete failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCK ALERTS
// ─────────────────────────────────────────────────────────────────────────────
export function useStockAlerts(shopId: string | undefined) {
  return useQuery({
    queryKey: QK.alerts(shopId ?? ''),
    queryFn: () => getStockAlerts(shopId!),
    enabled: !!shopId,
    refetchInterval: 60_000, // refresh every 60s
  });
}

export function useResolveAlert(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: string) => resolveAlert(alertId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.alerts(shopId) });
    },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to resolve alert'),
  });
}

export function useResolveAllAlerts(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => resolveAllAlerts(shopId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.alerts(shopId) });
      toast.success('All alerts resolved');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTOCK FORECASTS
// ─────────────────────────────────────────────────────────────────────────────
export function useForecasts(shopId: string | undefined) {
  return useQuery({
    queryKey: QK.forecasts(shopId ?? ''),
    queryFn: () => getForecasts(shopId!),
    enabled: !!shopId,
  });
}

export function useRefreshForecasts(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (horizonDays?: number) =>
      computeAndSaveForecasts(shopId, horizonDays),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.forecasts(shopId) });
      toast.success('Forecasts updated');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Forecast failed'),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE ORDERS
// ─────────────────────────────────────────────────────────────────────────────
export function usePurchaseOrders(shopId: string | undefined) {
  return useQuery({
    queryKey: QK.orders(shopId ?? ''),
    queryFn: () => getPurchaseOrders(shopId!),
    enabled: !!shopId,
  });
}

export function useCreatePurchaseOrder(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      order,
      items,
    }: {
      order: Omit<
        Database['public']['Tables']['purchase_orders']['Insert'],
        'id' | 'created_at' | 'updated_at'
      >;
      items: Omit<
        Database['public']['Tables']['purchase_order_items']['Insert'],
        'id' | 'purchase_order_id'
      >[];
    }) => createPurchaseOrder(order, items),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.orders(shopId) });
      toast.success('Purchase order created');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Failed to create order'),
  });
}

export function useUpdatePOStatus(shopId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: 'draft' | 'sent' | 'received';
    }) => updatePOStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.orders(shopId) });
      toast.success('Order status updated');
    },
    onError: (e: any) => toast.error(e?.message ?? 'Update failed'),
  });
}

export function useDashboardStats(shopId: string | undefined) {
  return useQuery<DashboardMetrics>({
    queryKey: ['dashboard-stats', shopId],
    enabled: !!shopId,

    queryFn: async (): Promise<DashboardMetrics> => {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const thisWeek = getWeekRange(0);
      const lastWeek = getWeekRange(-1);

      const [
        salesSummary,
        todaySales,
        products,
        alerts,
        thisWeekSales,
        lastWeekSales,
      ] = await Promise.all([
        getSalesSummary(shopId!),
        getSalesSummary(
          shopId!,
          todayStart.toISOString(),
          new Date().toISOString(),
        ),
        getProducts(shopId!),
        getStockAlerts(shopId!),
        getSalesSummary(shopId!, thisWeek.from, thisWeek.to),
        getSalesSummary(shopId!, lastWeek.from, lastWeek.to),
      ]);

      const revenueGrowth = calcGrowth(
        thisWeekSales.total_revenue,
        lastWeekSales.total_revenue,
      );

      const profitMargin =
        salesSummary.total_revenue > 0
          ? (salesSummary.total_profit / salesSummary.total_revenue) * 100
          : 0;

      return {
        totalRevenue: salesSummary.total_revenue,
        totalProfit: salesSummary.total_profit,

        salesToday: todaySales.count,
        transactionsToday: todaySales.total_revenue,

        totalProducts: products.length,
        lowStockCount: alerts.length,

        revenueChangePercent: revenueGrowth,
        profitMarginPercent: profitMargin,
      };
    },
  });
}
