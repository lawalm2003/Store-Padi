import { ProductCategory, ProductUnit } from '@/types';

export const CATEGORY_OPTIONS: {
  label: ProductCategory;
  value: ProductCategory;
}[] = [
  { label: 'Food', value: 'Food' },
  { label: 'Beverages', value: 'Beverages' },
  { label: 'Household', value: 'Household' },
  { label: 'Dairy', value: 'Dairy' },
  { label: 'Snacks', value: 'Snacks' },
  { label: 'Personal Care', value: 'Personal Care' },
  { label: 'General', value: 'General' },
];

export const UNIT_OPTIONS: { label: string; value: ProductUnit }[] = [
  { label: 'Piece', value: 'piece' },
  { label: 'Pack', value: 'pack' },
  { label: 'Box', value: 'box' },
  { label: 'Dozen', value: 'dozen' },
  { label: 'Kg', value: 'kg' },
  { label: 'Litre', value: 'litre' },
];
