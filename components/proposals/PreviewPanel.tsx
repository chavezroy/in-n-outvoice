"use client";

import { Proposal } from "@/types/proposal";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/pricing-calculator";

interface PreviewPanelProps {
  proposal: Proposal;
}

export default function PreviewPanel({ proposal }: PreviewPanelProps) {
  return (
    <div className="h-full overflow-y-auto bg-neutral-50 dark:bg-neutral-950 p-6">
      <div className="max-w-4xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-lg p-8">
        {/* Proposal Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            {proposal.title}
          </h1>
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Created: {new Date(proposal.createdAt).toLocaleDateString()}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {proposal.sections.map((section) => (
            <Card key={section.id} padding="lg">
              <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                {section.title}
              </h2>

              {/* Render pricing table if it's a pricing section with structured data */}
              {section.type === "pricing" && section.pricingData ? (
                <div className="space-y-4">
                  {section.pricingData.items && section.pricingData.items.length > 0 ? (
                    <>
                      {/* Pricing Table */}
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
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
                            </tr>
                          </thead>
                          <tbody>
                            {section.pricingData.items.map((item) => (
                              <tr
                                key={item.id}
                                className="border-b border-neutral-100 dark:border-neutral-800"
                              >
                                <td className="p-3 text-neutral-900 dark:text-neutral-100">
                                  {item.description || "(No description)"}
                                </td>
                                <td className="p-3 text-right text-neutral-700 dark:text-neutral-300">
                                  {item.quantity}
                                </td>
                                <td className="p-3 text-right text-neutral-700 dark:text-neutral-300">
                                  {formatCurrency(
                                    item.unitPrice,
                                    section.pricingData!.currency
                                  )}
                                </td>
                                <td className="p-3 text-right text-neutral-700 dark:text-neutral-300">
                                  {item.discount
                                    ? item.discount < 100
                                      ? `${item.discount}%`
                                      : formatCurrency(
                                          item.discount,
                                          section.pricingData!.currency
                                        )
                                    : "-"}
                                </td>
                                <td className="p-3 text-right font-medium text-neutral-900 dark:text-neutral-100">
                                  {formatCurrency(
                                    item.subtotal,
                                    section.pricingData!.currency
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Totals */}
                      <div className="mt-6 space-y-2 border-t-2 border-neutral-200 dark:border-neutral-700 pt-4">
                        <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                          <span>Subtotal:</span>
                          <span className="font-medium">
                            {formatCurrency(
                              section.pricingData.subtotal,
                              section.pricingData.currency
                            )}
                          </span>
                        </div>

                        {section.pricingData.discountAmount !== undefined &&
                          section.pricingData.discountAmount > 0 && (
                            <div className="flex justify-between text-error-600 dark:text-error-400">
                              <span>Discount:</span>
                              <span className="font-medium">
                                -{formatCurrency(
                                  section.pricingData.discountAmount,
                                  section.pricingData.currency
                                )}
                              </span>
                            </div>
                          )}

                        {section.pricingData.taxAmount !== undefined &&
                          section.pricingData.taxAmount > 0 && (
                            <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                              <span>Tax:</span>
                              <span className="font-medium">
                                +{formatCurrency(
                                  section.pricingData.taxAmount,
                                  section.pricingData.currency
                                )}
                              </span>
                            </div>
                          )}

                        <div className="flex justify-between text-lg font-bold text-primary-600 dark:text-primary-400 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                          <span>Total:</span>
                          <span>
                            {formatCurrency(
                              section.pricingData.total,
                              section.pricingData.currency
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Notes */}
                      {section.pricingData.notes && (
                        <div className="mt-4 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                            {section.pricingData.notes}
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-neutral-500 dark:text-neutral-400 italic">
                      No pricing items added yet.
                    </p>
                  )}
                </div>
              ) : (
                /* Regular text content - render HTML from rich text editor */
                <div className="prose dark:prose-invert max-w-none">
                  {section.content ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: section.content }}
                      className="text-neutral-700 dark:text-neutral-300"
                    />
                  ) : (
                    <p className="text-neutral-500 dark:text-neutral-400 italic">
                      No content yet...
                    </p>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>

        {proposal.sections.length === 0 && (
          <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
            <p>No sections added yet. Start building your proposal!</p>
          </div>
        )}
      </div>
    </div>
  );
}
