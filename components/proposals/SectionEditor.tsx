"use client";

import { ProposalSection } from "@/types/proposal";
import { Calculator, FileText } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PricingEditor from "./PricingEditor";
import RichTextEditor from "./RichTextEditor";
import { PricingSectionData } from "@/types/pricing";

interface SectionEditorProps {
  section: ProposalSection;
  onUpdate: (updates: Partial<ProposalSection>) => void;
}

export default function SectionEditor({
  section,
  onUpdate,
}: SectionEditorProps) {
  // Check if this is a pricing section
  const isPricingSection = section.type === "pricing";
  const hasPricingData = isPricingSection && section.pricingData;

  // Toggle between text and structured pricing mode
  const togglePricingMode = () => {
    if (hasPricingData) {
      // Switch to text mode - preserve pricing data in metadata for recovery
      onUpdate({
        metadata: {
          ...section.metadata,
          savedPricingData: section.pricingData,
        },
        pricingData: undefined,
        content: section.content || "Breakdown of costs and payment terms.",
      });
    } else {
      // Switch to structured mode - restore from metadata if available
      const savedData =
        (section.metadata?.savedPricingData as PricingSectionData) ||
        undefined;
      onUpdate({
        pricingData:
          savedData || {
            items: [],
            subtotal: 0,
            total: 0,
            currency: "USD",
          },
        content: "", // Clear text content when switching to structured
      });
    }
  };

  // If it's a pricing section with structured data, show pricing editor
  if (isPricingSection && hasPricingData) {
    return (
      <div className="space-y-4">
        <Input
          label="Section Title"
          value={section.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
        />

        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={togglePricingMode}>
            <FileText className="h-4 w-4 mr-2" />
            Switch to Text Mode
          </Button>
        </div>

        <PricingEditor
          data={section.pricingData}
          onUpdate={(data) => onUpdate({ pricingData: data })}
        />
      </div>
    );
  }

  // Default text editor (for all sections, including text-mode pricing)
  return (
    <div className="space-y-4">
      <Input
        label="Section Title"
        value={section.title}
        onChange={(e) => onUpdate({ title: e.target.value })}
      />

      {isPricingSection && !hasPricingData && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={togglePricingMode}>
            <Calculator className="h-4 w-4 mr-2" />
            Use Itemized Pricing
          </Button>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2 text-neutral-700 dark:text-neutral-300">
          Content
        </label>
        <RichTextEditor
          key={section.id} // Force re-initialization when section changes
          content={section.content || ""}
          onChange={(html) => onUpdate({ content: html })}
          placeholder="Enter section content..."
        />
      </div>
    </div>
  );
}
