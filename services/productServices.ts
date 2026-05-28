import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';

type ProductRow = Database['public']['Tables']['products']['Row'];
type ProductInsert = Database['public']['Tables']['products']['Insert'];
type ProductUpdate = Database['public']['Tables']['products']['Update'];

// ── Fetch all products for a shop ─────────────────────────────────────────────
export async function getProducts(shopId: string): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

// ── Fetch single product ──────────────────────────────────────────────────────
export async function getProduct(id: string): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

// ── Create product ────────────────────────────────────────────────────────────
export async function createProduct(
  payload: Omit<ProductInsert, 'id' | 'created_at' | 'updated_at'>,
): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .insert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Update product ────────────────────────────────────────────────────────────
export async function updateProduct(
  id: string,
  payload: ProductUpdate,
): Promise<ProductRow> {
  const { data, error } = await supabase
    .from('products')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// ── Delete product ────────────────────────────────────────────────────────────
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

// ── Search products by name or barcode ───────────────────────────────────────
export async function searchProducts(
  shopId: string,
  query: string,
): Promise<ProductRow[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('shop_id', shopId)
    .or(`name.ilike.%${query}%,barcode.eq.${query}`)
    .order('name');
  if (error) throw error;
  return data;
}

// ── Adjust stock (increment / decrement) ─────────────────────────────────────
export async function adjustStock(
  id: string,
  delta: number,
): Promise<ProductRow> {
  const { data, error } = await supabase
    .rpc('adjust_product_stock', {
      p_product_id: id,
      p_delta: delta,
    })
    .single();

  if (error) throw error;
  return data as ProductRow;
}
