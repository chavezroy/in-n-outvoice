"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Grid, List, Eye, CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Template, TemplateCategory } from "@/types/template";

interface TemplateSelectorProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
}

export default function TemplateSelector({
  templates,
  onSelectTemplate,
}: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    TemplateCategory | "all"
  >("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(
    null
  );

  const categories: (TemplateCategory | "all")[] = [
    "all",
    "general",
    "consulting",
    "design",
    "development",
    "marketing",
    "client",
    "other",
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "primary" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "primary" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
            >
              <Card hover className="h-full flex flex-col">
                {template.thumbnailUrl && (
                  <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-t-xl mb-4 overflow-hidden">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <span className="px-2 py-1 text-xs font-medium bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
            <Card key={template.id} hover>
              <div className="flex items-center gap-4">
                {template.thumbnailUrl && (
                  <div className="w-32 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={template.thumbnailUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                      {template.name}
                    </h3>
                    {template.isPremium && (
                      <span className="px-2 py-1 text-xs font-medium bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                    {template.description}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelectTemplate(template)}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-neutral-500 dark:text-neutral-400">
          <p>No templates found matching your criteria.</p>
        </div>
      )}

      {/* Template Preview Modal */}
      {previewTemplate && (
        <Modal
          isOpen={!!previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          title={previewTemplate.name}
          size="xl"
        >
          <div className="space-y-6">
            {/* Template Info */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 text-sm font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full">
                  {previewTemplate.category.charAt(0).toUpperCase() + previewTemplate.category.slice(1)}
                </span>
                {previewTemplate.isPremium && (
                  <span className="px-3 py-1 text-sm font-medium bg-secondary-100 dark:bg-secondary-900 text-secondary-700 dark:text-secondary-300 rounded-full">
                    Premium
                  </span>
                )}
              </div>
              <p className="text-neutral-700 dark:text-neutral-300">
                {previewTemplate.description}
              </p>
            </div>

            {/* Template Sections */}
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                Template Sections ({previewTemplate.sections.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {previewTemplate.sections
                  .sort((a, b) => a.order - b.order)
                  .map((section, index) => (
                    <Card key={section.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-sm font-semibold text-primary-700 dark:text-primary-300">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                              {section.title}
                            </h4>
                            {section.isRequired && (
                              <span className="text-xs text-error-600 dark:text-error-400">
                                Required
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
                            Type: {section.type}
                          </p>
                          {section.defaultContent && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap bg-neutral-50 dark:bg-neutral-800/50 p-3 rounded-lg">
                              {section.defaultContent}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <Button
                variant="outline"
                onClick={() => setPreviewTemplate(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  onSelectTemplate(previewTemplate);
                  setPreviewTemplate(null);
                }}
              >
                Use This Template
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

