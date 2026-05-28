import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/database.types';

// ─────────────────────────────────────────────────────────────────────────────
// SHOP SERVICE
// ─────────────────────────────────────────────────────────────────────────────
type ShopRow    = Database['public']['Tables']['shops']['Row'];
type ShopUpdate = Database['public']['Tables']['shops']['Update'];

export async function getShop(ownerId: string): Promise<ShopRow | null> {
  const { data } = await supabase
    .from('shops')
    .select('*')
    .eq('owner_id', ownerId)
    .maybeSingle();
  return data;
}

export async function updateShop(
  shopId: string,
  payload: ShopUpdate
): Promise<ShopRow> {
  const { data, error } = await supabase
    .from('shops')
    .update(payload)
    .eq('id', shopId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ─────────────────────────────────────────────────────────────────────────────
// STOCK ALERTS SERVICE
// ─────────────────────────────────────────────────────────────────────────────
type AlertRow = Database['public']['Tables']['stock_alerts']['Row'];

export type AlertWithProduct = AlertRow & {
  products: Pick<
    Database['public']['Tables']['products']['Row'],
    'id' | 'name' | 'category' | 'stock' | 'min_stock_alert'
  > | null;
};

export async function getStockAlerts(shopId: string): Promise<AlertWithProduct[]> {
  const { data, error } = await supabase
    .from('stock_alerts')
    .select('*, products(id, name, category, stock, min_stock_alert)')
    .eq('shop_id', shopId)
    .eq('resolved', false)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as AlertWithProduct[];
}

export async function resolveAlert(alertId: string): Promise<void> {
  const { error } = await supabase
    .from('stock_alerts')
    .update({ resolved: true })
    .eq('id', alertId);
  if (error) throw error;
}

export async function resolveAllAlerts(shopId: string): Promise<void> {
  const { error } = await supabase
    .from('stock_alerts')
    .update({ resolved: true })
    .eq('shop_id', shopId);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// RESTOCK FORECAST SERVICE
// ─────────────────────────────────────────────────────────────────────────────
type ForecastRow = Database['public']['Tables']['restock_forecasts']['Row'];

export type ForecastWithProduct = ForecastRow & {
  products: Pick<
    Database['public']['Tables']['products']['Row'],
    'id' | 'name' | 'category' | 'stock' | 'cost_price'
  > | null;
};

export async function getForecasts(shopId: string): Promise<ForecastWithProduct[]> {
  const { data, error } = await supabase
    .from('restock_forecasts')
    .select('*, products(id, name, category, stock, cost_price)')
    .eq('shop_id', shopId)
    .order('generated_at', { ascending: false });
  if (error) throw error;
  return data as ForecastWithProduct[];
}

// Compute forecasts client-side from sales data and upsert to DB
export async function computeAndSaveForecasts(
  shopId: string,
  horizonDays: number = 14
): Promise<void> {
  // 1. Get all sales in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();
  const { data: items, error } = await supabase
    .from('sale_items')
    .select('product_id, quantity, sales(created_at, shop_id)')
    .eq('sales.shop_id', shopId)
    .gte('sales.created_at', thirtyDaysAgo);
  if (error) throw error;

  // 2. Aggregate daily rate per product
  const rateMap: Record<string, number> = {};
  for (const item of items ?? []) {
    if (!item.product_id) continue;
    rateMap[item.product_id] = (rateMap[item.product_id] ?? 0) + item.quantity;
  }

  // 3. Get current stock for those products
  const productIds = Object.keys(rateMap);
  if (productIds.length === 0) return;

  const { data: products } = await supabase
    .from('products')
    .select('id, stock, cost_price')
    .eq('shop_id', shopId)
    .in('id', productIds);

  // 4. Build forecast rows
  const forecasts = (products ?? []).map(p => {
    const totalSold   = rateMap[p.id] ?? 0;
    const dailyRate   = totalSold / 30;
    const daysLeft    = dailyRate > 0 ? Math.floor(p.stock / dailyRate) : 999;
    const orderQty    = Math.ceil(dailyRate * horizonDays);
    const orderCost   = orderQty * Number(p.cost_price);
    const urgency     =
      daysLeft === 0 ? 'critical' :
      daysLeft <= 3  ? 'urgent'   :
      daysLeft <= 7  ? 'moderate' : 'ok';

    return {
      shop_id:              shopId,
      product_id:           p.id,
      daily_sales_rate:     dailyRate,
      days_of_stock_left:   daysLeft,
      suggested_order_qty:  orderQty,
      estimated_order_cost: orderCost,
      urgency,
      horizon_days:         horizonDays,
      generated_at:         new Date().toISOString(),
    };
  });

  // 5. Upsert (delete old, insert new)
  await supabase
    .from('restock_forecasts')
    .delete()
    .eq('shop_id', shopId);

  if (forecasts.length > 0) {
    const { error: insertError } = await supabase
      .from('restock_forecasts')
      .insert(forecasts);
    if (insertError) throw insertError;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE ORDERS SERVICE
// ─────────────────────────────────────────────────────────────────────────────
type PORow    = Database['public']['Tables']['purchase_orders']['Row'];
type POInsert = Database['public']['Tables']['purchase_orders']['Insert'];
type POItemInsert = Database['public']['Tables']['purchase_order_items']['Insert'];

export type POWithItems = PORow & {
  purchase_order_items: Database['public']['Tables']['purchase_order_items']['Row'][];
};

export async function getPurchaseOrders(shopId: string): Promise<POWithItems[]> {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*, purchase_order_items(*)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as POWithItems[];
}

export async function createPurchaseOrder(
  order: Omit<POInsert, 'id' | 'created_at' | 'updated_at'>,
  items: Omit<POItemInsert, 'id' | 'purchase_order_id'>[]
): Promise<POWithItems> {
  const { data: po, error } = await supabase
    .from('purchase_orders')
    .insert(order)
    .select()
    .single();
  if (error) throw error;

  const { error: itemsError } = await supabase
    .from('purchase_order_items')
    .insert(items.map(i => ({ ...i, purchase_order_id: po.id })));
  if (itemsError) throw itemsError;

  const { data: full, error: fullError } = await supabase
    .from('purchase_orders')
    .select('*, purchase_order_items(*)')
    .eq('id', po.id)
    .single();
  if (fullError) throw fullError;
  return full as POWithItems;
}

export async function updatePOStatus(
  id: string,
  status: 'draft' | 'sent' | 'received'
): Promise<void> {
  const { error } = await supabase
    .from('purchase_orders')
    .update({ status })
    .eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SERVICE
// ─────────────────────────────────────────────────────────────────────────────
type ProfileRow    = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export async function getProfile(userId: string): Promise<ProfileRow | null> {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  return data;
}

export async function updateProfile(
  userId: string,
  payload: ProfileUpdate
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
