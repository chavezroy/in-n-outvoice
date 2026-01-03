/**
 * PDF Export Utility using jsPDF with text rendering
 * This approach produces much smaller file sizes and better quality for text content
 */

import { Proposal } from "@/types/proposal";
import { PricingSectionData } from "@/types/pricing";
import { formatCurrency } from "@/lib/pricing-calculator";
import jsPDF from "jspdf";

/**
 * Convert HTML content to plain text for PDF export
 * Preserves basic formatting like line breaks and paragraph spacing
 */
function htmlToPlainText(html: string): string {
  if (!html) return "";

  let text = html;

  // Replace block elements with line breaks (preserve content)
  text = text.replace(/<\/?(h1|h2|h3|h4|h5|h6|p|div|li|blockquote)[^>]*>/gi, "\n");
  
  // Replace <br> and <br/> with line breaks
  text = text.replace(/<br\s*\/?>/gi, "\n");
  
  // Remove all other HTML tags
  text = text.replace(/<[^>]+>/g, "");
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'");
  
  // Clean up multiple line breaks and whitespace
  text = text.replace(/\n{3,}/g, "\n\n");
  text = text.replace(/[ \t]+/g, " "); // Multiple spaces to single space
  text = text.replace(/\n /g, "\n"); // Remove spaces after line breaks
  text = text.replace(/ \n/g, "\n"); // Remove spaces before line breaks
  
  // Remove leading/trailing whitespace from each line
  text = text
    .split("\n")
    .map((line) => line.trim())
    .join("\n");
  
  // Remove leading/trailing whitespace
  text = text.trim();

  return text;
}

export interface PDFExportOptions {
  filename?: string;
  format?: "A4" | "Letter";
  orientation?: "portrait" | "landscape";
  includeBranding?: boolean;
}

/**
 * Generate HTML representation of a proposal (kept for preview purposes)
 */
