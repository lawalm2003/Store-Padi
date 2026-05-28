// ─────────────────────────────────────────────────────────────────────────────
// Open Food Facts lookup — returns name, brand, category from EAN barcode
// This is free, no API key needed, works well for Nigerian food/beverage products

import { ScannedProduct } from '@/components/scanner/ScannedResultSheet';
import { Product, SaleFilterPeriod } from '@/types';

export async function lookupBarcode(
  barcode: string,
  DUMMY_PRODUCTS: Product[],
): Promise<ScannedProduct | null> {
  try {
    // 1. Check local catalogue first (instant, no network)
    const local = DUMMY_PRODUCTS.find((p) => p.barcode === barcode);

    // 2. Query Open Food Facts for product name/brand/category
    const res = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
    );
    const json = await res.json();

    if (json.status === 1 && json.product) {
      const p = json.product;
      return {
        barcode,
        name: p.product_name || p.product_name_en || 'Unknown Product',
        brand: p.brands || '',
        category:
          p.categories_tags?.[0]?.replace('en:', '') ||
          local?.category ||
          'General',
        imageUrl: p.image_front_url || undefined,
        // Merge local catalogue data if matched
        localId: local?.id,
        stock: local?.stock,
        sellingPrice: local?.sellingPrice,
        costPrice: local?.costPrice,
      };
    }

    // 3. Open Food Facts had nothing — but product is in local catalogue
    if (local) {
      return {
        barcode,
        name: local.name,
        brand: '',
        category: local.category,
        localId: local.id,
        stock: local.stock,
        sellingPrice: local.sellingPrice,
        costPrice: local.costPrice,
      };
    }

    return null;
  } catch {
    // Network error — fall back to local catalogue only
    const local = DUMMY_PRODUCTS.find((p) => p.barcode === barcode);
    if (local) {
      return {
        barcode,
        name: local.name,
        brand: '',
        category: local.category,
        localId: local.id,
        stock: local.stock,
        sellingPrice: local.sellingPrice,
        costPrice: local.costPrice,
      };
    }
    return null;
  }
}

export function getDateRange(filter: SaleFilterPeriod) {
  const now = new Date();

  switch (filter) {
    case 'today': {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      return { from: start.toISOString(), to: now.toISOString() };
    }

    case 'this_week': {
      const start = new Date();
      start.setDate(now.getDate() - 7);
      return { from: start.toISOString(), to: now.toISOString() };
    }

    case 'this_month': {
      const start = new Date();
      start.setMonth(now.getMonth() - 1);
      return { from: start.toISOString(), to: now.toISOString() };
    }

    default:
      return {
        from: new Date(0).toISOString(),
        to: now.toISOString(),
      };
  }
}

export function getWeekRange(offset = 0) {
  const now = new Date();

  const start = new Date(now);
  start.setDate(now.getDate() - now.getDay() + offset * 7);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(start.getDate() + 7);

  return {
    from: start.toISOString(),
    to: end.toISOString(),
  };
}

export function calcGrowth(current: number, prev: number) {
  if (!prev) return 0;
  return ((current - prev) / prev) * 100;
}
