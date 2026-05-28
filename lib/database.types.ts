// Auto-generated from StorePadi Supabase schema
// Run: npx supabase gen types typescript --project-id ldoquhuzkkyntocuykkl > lib/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      shops: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          address: string | null;
          phone: string | null;
          currency: string;
          currency_symbol: string;
          low_stock_threshold_percent: number;
          receipt_footer: string | null;
          receipt_show_profit: boolean;
          receipt_paper_size: string;
          auto_backup: boolean;
          notify_stock_alerts: boolean;
          notify_daily_summary: boolean;
          notify_daily_summary_time: string;
          notify_restock_reminders: boolean;
          theme: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          address?: string | null;
          phone?: string | null;
          currency?: string;
          currency_symbol?: string;
          low_stock_threshold_percent?: number;
          receipt_footer?: string | null;
          receipt_show_profit?: boolean;
          receipt_paper_size?: string;
          auto_backup?: boolean;
          notify_stock_alerts?: boolean;
          notify_daily_summary?: boolean;
          notify_daily_summary_time?: string;
          notify_restock_reminders?: boolean;
          theme?: string;
        };
        Update: Partial<Database['public']['Tables']['shops']['Insert']>;
      };
      products: {
        Row: {
          id: string;
          shop_id: string;
          name: string;
          category: string;
          unit: string;
          barcode: string | null;
          cost_price: number;
          selling_price: number;
          stock: number;
          min_stock_alert: number;
          image_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          name: string;
          category?: string;
          unit?: string;
          barcode?: string | null;
          cost_price: number;
          selling_price: number;
          stock?: number;
          min_stock_alert?: number;
          image_url?: string | null;
        };
        Update: Partial<Database['public']['Tables']['products']['Insert']>;
      };
      sales: {
        Row: {
          id: string;
          shop_id: string;
          total_revenue: number;
          total_profit: number;
          discount: number;
          payment_method: string;
          customer_note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          shop_id: string;
          total_revenue: number;
          total_profit: number;
          discount?: number;
          payment_method?: string;
          customer_note?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['sales']['Insert']>;
      };
      sale_items: {
        Row: {
          id: string;
          sale_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          cost_price_at_sale: number;
          selling_price_at_sale: number;
          subtotal: number;
          profit: number;
        };
        Insert: {
          id?: string;
          sale_id: string;
          product_id?: string | null;
          product_name: string;
          quantity: number;
          cost_price_at_sale: number;
          selling_price_at_sale: number;
          subtotal: number;
          profit: number;
        };
        Update: Partial<Database['public']['Tables']['sale_items']['Insert']>;
      };
      stock_alerts: {
        Row: {
          id: string;
          shop_id: string;
          product_id: string;
          status: 'low_stock' | 'out_of_stock';
          current_stock: number;
          min_stock: number;
          suggested_order_qty: number;
          resolved: boolean;
          created_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['stock_alerts']['Row'],
          'id' | 'created_at'
        >;
        Update: Partial<Database['public']['Tables']['stock_alerts']['Insert']>;
      };
      restock_forecasts: {
        Row: {
          id: string;
          shop_id: string;
          product_id: string;
          daily_sales_rate: number;
          days_of_stock_left: number;
          suggested_order_qty: number;
          estimated_order_cost: number;
          urgency: 'critical' | 'urgent' | 'moderate' | 'ok';
          horizon_days: number;
          generated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['restock_forecasts']['Row'],
          'id'
        >;
        Update: Partial<
          Database['public']['Tables']['restock_forecasts']['Insert']
        >;
      };
      purchase_orders: {
        Row: {
          id: string;
          shop_id: string;
          total_estimated_cost: number;
          horizon_days: number;
          status: 'draft' | 'sent' | 'received';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database['public']['Tables']['purchase_orders']['Row'],
          'id' | 'created_at' | 'updated_at'
        >;
        Update: Partial<
          Database['public']['Tables']['purchase_orders']['Insert']
        >;
      };
      purchase_order_items: {
        Row: {
          id: string;
          purchase_order_id: string;
          product_id: string | null;
          product_name: string;
          quantity: number;
          estimated_unit_cost: number;
          estimated_total: number;
        };
        Insert: Omit<
          Database['public']['Tables']['purchase_order_items']['Row'],
          'id'
        >;
        Update: Partial<
          Database['public']['Tables']['purchase_order_items']['Insert']
        >;
      };
    };
  };
}
