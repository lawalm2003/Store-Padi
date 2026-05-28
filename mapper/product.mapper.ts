// mappers/product.mapper.ts

import { Product } from '@/types';

// ── DB → App ──────────────────────────────────────────────────────────────────
export function mapProductFromDb(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    barcode: row.barcode ?? undefined,
    costPrice: row.cost_price,
    sellingPrice: row.selling_price,
    stock: row.stock,
    minStockAlert: row.min_stock_alert,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── App → DB (insert) ─────────────────────────────────────────────────────────
// Omits id, created_at, updated_at — Supabase generates these automatically.
export function mapProductToDb(
  product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
  shopId: string,
) {
  return {
    shop_id: shopId,
    name: product.name.trim(),
    category: product.category.trim(),
    unit: product.unit.trim(),
    barcode: product.barcode?.trim() || null,
    cost_price: product.costPrice,
    selling_price: product.sellingPrice,
    stock: product.stock,
    min_stock_alert: product.minStockAlert,
  };
}

// ── App → DB (update) ─────────────────────────────────────────────────────────
// Accepts a partial product so callers only pass the fields they want to update.
export function mapProductUpdateToDb(
  product: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
) {
  const patch: Record<string, any> = {};

  if (product.name !== undefined) patch.name = product.name.trim();
  if (product.category !== undefined) patch.category = product.category.trim();
  if (product.unit !== undefined) patch.unit = product.unit.trim();
  if (product.barcode !== undefined)
    patch.barcode = product.barcode?.trim() || null;
  if (product.costPrice !== undefined) patch.cost_price = product.costPrice;
  if (product.sellingPrice !== undefined)
    patch.selling_price = product.sellingPrice;
  if (product.stock !== undefined) patch.stock = product.stock;
  if (product.minStockAlert !== undefined)
    patch.min_stock_alert = product.minStockAlert;

  return patch;
}
