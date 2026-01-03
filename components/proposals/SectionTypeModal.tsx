"use client";

import { SectionType } from "@/types/proposal";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

interface SectionTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: SectionType) => void;
}

const sectionTypes: { type: SectionType; label: string; description: string; icon: string }[] = [
  { type: "header", label: "Header", description: "Cover page or header section", icon: "📄" },
  { type: "hero", label: "Hero", description: "Main introduction section", icon: "🎯" },
  { type: "services", label: "Services", description: "Services or offerings", icon: "⚙️" },
  { type: "pricing", label: "Pricing", description: "Pricing and payment terms", icon: "💰" },
  { type: "testimonials", label: "Testimonials", description: "Client testimonials", icon: "💬" },
  { type: "timeline", label: "Timeline", description: "Project timeline and milestones", icon: "📅" },
  { type: "about", label: "About", description: "About us or company info", icon: "ℹ️" },
  { type: "contact", label: "Contact", description: "Contact information", icon: "📧" },
  { type: "custom", label: "Custom", description: "Custom section", icon: "✨" },
];

export default function SectionTypeModal({
  isOpen,
  onClose,
  onSelect,
}: SectionTypeModalProps) {
  const handleSelect = (type: SectionType) => {
    onSelect(type);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Select Section Type" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionTypes.map((section) => (
          <Card
            key={section.type}
            hover
            className="cursor-pointer"
            onClick={() => handleSelect(section.type)}
          >
            <div className="text-center">
              <div className="text-4xl mb-2">{section.icon}</div>
              <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                {section.label}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {section.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </Modal>
  );
}

