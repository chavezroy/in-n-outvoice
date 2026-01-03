"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TemplateSelector from "@/components/proposals/TemplateSelector";
import { Template } from "@/types/template";
import { ROUTES } from "@/lib/constants";
import { getTemplates, initializeTemplates } from "@/lib/storage";

export default function TemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize templates if needed
    initializeTemplates();
    const loadedTemplates = getTemplates();
    setTemplates(loadedTemplates);
    setIsLoading(false);
  }, []);

  const handleSelectTemplate = (template: Template) => {
    router.push(`${ROUTES.PROPOSAL_NEW}?template=${template.id}`);
  };

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Proposal Templates
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Choose a template to get started with your proposal
          </p>
        </div>
        <TemplateSelector
          templates={templates}
          onSelectTemplate={handleSelectTemplate}
        />
      </div>
    </div>
  );
}
