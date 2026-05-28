import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

type SaleRow = Database['public']['Tables']['sales']['Row'];
type SaleInsert = Database['public']['Tables']['sales']['Insert'];
type SaleItemInsert = Database['public']['Tables']['sale_items']['Insert'];

export type SaleWithItems = SaleRow & {
  sale_items: Database['public']['Tables']['sale_items']['Row'][];
};

export type CreateSalePayload = {
  sale: Omit<SaleInsert, 'id'>;
  items: Omit<SaleItemInsert, 'id' | 'sale_id'>[];
};

// ── Fetch all sales for a shop ─────────────────────────────────────────────
export async function getSales(
  shopId: string,
  limit = 50,
): Promise<SaleWithItems[]> {
  const { data, error } = await supabase
    .from('sales')
    .select('*, sale_items(*)')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as SaleWithItems[];
}

// ── Fetch single sale with items ──────────────────────────────────────────
export async function getSale(id: string): Promise<SaleWithItems> {
  const { data, error } = await supabase
    .from('sales')
    .select('*, sale_items(*)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as SaleWithItems;
}

// ── Create sale + items in one transaction ────────────────────────────────
// Decrements product stock for each item automatically
export async function createSale(
  payload: CreateSalePayload,
): Promise<SaleWithItems> {
  // 1. Insert sale
  const { data: sale, error: saleError } = await supabase
    .from('sales')
    .insert(payload.sale)
    .select()
    .single();
  if (saleError) throw saleError;

  // 2. Insert all sale items
  const itemsWithSaleId: SaleItemInsert[] = payload.items.map((item) => ({
    ...item,
    sale_id: sale.id,
  }));

  const { error: itemsError } = await supabase
    .from('sale_items')
    .insert(itemsWithSaleId);
  if (itemsError) throw itemsError;

  // 3. Decrement stock for each product
  for (const item of payload.items) {
    if (!item.product_id) continue;
    const { data: product } = await supabase
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single();

    if (product) {
      await supabase
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq('id', item.product_id);
    }
  }

  // 4. Return sale with items
  return getSale(sale.id);
}

// ── Delete a sale ─────────────────────────────────────────────────────────
export async function deleteSale(id: string): Promise<void> {
  const { error } = await supabase.from('sales').delete().eq('id', id);
  if (error) throw error;
}

// ── Sales summary for a date range ────────────────────────────────────────
export async function getSalesSummary(
  shopId: string,
  from?: string,
  to?: string,
) {
  let query = supabase
    .from('sales')
    .select('total_revenue, total_profit', { count: 'exact' })
    .eq('shop_id', shopId);

  if (from) {
    query = query.gte('created_at', from);
  }

  if (to) {
    query = query.lte('created_at', to);
  }

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    total_revenue: data?.reduce((s, r) => s + Number(r.total_revenue), 0) ?? 0,
    total_profit: data?.reduce((s, r) => s + Number(r.total_profit), 0) ?? 0,
    count: count ?? 0,
  };
}