export function generateProposalHTML(proposal: Proposal): string {
  const sectionsHTML = proposal.sections
    .map(
      (section) => `
    <section style="margin-bottom: 30px; page-break-inside: avoid;">
      <h2 style="color: #1e3a8a; font-size: 24px; margin-bottom: 10px;">${section.title}</h2>
      <div style="color: #333; line-height: 1.6; white-space: pre-wrap;">${section.content || ""}</div>
    </section>
  `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${proposal.title}</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
            color: #333;
          }
          h1 {
            color: #1e3a8a;
            font-size: 32px;
            margin-bottom: 20px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
          }
          section {
            margin-bottom: 30px;
            page-break-inside: avoid;
          }
          h2 {
            color: #1e3a8a;
            font-size: 24px;
            margin-bottom: 10px;
          }
          p {
            line-height: 1.6;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${proposal.title}</h1>
        ${sectionsHTML}
      </body>
    </html>
  `;
}

/**
 * Render a pricing section as a formatted table in PDF
 */
function renderPricingSection(
  pdf: jsPDF,
  yPosition: number,
  margin: number,
  maxWidth: number,
  pageHeight: number,
  pricingData: PricingSectionData,
  checkPageBreak: (height: number) => boolean,
  lineHeight: number
): number {
  let currentY = yPosition + 5;

  if (pricingData.items && pricingData.items.length > 0) {
    // Table setup
    const colWidths = [
      maxWidth * 0.35, // Description
      maxWidth * 0.12, // Quantity
      maxWidth * 0.18, // Unit Price
      maxWidth * 0.15, // Discount
      maxWidth * 0.20, // Subtotal
    ];

    // Table header
    checkPageBreak(lineHeight * 2);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    const headers = ["Description", "Qty", "Unit Price", "Discount", "Subtotal"];
    let xPos = margin;
    headers.forEach((header, i) => {
      pdf.text(header, xPos, currentY);
      xPos += colWidths[i];
    });

    currentY += lineHeight;
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY, margin + maxWidth, currentY);
    currentY += 3;

    // Table rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pricingData.items.forEach((item, index) => {
      // Check if we need a new page
      if (currentY > pageHeight - 40) {
        pdf.addPage();
        currentY = margin + 10;
      }

      xPos = margin;

      // Description (may wrap)
      const descLines = pdf.splitTextToSize(
        item.description || "(No description)",
        colWidths[0]
      );
      descLines.forEach((line: string, lineIndex: number) => {
        if (lineIndex > 0) {
          currentY += lineHeight * 0.8;
        }
        pdf.text(line, xPos, currentY);
      });
      xPos += colWidths[0];

      // Quantity
      pdf.text(item.quantity.toString(), xPos, currentY);
      xPos += colWidths[1];

      // Unit Price
      pdf.text(
        formatCurrency(item.unitPrice, pricingData.currency),
        xPos,
        currentY
      );
      xPos += colWidths[2];

      // Discount
      const discountText = item.discount
        ? item.discount < 100
          ? `${item.discount}%`
          : formatCurrency(item.discount, pricingData.currency)
        : "-";
      pdf.text(discountText, xPos, currentY);
      xPos += colWidths[3];

      // Subtotal
      pdf.setFont("helvetica", "bold");
      pdf.text(
        formatCurrency(item.subtotal, pricingData.currency),
        xPos,
        currentY
      );
      pdf.setFont("helvetica", "normal");
      xPos += colWidths[4];

      currentY += Math.max(lineHeight * 1.2, descLines.length * lineHeight * 0.8);
    });

    // Totals section
    currentY += 8;
    checkPageBreak(lineHeight * 6);

    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.line(margin, currentY, margin + maxWidth, currentY);
    currentY += 5;

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    // Subtotal
    pdf.text("Subtotal:", margin, currentY);
    pdf.text(
      formatCurrency(pricingData.subtotal, pricingData.currency),
      margin + maxWidth - 60,
      currentY,
      { align: "right" }
    );
    currentY += lineHeight * 1.2;

    // Discount
    if (pricingData.discountAmount !== undefined && pricingData.discountAmount > 0) {
      pdf.setTextColor(200, 0, 0); // Red for discount
      pdf.text("Discount:", margin, currentY);
      pdf.text(
        `-${formatCurrency(pricingData.discountAmount, pricingData.currency)}`,
        margin + maxWidth - 60,
        currentY,
        { align: "right" }
      );
      pdf.setTextColor(0, 0, 0);
      currentY += lineHeight * 1.2;
    }

    // Tax
    if (pricingData.taxAmount !== undefined && pricingData.taxAmount > 0) {
      pdf.text("Tax:", margin, currentY);
      pdf.text(
        `+${formatCurrency(pricingData.taxAmount, pricingData.currency)}`,
        margin + maxWidth - 60,
        currentY,
        { align: "right" }
      );
      currentY += lineHeight * 1.2;
    }

    // Total
    currentY += 3;
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(0.5);
    pdf.line(margin, currentY, margin + maxWidth, currentY);
    currentY += 5;

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(30, 58, 138);
    pdf.text("Total:", margin, currentY);
    pdf.text(
      formatCurrency(pricingData.total, pricingData.currency),
      margin + maxWidth - 60,
      currentY,
      { align: "right" }
    );
    currentY += lineHeight * 1.5;

    // Notes
    if (pricingData.notes) {
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
      const notesLines = pdf.splitTextToSize(pricingData.notes, maxWidth);
      notesLines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        pdf.text(line, margin, currentY);
        currentY += lineHeight * 0.9;
      });
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
    }
  } else {
    // No items - show placeholder
    pdf.setFont("helvetica", "italic");
    pdf.setFontSize(10);
    pdf.setTextColor(128, 128, 128);
    checkPageBreak(lineHeight);
    pdf.text("(No pricing items added)", margin, currentY);
    currentY += lineHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(0, 0, 0);
  }

  return currentY;
}

/**
 * Export a proposal as a PDF file using text rendering
 * This produces much smaller files and better quality for text content
 */
/**
 * Render the title page with custom styling
 */
function renderTitlePage(
  pdf: jsPDF,
  proposal: Proposal,
  pageWidth: number,
  pageHeight: number,
  margin: number
): void {
  const style = proposal.titlePageStyle || {
    theme: "light",
    layout: "centered",
  };

  const isDark = style.theme === "dark";
  const isCentered = style.layout === "centered";
  const isLeftAligned = style.layout === "left-aligned";
  const isSplit = style.layout === "split";

  // Set background color
  if (isDark) {
    pdf.setFillColor(23, 23, 23); // neutral-900
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  } else {
    pdf.setFillColor(255, 255, 255); // white
    pdf.rect(0, 0, pageWidth, pageHeight, "F");
  }

  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  const maxWidth = pageWidth - (margin * 2);
  const lineHeight = 7;

  // Format date
  const dateStr = new Date(proposal.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isSplit) {
    // Split Layout: Title at top, logo and footer at bottom
    let yPos = margin + 40;
    
    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(36);
    pdf.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
    const titleLines = pdf.splitTextToSize(proposal.title, maxWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPos);
      yPos += lineHeight * 1.2;
    });

    // Date
    yPos += lineHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(isDark ? 200 : 100, isDark ? 200 : 100, isDark ? 200 : 100);
    pdf.text(dateStr, margin, yPos);

    // Footer with logo and text
    yPos = pageHeight - margin - 30;
    if (style.logoUrl) {
      // Note: jsPDF doesn't support base64 images directly in all versions
      // For now, we'll skip the logo in PDF and just show text
      yPos -= 15;
    }
    pdf.setDrawColor(isDark ? 100 : 200, isDark ? 100 : 200, isDark ? 100 : 200);
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPos - 10, pageWidth - margin, yPos - 10);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(isDark ? 150 : 120, isDark ? 150 : 120, isDark ? 150 : 120);
    pdf.text("Proposal Document", centerX, yPos, { align: "center" });
  } else if (isLeftAligned) {
    // Left-Aligned Layout
    let yPos = centerY - 30;
    
    // Accent bar
    pdf.setFillColor(37, 99, 235); // Primary blue
    pdf.rect(margin, yPos - 5, 16, 2, "F");

    // Title
    yPos += 20;
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(36);
    pdf.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
    const titleLines = pdf.splitTextToSize(proposal.title, maxWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, margin, yPos);
      yPos += lineHeight * 1.2;
    });

    // Date
    yPos += lineHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(14);
    pdf.setTextColor(isDark ? 200 : 100, isDark ? 200 : 100, isDark ? 200 : 100);
    pdf.text(dateStr, margin, yPos);

    // Logo at bottom
    if (style.logoUrl) {
      // Logo would go here if we had image support
    }
  } else {
    // Centered Layout (Default)
    let yPos = centerY - 40;

    // Title
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(42);
    pdf.setTextColor(isDark ? 255 : 0, isDark ? 255 : 0, isDark ? 255 : 0);
    const titleLines = pdf.splitTextToSize(proposal.title, maxWidth);
    titleLines.forEach((line: string) => {
      pdf.text(line, centerX, yPos, { align: "center" });
      yPos += lineHeight * 1.3;
    });

    // Date
    yPos += lineHeight;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(16);
    pdf.setTextColor(isDark ? 200 : 100, isDark ? 200 : 100, isDark ? 200 : 100);
    pdf.text(dateStr, centerX, yPos, { align: "center" });

    // Logo at bottom
    if (style.logoUrl) {
      // Logo would go here if we had image support
      yPos = pageHeight - margin - 20;
      // For now, we'll just leave space
    }
  }
}

export async function exportProposalToPDF(
  proposal: Proposal,
  options: PDFExportOptions = {}
): Promise<void> {
  const {
    filename = `${proposal.title || "proposal"}.pdf`,
    format = "A4",
    orientation = proposal.orientation || "portrait",
  } = options;

  try {
    // Create PDF with compression enabled
    const pdf = new jsPDF({
      orientation,
      unit: "mm",
      format,
      compress: true, // Enable PDF compression
    });

    // Page dimensions
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20; // 20mm margins
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7; // Line height in mm

    // Render Title Page
    renderTitlePage(pdf, proposal, pageWidth, pageHeight, margin);

    // Add new page for sections
    pdf.addPage();

    // Helper function to check if we need a new page
    const checkPageBreak = (requiredHeight: number) => {
      let yPosition = margin;
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        return true;
      }
      return false;
    };

    // Add sections - each section starts on a new page
    proposal.sections.forEach((section, index) => {
      // Start each section on a new page (except first which already has a page)
      if (index > 0) {
        pdf.addPage();
      }

      // Reset to top of page
      let yPosition = margin;

      // Helper function to check if we need a new page (with current yPosition)
      const checkPageBreakForSection = (requiredHeight: number) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
          return true;
        }
        return false;
      };

      // Section title
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(30, 58, 138); // Primary blue
      
      const sectionTitleLines = pdf.splitTextToSize(section.title, maxWidth);
      sectionTitleLines.forEach((line: string) => {
        checkPageBreakForSection(lineHeight * 1.5);
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight * 1.5;
      });

      // Section content - check if it's a pricing section with structured data
      if (section.type === "pricing" && section.pricingData) {
        yPosition = renderPricingSection(
          pdf,
          yPosition,
          margin,
          maxWidth,
          pageHeight,
          section.pricingData,
          checkPageBreakForSection,
          lineHeight
        );
      } else {
        // Regular text content - handle HTML from rich text editor
        yPosition += 3;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0); // Black text

        const content = section.content || "";
        if (content.trim()) {
          // Check if content contains HTML tags
          const isHTML = /<[^>]+>/.test(content);
          
          if (isHTML) {
            // Convert HTML to plain text
            const plainText = htmlToPlainText(content);
            
            // Detect headings and format accordingly
            const lines = plainText.split("\n");
            let isHeading = false;
            
            lines.forEach((line) => {
              if (!line.trim()) {
                yPosition += lineHeight * 0.5; // Extra space for empty lines
                return;
              }

              // Simple heuristic: lines that are short and all caps might be headings
              // Or lines that start with specific patterns
              const mightBeHeading = 
                line.length < 60 && 
                (line === line.toUpperCase() || 
                 /^[A-Z][^.!?]*$/.test(line.trim()));

              if (mightBeHeading && !isHeading) {
                pdf.setFont("helvetica", "bold");
                pdf.setFontSize(14);
                isHeading = true;
              } else if (isHeading && !mightBeHeading) {
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                isHeading = false;
                yPosition += lineHeight * 0.5;
              }

              // Split long lines to fit page width
              const textLines = pdf.splitTextToSize(line.trim(), maxWidth);
              textLines.forEach((textLine: string) => {
                checkPageBreakForSection(lineHeight);
                pdf.text(textLine, margin, yPosition);
                yPosition += lineHeight;
              });

              if (isHeading) {
                yPosition += lineHeight * 0.3; // Extra space after headings
                pdf.setFont("helvetica", "normal");
                pdf.setFontSize(12);
                isHeading = false;
              }
            });
          } else {
            // Plain text - split content into lines that fit the page width
            const contentLines = pdf.splitTextToSize(content, maxWidth);

            contentLines.forEach((line: string) => {
              checkPageBreakForSection(lineHeight);
              pdf.text(line, margin, yPosition);
              yPosition += lineHeight;
            });
          }
        } else {
          // Empty section placeholder
          pdf.setFont("helvetica", "italic");
          pdf.setTextColor(128, 128, 128); // Gray
          checkPageBreakForSection(lineHeight);
          pdf.text("(No content)", margin, yPosition);
          yPosition += lineHeight;
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(0, 0, 0);
        }
      }
    });

    // Save PDF
    pdf.save(filename);
  } catch (error) {
    console.error("PDF export error:", error);
    throw new Error("Failed to export PDF. Please try again.");
  }
}
