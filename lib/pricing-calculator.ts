/**
 * Pricing Calculator Utility
 * Handles all pricing calculations including discounts, taxes, and totals
 */

import { PricingItem, PricingSectionData } from "@/types/pricing";

/**
 * Calculate subtotal for a single pricing item
 * Handles both percentage and fixed amount discounts
 */
export function calculateItemSubtotal(item: PricingItem): number {
  const baseTotal = item.quantity * item.unitPrice;
  let discountAmount = 0;
  let taxAmount = 0;

  // Calculate discount
  if (item.discount !== undefined && item.discount > 0) {
    // If discount is less than 100, treat as percentage
    // Otherwise treat as fixed amount
    if (item.discount < 100) {
      discountAmount = baseTotal * (item.discount / 100);
    } else {
      discountAmount = Math.min(item.discount, baseTotal); // Can't discount more than total
    }
  }

  const afterDiscount = baseTotal - discountAmount;

  // Calculate tax (applied after discount)
  if (item.tax !== undefined && item.tax > 0) {
    // If tax is less than 100, treat as percentage
    // Otherwise treat as fixed amount
    if (item.tax < 100) {
      taxAmount = afterDiscount * (item.tax / 100);
    } else {
      taxAmount = item.tax;
    }
  }

  return afterDiscount + taxAmount;
}

/**
 * Calculate all totals for a pricing section
 * This is the main math engine for pricing calculations
 */
export function calculatePricingTotal(
  data: PricingSectionData
): PricingSectionData {
  // Calculate item subtotals
  const itemsWithSubtotals = data.items.map((item) => ({
    ...item,
    subtotal: calculateItemSubtotal(item),
  }));

  // Calculate section subtotal (sum of all item subtotals)
  const subtotal = itemsWithSubtotals.reduce(
    (sum, item) => sum + item.subtotal,
    0
  );

  // Calculate section-level discount
  let discountAmount = 0;
  if (data.discountPercentage !== undefined && data.discountPercentage > 0) {
    discountAmount = subtotal * (data.discountPercentage / 100);
  } else if (data.discountAmount !== undefined && data.discountAmount > 0) {
    discountAmount = Math.min(data.discountAmount, subtotal);
  }

  // Calculate after discount
  const afterDiscount = subtotal - discountAmount;

  // Calculate section-level tax (applied after discount)
  let taxAmount = 0;
  if (data.taxPercentage !== undefined && data.taxPercentage > 0) {
    taxAmount = afterDiscount * (data.taxPercentage / 100);
  } else if (data.taxAmount !== undefined && data.taxAmount > 0) {
    taxAmount = data.taxAmount;
  }

  // Calculate final total
  const total = afterDiscount + taxAmount;

  return {
    ...data,
    items: itemsWithSubtotals,
    subtotal,
    discountAmount: discountAmount > 0 ? discountAmount : undefined,
    taxAmount: taxAmount > 0 ? taxAmount : undefined,
    total,
  };
}

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value: string): number {
  // Remove currency symbols and commas
  const cleaned = value.replace(/[^\d.-]/g, "");
  return parseFloat(cleaned) || 0;
}

/**
 * Validate pricing data
 */
export function validatePricingData(
  data: PricingSectionData
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validate items
  data.items.forEach((item, index) => {
    if (!item.description.trim()) {
      errors.push(`Item ${index + 1}: Description is required`);
    }
    if (item.quantity < 0) {
      errors.push(`Item ${index + 1}: Quantity cannot be negative`);
    }
    if (item.unitPrice < 0) {
      errors.push(`Item ${index + 1}: Unit price cannot be negative`);
    }
  });

  // Validate discount
  if (
    data.discountPercentage !== undefined &&
    (data.discountPercentage < 0 || data.discountPercentage > 100)
  ) {
    errors.push("Discount percentage must be between 0 and 100");
  }

  if (data.discountAmount !== undefined && data.discountAmount < 0) {
    errors.push("Discount amount cannot be negative");
  }

  // Validate tax
  if (
    data.taxPercentage !== undefined &&
    (data.taxPercentage < 0 || data.taxPercentage > 100)
  ) {
    errors.push("Tax percentage must be between 0 and 100");
  }

  if (data.taxAmount !== undefined && data.taxAmount < 0) {
    errors.push("Tax amount cannot be negative");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

