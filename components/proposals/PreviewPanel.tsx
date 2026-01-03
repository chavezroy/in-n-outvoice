"use client";

import { Proposal } from "@/types/proposal";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/lib/pricing-calculator";
import TitlePage from "./TitlePage";

interface PreviewPanelProps {
  proposal: Proposal;
}

// A4 page dimensions
// A4 Portrait: 210mm x 297mm (8.27" x 11.69")
// A4 Landscape: 297mm x 210mm (11.69" x 8.27")
const PAGE_DIMENSIONS = {
  portrait: {
    width: "210mm",
    minHeight: "297mm",
  },
  landscape: {
    width: "297mm",
    minHeight: "210mm",
  },
};

function SectionContent({
  section,
}: {
  section: Proposal["sections"][0];
}) {
  return (
    <>
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
    </>
  );
}

export default function PreviewPanel({ proposal }: PreviewPanelProps) {
  const isLandscape = proposal.orientation === "landscape";
  const pageDimensions = isLandscape
    ? PAGE_DIMENSIONS.landscape
    : PAGE_DIMENSIONS.portrait;

  return (
    <div className="h-full overflow-y-auto bg-neutral-200 dark:bg-neutral-900 p-6">
      <div className="flex flex-col items-center gap-8 pb-8">
        {/* Title Page - Separate from sections */}
        <TitlePage proposal={proposal} />

        {/* Section Pages - Each section on its own page */}
        {proposal.sections.length > 0 ? (
          proposal.sections.map((section) => (
            <div
              key={section.id}
              id={`section-${section.id}`}
              className="bg-white dark:bg-neutral-900 shadow-xl rounded-sm"
              style={{
                width: pageDimensions.width,
                minHeight: pageDimensions.minHeight,
                pageBreakAfter: "always",
                pageBreakInside: "avoid",
              }}
            >
              <div className="h-full p-12 flex flex-col">
                {/* Section Content */}
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    {section.title}
                  </h2>
                  <SectionContent section={section} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div
            className="bg-white dark:bg-neutral-900 shadow-xl rounded-sm flex items-center justify-center"
            style={{
              width: pageDimensions.width,
              minHeight: pageDimensions.minHeight,
            }}
          >
            <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
              <p>No sections added yet. Start building your proposal!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
