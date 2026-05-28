import { CartEntry } from '@/components/sales/CartItem';
import { Product } from '@/types';
import React, { createContext, useCallback, useContext, useState } from 'react';

// ── Barcode scan data type ────────────────────────────────────────────────────
// Covers all call sites: full product info from scanner, partial pre-fill, or
// just a productId when jumping straight to Record Sale.
export type BarcodeScanData = {
  barcode?: string;
  name?: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  productId?: string; // localId of an existing product in the DB
  stock?: number;
  sellingPrice?: number;
  costPrice?: number;
};

// ── Types ─────────────────────────────────────────────────────────────────────
type CartContextType = {
  cart: CartEntry[];
  addProduct: (product: Product) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clearCart: () => void;
  // Derived
  totalRevenue: (discount: number) => number;
  totalProfit: number;
  subtotal: number;
  totalUnits: number;
  cartProductIds: string[];
  // Barcode scan context
  barcodeScanData: BarcodeScanData | null;
  setBarcodeScanData: (data: BarcodeScanData | null) => void;
  clearBarcodeScanData: () => void;
};

// ── Context ───────────────────────────────────────────────────────────────────
const CartContext = createContext<CartContextType | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [barcodeScanData, setBarcodeScanDataState] =
    useState<BarcodeScanData | null>(null);

  const setBarcodeScanData = useCallback((data: BarcodeScanData | null) => {
    setBarcodeScanDataState(data);
  }, []);

  const clearBarcodeScanData = useCallback(() => {
    setBarcodeScanDataState(null);
  }, []);

  const addProduct = useCallback((product: Product) => {
    setCart((prev) => {
      const idx = prev.findIndex((e) => e.product.id === product.id);
      if (idx >= 0) {
        return prev.map((e, i) =>
          i === idx
            ? { ...e, quantity: Math.min(e.quantity + 1, product.stock) }
            : e,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  }, []);

  const increment = useCallback((productId: string) => {
    setCart((prev) =>
      prev.map((e) =>
        e.product.id === productId
          ? { ...e, quantity: Math.min(e.quantity + 1, e.product.stock) }
          : e,
      ),
    );
  }, []);

  const decrement = useCallback((productId: string) => {
    setCart((prev) =>
      prev.map((e) =>
        e.product.id === productId
          ? { ...e, quantity: Math.max(e.quantity - 1, 1) }
          : e,
      ),
    );
  }, []);

  const remove = useCallback((productId: string) => {
    setCart((prev) => prev.filter((e) => e.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  // ── Derived values ──────────────────────────────────────────────────────────
  const subtotal = cart.reduce(
    (s, e) => s + e.product.sellingPrice * e.quantity,
    0,
  );
  const totalProfit = cart.reduce(
    (s, e) => s + (e.product.sellingPrice - e.product.costPrice) * e.quantity,
    0,
  );
  const totalUnits = cart.reduce((s, e) => s + e.quantity, 0);
  const cartProductIds = cart.map((e) => e.product.id);
  const totalRevenue = (discount: number) => Math.max(subtotal - discount, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addProduct,
        increment,
        decrement,
        remove,
        clearCart,
        totalRevenue,
        totalProfit,
        subtotal,
        totalUnits,
        cartProductIds,
        barcodeScanData,
        setBarcodeScanData,
        clearBarcodeScanData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
}
