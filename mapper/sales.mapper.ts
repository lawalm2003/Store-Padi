// mappers/sale.mapper.ts

import { Sale } from '@/types';

export function mapSaleFromDb(sale: any): Sale {
  return {
    id: sale.id,
    items: (sale.sale_items ?? []).map((item: any) => ({
      productId: item.product_id,
      productName: item.product_name,
      quantity: item.quantity,
      costPriceAtSale: item.cost_price_at_sale,
      sellingPriceAtSale: item.selling_price_at_sale,
      subtotal: item.subtotal,
      profit: item.profit,
    })),
    totalRevenue: sale.total_revenue,
    totalProfit: sale.total_profit,
    discount: sale.discount ?? 0,
    paymentMethod: sale.payment_method,
    customerNote: sale.customer_note ?? undefined,
    createdAt: sale.created_at,
  };
}

export function mapSaleToDbCreate(input: {
  shopId: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    costPriceAtSale: number;
    sellingPriceAtSale: number;
  }[];
  discount?: number;
  paymentMethod: 'cash' | 'transfer' | 'pos' | 'credit';
  customerNote?: string;
}) {
  const normalizedItems = input.items.map((item) => {
    const subtotal = item.sellingPriceAtSale * item.quantity;
    const profit =
      (item.sellingPriceAtSale - item.costPriceAtSale) * item.quantity;

    return {
      product_id: item.productId,
      product_name: item.productName,
      quantity: item.quantity,
      cost_price_at_sale: item.costPriceAtSale,
      selling_price_at_sale: item.sellingPriceAtSale,
      subtotal,
      profit,
    };
  });

  const totalRevenue = normalizedItems.reduce((sum, i) => sum + i.subtotal, 0);
  const totalProfit = normalizedItems.reduce((sum, i) => sum + i.profit, 0);

  return {
    sale: {
      shop_id: input.shopId,
      total_revenue: totalRevenue,
      total_profit: totalProfit,
      discount: input.discount ?? 0,
      payment_method: input.paymentMethod,
      customer_note: input.customerNote ?? null,
    },
    items: normalizedItems,
  };
}
