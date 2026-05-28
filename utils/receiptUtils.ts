// ── receiptUtils.ts ───────────────────────────────────────────────────────────
// Shared constants and pure helpers for the SaleReceipt feature.

import { Ionicons } from '@expo/vector-icons';

export const PAYMENT_ICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  cash: 'cash-outline',
  transfer: 'phone-portrait-outline',
  pos: 'card-outline',
  credit: 'book-outline',
};

export const PAYMENT_LABELS: Record<string, string> = {
  cash: 'Cash',
  transfer: 'Bank Transfer',
  pos: 'POS Terminal',
  credit: 'Credit',
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

export function formatMoney(n: number) {
  return '₦' + n.toLocaleString('en-NG');
}
