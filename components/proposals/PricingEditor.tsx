"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { PricingItem, PricingSectionData } from "@/types/pricing";
import {
  calculatePricingTotal,
  formatCurrency,
} from "@/lib/pricing-calculator";

interface PricingEditorProps {
  data?: PricingSectionData;
  onUpdate: (data: PricingSectionData) => void;
}

export default function PricingEditor({
  data,
  onUpdate,
}: PricingEditorProps) {
  const [pricingData, setPricingData] = useState<PricingSectionData>(
    data || {
      items: [],
      subtotal: 0,
      total: 0,
      currency: "USD",
    }
  );

  // Recalculate whenever input data changes
  useEffect(() => {
    const calculated = calculatePricingTotal(pricingData);
    setPricingData(calculated);
    onUpdate(calculated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // Only depend on input fields, not calculated outputs
    JSON.stringify(pricingData.items),
    pricingData.discountPercentage,
    pricingData.discountAmount,
    pricingData.taxPercentage,
    pricingData.taxAmount,
    pricingData.currency,
  ]);

  const addItem = () => {
    const newItem: PricingItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description: "",
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
    };
    setPricingData({
      ...pricingData,
      items: [...pricingData.items, newItem],
    });
  };

  const removeItem = (id: string) => {
    setPricingData({
      ...pricingData,
      items: pricingData.items.filter((item) => item.id !== id),
    });
  };

  const updateItem = (id: string, updates: Partial<PricingItem>) => {
    setPricingData({
      ...pricingData,
      items: pricingData.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Currency Selector */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Currency:
        </label>
        <select
          value={pricingData.currency || "USD"}
          onChange={(e) =>
            setPricingData({ ...pricingData, currency: e.target.value })
          }
          className="px-3 py-2 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="CAD">CAD ($)</option>
          <option value="AUD">AUD ($)</option>
          <option value="JPY">JPY (¥)</option>
        </select>
      </div>

      {/* Items Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-neutral-200 dark:border-neutral-700">
                <th className="text-left p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Description
                </th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Quantity
                </th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Unit Price
                </th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Discount
                </th>
                <th className="text-right p-3 text-sm font-semibold text-neutral-700 dark:text-neutral-300">
                  Subtotal
                </th>
                <th className="w-12 p-3"></th>
              </tr>
            </thead>
            <tbody>
              {pricingData.items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-neutral-500 dark:text-neutral-400">
                    No items yet. Click "Add Item" to get started.
                  </td>
                </tr>
              ) : (
                pricingData.items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <td className="p-3">
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, { description: e.target.value })
                        }
                        placeholder="Item description"
                        className="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={item.quantity || ""}
                        onChange={(e) =>
                          updateItem(item.id, {
                            quantity: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        step="0.01"
                        className="w-20 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={item.unitPrice || ""}
                        onChange={(e) =>
                          updateItem(item.id, {
                            unitPrice: parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        className="w-28 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                      />
                    </td>
                    <td className="p-3">
                      <input
                        type="number"
                        value={item.discount || ""}
                        onChange={(e) =>
                          updateItem(item.id, {
                            discount:
                              e.target.value === ""
                                ? undefined
                                : parseFloat(e.target.value) || 0,
                          })
                        }
                        min="0"
                        step="0.01"
                        placeholder="% or $"
                        className="w-24 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
                      />
                    </td>
                    <td className="p-3 text-right font-medium text-neutral-900 dark:text-neutral-100">
                      {formatCurrency(item.subtotal, pricingData.currency)}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded text-error-600 dark:text-error-400 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 border-t border-neutral-200 dark:border-neutral-800">
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>
      </Card>

      {/* Totals Section */}
      <Card>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-neutral-700 dark:text-neutral-300">Subtotal:</span>
            <span className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
              {formatCurrency(pricingData.subtotal, pricingData.currency)}
            </span>
          </div>

          {/* Discount */}
          <div className="flex items-center gap-4">
            <span className="text-neutral-700 dark:text-neutral-300 min-w-[80px]">
              Discount:
            </span>
            <div className="flex gap-2 flex-1 justify-end items-center">
              <input
                type="number"
                value={pricingData.discountPercentage || ""}
                onChange={(e) =>
                  setPricingData({
                    ...pricingData,
                    discountPercentage:
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value) || 0,
                    discountAmount: undefined,
                  })
                }
                placeholder="%"
                min="0"
                max="100"
                step="0.01"
                className="w-20 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
              />
              <span className="text-neutral-500 dark:text-neutral-400">or</span>
              <input
                type="number"
                value={pricingData.discountAmount || ""}
                onChange={(e) =>
                  setPricingData({
                    ...pricingData,
                    discountAmount:
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value) || 0,
                    discountPercentage: undefined,
                  })
                }
                placeholder="Amount"
                min="0"
                step="0.01"
                className="w-28 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
              />
            </div>
            {pricingData.discountAmount !== undefined &&
              pricingData.discountAmount > 0 && (
                <span className="font-medium text-error-600 dark:text-error-400 min-w-[100px] text-right">
                  -{formatCurrency(
                    pricingData.discountAmount,
                    pricingData.currency
                  )}
                </span>
              )}
          </div>

          {/* Tax */}
          <div className="flex items-center gap-4">
            <span className="text-neutral-700 dark:text-neutral-300 min-w-[80px]">
              Tax:
            </span>
            <div className="flex gap-2 flex-1 justify-end items-center">
              <input
                type="number"
                value={pricingData.taxPercentage || ""}
                onChange={(e) =>
                  setPricingData({
                    ...pricingData,
                    taxPercentage:
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value) || 0,
                    taxAmount: undefined,
                  })
                }
                placeholder="%"
                min="0"
                max="100"
                step="0.01"
                className="w-20 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
              />
              <span className="text-neutral-500 dark:text-neutral-400">or</span>
              <input
                type="number"
                value={pricingData.taxAmount || ""}
                onChange={(e) =>
                  setPricingData({
                    ...pricingData,
                    taxAmount:
                      e.target.value === ""
                        ? undefined
                        : parseFloat(e.target.value) || 0,
                    taxPercentage: undefined,
                  })
                }
                placeholder="Amount"
                min="0"
                step="0.01"
                className="w-28 px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 text-right"
              />
            </div>
            {pricingData.taxAmount !== undefined && pricingData.taxAmount > 0 && (
              <span className="font-medium text-success-600 dark:text-success-400 min-w-[100px] text-right">
                +{formatCurrency(pricingData.taxAmount, pricingData.currency)}
              </span>
            )}
          </div>

          <div className="border-t-2 border-neutral-200 dark:border-neutral-700 pt-4 flex justify-between items-center">
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Total:
            </span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {formatCurrency(pricingData.total, pricingData.currency)}
            </span>
          </div>
        </div>
      </Card>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Payment Terms & Notes
        </label>
        <textarea
          value={pricingData.notes || ""}
          onChange={(e) =>
            setPricingData({ ...pricingData, notes: e.target.value })
          }
          rows={3}
          placeholder="Payment terms, additional information, conditions..."
          className="w-full px-4 py-2 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
        />
      </div>
    </div>
  );
}

