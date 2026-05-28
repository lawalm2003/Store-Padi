// ─────────────────────────────────────────────────────────────────────────────
// Smart Inventory — Model Types
// Covers: Products, Sales, Alerts, Reports, Restock, Barcodes, Settings
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProductUnit = 'piece' | 'pack' | 'box' | 'dozen' | 'kg' | 'litre';

export type ProductCategory =
  | 'Food'
  | 'Beverages'
  | 'Household'
  | 'Dairy'
  | 'Snacks'
  | 'Personal Care'
  | 'General';

export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock';

export type PaymentMethod = 'cash' | 'transfer' | 'pos' | 'credit';

export type AlertUrgency = 'critical' | 'urgent' | 'moderate' | 'ok';

export type RestockHorizon = 7 | 14 | 30; // days

export type ReportPeriod = 'today' | 'this_week' | 'this_month' | 'custom';

export type SaleFilterPeriod = 'all' | 'today' | 'this_week' | 'this_month';

export type NotificationType =
  | 'stock_alert'
  | 'daily_summary'
  | 'restock_reminder';

// ─── Core Models ──────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  unit: ProductUnit;
  barcode?: string; // optional — from barcode scanner screen
  costPrice: number; // in NGN (₦)
  sellingPrice: number; // in NGN (₦)
  stock: number; // current quantity
  minStockAlert: number; // threshold for low stock alert
  imageUri?: string; // local or remote image
  createdAt: string; // ISO date string
  updatedAt: string;
}

export interface ProductWithStatus extends Product {
  stockStatus: StockStatus;
  profitPerUnit: number; // sellingPrice - costPrice
  marginPercent: number; // (profit / sellingPrice) * 100
  daysOfStockLeft?: number; // from restock forecast
}

// ─── Sales ────────────────────────────────────────────────────────────────────

export interface SaleItem {
  productId: string;
  productName: string;
  quantity: number;
  costPriceAtSale: number; // snapshot of cost price at time of sale
  sellingPriceAtSale: number; // snapshot of sell price at time of sale
  subtotal: number; // quantity * sellingPriceAtSale
  profit: number; // quantity * (selling - cost)
}

export interface Sale {
  id: string;
  items: SaleItem[]; // supports multi-item cart (future)
  totalRevenue: number;
  totalProfit: number;
  discount: number; // flat amount in NGN
  paymentMethod: PaymentMethod;
  customerNote?: string;
  createdAt: string; // ISO date string
}

// ─── Alerts ───────────────────────────────────────────────────────────────────

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  currentStock: number;
  minStock: number;
  status: 'out_of_stock' | 'low_stock';
  suggestedOrderQty: number; // shown on alerts screen
  createdAt: string;
}

// ─── Restock Forecast ─────────────────────────────────────────────────────────

export interface RestockForecast {
  productId: string;
  productName: string;
  dailySalesRate: number; // avg units sold per day
  currentStock: number;
  daysOfStockLeft: number;
  suggestedOrderQty: number; // for selected horizon (7/14/30 days)
  estimatedOrderCost: number; // suggestedOrderQty * costPrice
  urgency: AlertUrgency;
  horizon: RestockHorizon;
}

export interface PurchaseOrder {
  id: string;
  items: PurchaseOrderItem[];
  totalEstimatedCost: number;
  horizon: RestockHorizon;
  createdAt: string;
  status: 'draft' | 'sent' | 'received';
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  estimatedUnitCost: number;
  estimatedTotal: number;
}

// ─── Reports / Analytics ──────────────────────────────────────────────────────

export interface ReportSummary {
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  totalRevenue: number;
  totalProfit: number;
  totalUnitsSold: number;
  averageOrderValue: number;
  revenueChange: number; // % vs previous period (positive = up)
  profitChange: number;
  unitsSoldChange: number;
  avgOrderChange: number;
}

export interface DailyRevenuePoint {
  date: string; // ISO date string
  revenue: number;
  profit: number;
  unitsSold: number;
}

export interface TopProduct {
  productId: string;
  productName: string;
  totalRevenue: number;
  totalProfit: number;
  totalUnitsSold: number;
  marginPercent: number;
  profitSharePercent: number; // % of total profit (for bar width)
}

export interface Report {
  summary: ReportSummary;
  dailyData: DailyRevenuePoint[];
  topProducts: TopProduct[];
}

// ─── Barcode ──────────────────────────────────────────────────────────────────

export interface BarcodeResult {
  barcode: string;
  format: 'EAN13' | 'EAN8' | 'QR' | 'CODE128' | 'CODE39' | 'UPC' | 'unknown';
  matchedProduct?: Product; // null if not in catalogue
  scannedAt: string;
}

// ─── Settings / Shop ─────────────────────────────────────────────────────────

export interface ShopProfile {
  name: string;
  ownerName: string;
  email: string;
  phone?: string;
  address?: string;
  logoUri?: string;
}

export interface AppSettings {
  shop: ShopProfile;
  currency: 'NGN' | 'USD' | 'GBP' | 'EUR' | 'GHS' | 'KES';
  currencySymbol: string; // e.g. '₦'
  lowStockThresholdPercent: number; // default 20% — global fallback
  notifications: NotificationSettings;
  backup: BackupSettings;
  theme: 'light' | 'dark' | 'system';
  connectedDevices: number;
}

export interface NotificationSettings {
  stockAlerts: boolean;
  dailySummary: boolean;
  dailySummaryTime: string; // e.g. '08:00'
  restockReminders: boolean;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupTime: string; // e.g. '00:00'
  lastBackupAt?: string; // ISO date string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardMetrics {
  totalRevenue: number;
  totalProfit: number;
  totalProducts: number;
  lowStockCount: number;
  salesToday: number;
  transactionsToday: number;
  revenueChangePercent: number;
  profitMarginPercent: number;
}

// ─── Navigation / UI State ────────────────────────────────────────────────────

export type RootStackParamList = {
  Dashboard: undefined;
  Products: undefined;
  AddProduct: { productId?: string }; // productId when editing
  RecordSale: { productId?: string }; // pre-select a product
  SaleHistory: undefined;
  StockAlerts: undefined;
  Reports: undefined;
  RestockForecast: undefined;
  BarcodeScanner: { returnTo: 'AddProduct' | 'RecordSale' };
  Settings: undefined;
};
