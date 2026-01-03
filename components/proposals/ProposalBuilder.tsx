"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, GripVertical, Trash2, Eye, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import SectionTypeModal from "./SectionTypeModal";
import PreviewPanel from "./PreviewPanel";
import SectionEditor from "./SectionEditor";
import { Proposal, ProposalSection, SectionType } from "@/types/proposal";
import { saveProposal } from "@/lib/storage";
import { exportProposalToPDF } from "@/lib/pdf-export";

interface ProposalBuilderProps {
  proposal?: Proposal;
  onSave?: (proposal: Proposal) => void;
}

export default function ProposalBuilder({
  proposal: initialProposal,
  onSave,
}: ProposalBuilderProps) {
  const [proposal, setProposal] = useState<Proposal | null>(
    initialProposal || null
  );
  const [sections, setSections] = useState<ProposalSection[]>(
    initialProposal?.sections || []
  );
  const [title, setTitle] = useState(initialProposal?.title || "");
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Auto-save when proposal changes
  useEffect(() => {
    if (proposal && title) {
      const updatedProposal: Proposal = {
        ...proposal,
        title,
        sections,
        updatedAt: new Date(),
      };
      setProposal(updatedProposal);
      
      // Debounce auto-save
      const timeoutId = setTimeout(() => {
        if (updatedProposal.id) {
          saveProposal(updatedProposal);
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [title, sections, proposal?.id]);

  const addSection = (type: SectionType) => {
    const newSection: ProposalSection = {
      id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
      content: "",
      order: sections.length,
      metadata: {},
    };
    const updatedSections = [...sections, newSection];
    setSections(updatedSections);
    setSelectedSection(newSection.id);
  };

  const removeSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      setSections(sections.filter((s) => s.id !== id));
      if (selectedSection === id) {
        setSelectedSection(null);
      }
    }
  };

  const updateSection = (id: string, updates: Partial<ProposalSection>) => {
    setSections((prevSections) =>
      prevSections.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const handleSave = () => {
    if (!proposal || !title) return;

    const updatedProposal: Proposal = {
      ...proposal,
      title,
      sections,
      updatedAt: new Date(),
    };

    saveProposal(updatedProposal);
    if (onSave) {
      onSave(updatedProposal);
    }
  };

  const handleExportPDF = async () => {
    if (!proposal || !title) return;

    setIsExporting(true);
    try {
      const proposalToExport: Proposal = {
        ...proposal,
        title,
        sections,
      };
      await exportProposalToPDF(proposalToExport);
    } catch (error) {
      console.error("PDF export error:", error);
      alert(error instanceof Error ? error.message : "Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const currentProposal: Proposal | null = proposal
    ? {
        ...proposal,
        title,
        sections,
      }
    : null;

  return (
    <>
      <div className="flex h-full gap-4">
        {/* Sidebar - Section List */}
        <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 p-4 overflow-y-auto">
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Proposal Title"
              className="w-full px-4 py-2 rounded-lg border-2 border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="mb-4">
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              onClick={() => setShowSectionModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
          </div>

          <div className="space-y-2">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  p-3 rounded-lg border-2 cursor-pointer transition-all
                  ${
                    selectedSection === section.id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                  }
                `}
                onClick={() => setSelectedSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <GripVertical className="h-4 w-4 text-neutral-400 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">
                      {section.title}
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSection(section.id);
                    }}
                    className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded text-error-600 dark:text-error-400"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {selectedSection ? (
            <SectionEditor
              key={selectedSection} // Force re-render when section changes
              section={sections.find((s) => s.id === selectedSection)!}
              onUpdate={(updates) =>
                updateSection(selectedSection, updates)
              }
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              <div className="text-center">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a section to edit</p>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 p-4 flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!currentProposal}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={!currentProposal || isExporting}
              isLoading={isExporting}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={!title}>
              Save Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* Section Type Modal */}
      <SectionTypeModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSelect={addSection}
      />

      {/* Preview Modal */}
      {currentProposal && (
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Proposal Preview"
          size="full"
        >
          <div className="h-[calc(100vh-8rem)]">
            <PreviewPanel proposal={currentProposal} />
          </div>
        </Modal>
      )}
    </>
  );
}
