"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Plus, GripVertical, Trash2, Eye, Download, FileText, Layout, Edit, Upload, X } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusIndicator, { StatusType } from "@/components/ui/StatusIndicator";
import SectionTypeModal from "./SectionTypeModal";
import PreviewPanel from "./PreviewPanel";
import SectionEditor from "./SectionEditor";
import TitlePageEditor from "./TitlePageEditor";
import { Proposal, ProposalSection, SectionType } from "@/types/proposal";
import { saveProposal } from "@/lib/storage";
import { getSessionItem, setSessionItem } from "@/lib/storage/utils";
import { exportProposalToPDF } from "@/lib/pdf-export";

interface ProposalBuilderProps {
  proposal?: Proposal;
  onSave?: (proposal: Proposal) => void;
}

const VIEW_MODE_KEY = "outvoice:proposal-view-mode";

// Sortable Section Item Component
function SortableSectionItem({
  section,
  isSelected,
  onSelect,
  onDelete,
  viewMode,
  onScrollToSection,
}: {
  section: ProposalSection;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  viewMode: "preview" | "edit";
  onScrollToSection?: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleClick = () => {
    if (viewMode === "preview" && onScrollToSection) {
      onScrollToSection();
    } else {
      onSelect();
    }
  };

  return (
    <div ref={setNodeRef} style={style}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`
          p-3 rounded-lg border-2 cursor-pointer transition-all
          ${
            isSelected
              ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
              : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
          }
          ${isDragging ? "shadow-lg z-50" : ""}
        `}
        onClick={handleClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            {viewMode === "edit" && (
              <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical className="h-4 w-4 text-neutral-400 flex-shrink-0" />
              </button>
            )}
            <span className="text-sm font-medium truncate">{section.title}</span>
          </div>
          {viewMode === "edit" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-1 hover:bg-error-50 dark:hover:bg-error-900/20 rounded text-error-600 dark:text-error-400"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
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
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    initialProposal?.orientation || "portrait"
  );
  const [titlePageStyle, setTitlePageStyle] = useState<{
    theme: "light" | "dark";
    layout: "centered" | "left-aligned" | "split";
    logoUrl?: string;
  }>(
    initialProposal?.titlePageStyle || {
      theme: "light",
      layout: "centered",
    }
  );
  const [viewMode, setViewMode] = useState<"preview" | "edit">(() => {
    // Load from sessionStorage, default to "preview"
    if (typeof window !== "undefined") {
      const saved = getSessionItem<"preview" | "edit">(VIEW_MODE_KEY);
      return saved || "preview";
    }
    return "preview";
  });
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [isTitlePageSelected, setIsTitlePageSelected] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState<StatusType>("idle");
  const [exportStatus, setExportStatus] = useState<StatusType>("idle");
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Save view mode to sessionStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      setSessionItem(VIEW_MODE_KEY, viewMode);
    }
  }, [viewMode]);

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Auto-save when proposal changes
  useEffect(() => {
    if (proposal && title) {
      const updatedProposal: Proposal = {
        ...proposal,
        title,
        sections: sortedSections,
        orientation,
        titlePageStyle,
        updatedAt: new Date(),
      };
      setProposal(updatedProposal);

      // Debounce auto-save
      setSaveStatus("saving");
      const timeoutId = setTimeout(() => {
        if (updatedProposal.id) {
          try {
            saveProposal(updatedProposal);
            setSaveStatus("saved");
            // Reset to idle after 2 seconds
            setTimeout(() => setSaveStatus("idle"), 2000);
          } catch (error) {
            setSaveStatus("error");
            setTimeout(() => setSaveStatus("idle"), 3000);
          }
        }
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [title, sections, orientation, titlePageStyle, proposal?.id]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newSections = arrayMove(items, oldIndex, newIndex);
        // Update order property
        return newSections.map((section, index) => ({
          ...section,
          order: index,
        }));
      });
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (previewContainerRef.current) {
      // Find the scrollable container (PreviewPanel's root div)
      const scrollableContainer = previewContainerRef.current.querySelector(
        '[class*="h-full"]'
      ) as HTMLElement;
      
      const sectionElement = previewContainerRef.current.querySelector(
        `#section-${sectionId}`
      ) as HTMLElement;
      
      if (sectionElement && scrollableContainer) {
        // Calculate the position relative to the scrollable container
        const containerRect = scrollableContainer.getBoundingClientRect();
        const elementRect = sectionElement.getBoundingClientRect();
        const scrollTop = scrollableContainer.scrollTop;
        const relativeTop = elementRect.top - containerRect.top + scrollTop;
        
        // Scroll within the container, not the entire page
        scrollableContainer.scrollTo({
          top: relativeTop - 20, // 20px offset from top
          behavior: "smooth",
        });
      }
    }
  };

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
    if (viewMode === "edit") {
      setSelectedSection(newSection.id);
    } else {
      // In preview mode, scroll to the new section
      setTimeout(() => scrollToSection(newSection.id), 100);
    }
  };

  const removeSection = (id: string) => {
    if (confirm("Are you sure you want to delete this section?")) {
      const updatedSections = sections
        .filter((s) => s.id !== id)
        .map((section, index) => ({ ...section, order: index }));
      setSections(updatedSections);
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

    setSaveStatus("saving");
    const updatedProposal: Proposal = {
      ...proposal,
      title,
      sections: sortedSections,
      orientation,
      titlePageStyle,
      updatedAt: new Date(),
    };

    try {
      saveProposal(updatedProposal);
      if (onSave) {
        onSave(updatedProposal);
      }
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const handleExportPDF = async () => {
    if (!proposal || !title) return;

    setExportStatus("exporting");
    try {
      const proposalToExport: Proposal = {
        ...proposal,
        title,
        sections: sortedSections,
        orientation,
        titlePageStyle,
      };
      await exportProposalToPDF(proposalToExport, {
        orientation,
      });
      setExportStatus("exported");
      setTimeout(() => setExportStatus("idle"), 2000);
    } catch (error) {
      console.error("PDF export error:", error);
      setExportStatus("error");
      setTimeout(() => setExportStatus("idle"), 3000);
    }
  };

  const currentProposal: Proposal | null = proposal
    ? {
        ...proposal,
        title,
        sections: sortedSections,
        orientation,
        titlePageStyle,
      }
    : null;

  return (
    <>
      {/* View Mode Toggle Bar */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "preview" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("preview")}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              variant={viewMode === "edit" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("edit")}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <StatusIndicator status={saveStatus} />
            {exportStatus !== "idle" && (
              <StatusIndicator status={exportStatus} />
            )}
            <Button
              variant="outline"
              onClick={handleExportPDF}
              disabled={!currentProposal || exportStatus === "exporting"}
              isLoading={exportStatus === "exporting"}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            {viewMode === "edit" && (
              <Button
                variant="primary"
                onClick={handleSave}
                disabled={!title || saveStatus === "saving"}
                isLoading={saveStatus === "saving"}
              >
                Save Proposal
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100%-4rem)] gap-4">
        {/* Sidebar - Section List */}
        <div className="w-80 border-r border-neutral-200 dark:border-neutral-800 p-4 overflow-y-auto">
          {viewMode === "edit" && (
            <>
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

              {/* Title Page Button */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    setIsTitlePageSelected(true);
                    setSelectedSection(null);
                  }}
                  className={`
                    w-full p-3 rounded-lg border-2 transition-all text-left
                    ${
                      isTitlePageSelected
                        ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                        : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300"
                    }
                  `}
                >
                  <span className="text-sm font-medium">Title Page</span>
                </button>
              </div>
            </>
          )}

          {/* Status Indicators */}
          <div className="mb-4 flex flex-col gap-2">
            <StatusIndicator status={saveStatus} />
            {exportStatus !== "idle" && (
              <StatusIndicator status={exportStatus} />
            )}
          </div>

          {/* Sections List */}
          {viewMode === "edit" ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortedSections.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-2">
                  {sortedSections.map((section) => (
                    <SortableSectionItem
                      key={section.id}
                      section={section}
                      isSelected={selectedSection === section.id}
                      onSelect={() => {
                        setSelectedSection(section.id);
                        setIsTitlePageSelected(false);
                      }}
                      onDelete={() => removeSection(section.id)}
                      viewMode="edit"
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="space-y-2">
              {sortedSections.map((section) => (
                <SortableSectionItem
                  key={section.id}
                  section={section}
                  isSelected={false}
                  onSelect={() => {}}
                  onDelete={() => {}}
                  viewMode="preview"
                  onScrollToSection={() => scrollToSection(section.id)}
                />
              ))}
            </div>
          )}

          {sections.length === 0 && (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400 text-sm">
              <p>No sections yet. {viewMode === "edit" && 'Click "Add Section" to get started.'}</p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {viewMode === "preview" ? (
            <div ref={previewContainerRef} className="flex-1 overflow-hidden">
              {currentProposal ? (
                <PreviewPanel proposal={currentProposal} />
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                  <div className="text-center">
                    <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No proposal to preview</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {isTitlePageSelected ? (
                <div className="flex-1 overflow-y-auto p-6">
                  <TitlePageEditor
                    title={title}
                    titlePageStyle={titlePageStyle}
                    orientation={orientation}
                    onTitleChange={setTitle}
                    onStyleChange={setTitlePageStyle}
                    onOrientationChange={setOrientation}
                  />
                </div>
              ) : selectedSection ? (
                <div className="flex-1 p-6">
                  <SectionEditor
                    key={selectedSection}
                    section={sortedSections.find((s) => s.id === selectedSection)!}
                    onUpdate={(updates) =>
                      updateSection(selectedSection, updates)
                    }
                  />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                  <div className="text-center">
                    <Edit className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a section to edit</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section Type Modal */}
      <SectionTypeModal
        isOpen={showSectionModal}
        onClose={() => setShowSectionModal(false)}
        onSelect={addSection}
      />
    </>
  );
}
