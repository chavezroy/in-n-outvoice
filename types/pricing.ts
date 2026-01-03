/**
 * Pricing-related types for proposals
 */

export interface PricingItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount?: number; // Percentage (0-100) or fixed amount if > 100
  tax?: number; // Percentage (0-100) or fixed amount if > 100
  subtotal: number; // Calculated: (quantity * unitPrice) - discount + tax
}

export interface PricingSectionData {
  items: PricingItem[];
  subtotal: number; // Sum of all item subtotals
  discountAmount?: number; // Fixed discount amount
  discountPercentage?: number; // Percentage discount (0-100)
  taxAmount?: number; // Fixed tax amount
  taxPercentage?: number; // Percentage tax (0-100)
  total: number; // Final total: subtotal - discount + tax
  currency?: string; // Currency code (USD, EUR, etc.)
  notes?: string; // Additional notes or payment terms
}

