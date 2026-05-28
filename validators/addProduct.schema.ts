import * as yup from 'yup';

export const addProductSchema = yup.object({
  name: yup.string().trim().required('Product name is required'),
  category: yup.string().required('Please select a category'),
  unit: yup.string().required('Please select a unit type'),
  barcode: yup.string().optional(),
  costPrice: yup
    .number()
    .typeError('Enter a valid cost price')
    .min(1, 'Cost price must be greater than 0')
    .required('Cost price is required'),
  sellingPrice: yup
    .number()
    .typeError('Enter a valid selling price')
    .min(1, 'Selling price must be greater than 0')
    .moreThan(
      yup.ref('costPrice'),
      'Selling price must be greater than cost price',
    )
    .required('Selling price is required'),
  stock: yup
    .number()
    .typeError('Enter current stock quantity')
    .min(0, 'Stock cannot be negative')
    .required('Stock is required'),
  minStockAlert: yup
    .number()
    .typeError('Enter minimum stock alert level')
    .min(1, 'Minimum alert must be at least 1')
    .required('Minimum stock is required'),
});

export const editProductschema = yup.object({
  name: yup.string().trim().required('Product name is required'),
  category: yup.string().required('Please select a category'),
  unit: yup.string().required('Please select a unit type'),
  barcode: yup.string().optional(),
  cost_price: yup
    .number()
    .typeError('Enter a valid cost price')
    .min(1, 'Cost price must be greater than 0')
    .required('Cost price is required'),
  selling_price: yup
    .number()
    .typeError('Enter a valid selling price')
    .min(1, 'Selling price must be greater than 0')
    .moreThan(
      yup.ref('cost_price'),
      'Selling price must be greater than cost price',
    )
    .required('Selling price is required'),
  min_stock_alert: yup
    .number()
    .typeError('Enter minimum stock alert level')
    .min(1, 'Minimum alert must be at least 1')
    .required('Minimum stock is required'),
});
