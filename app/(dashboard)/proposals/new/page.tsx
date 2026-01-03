"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProposalBuilder from "@/components/proposals/ProposalBuilder";
import TemplateSelector from "@/components/proposals/TemplateSelector";
import { Proposal } from "@/types/proposal";
import { Template } from "@/types/template";
import { ROUTES } from "@/lib/constants";
import { getTemplates, getTemplate, saveProposal, generateProposalId, getCurrentUser } from "@/lib/storage";

function NewProposalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  
  const [showTemplateSelector, setShowTemplateSelector] = useState(!templateId);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);

  useEffect(() => {
    const loadedTemplates = getTemplates();
    setTemplates(loadedTemplates);

    if (templateId) {
      const template = getTemplate(templateId);
      if (template) {
        setSelectedTemplate(template);
        setShowTemplateSelector(false);
      }
    }
  }, [templateId]);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
  };

  const handleSave = (proposal: Proposal) => {
    const user = getCurrentUser();
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const proposalToSave: Proposal = {
      ...proposal,
      id: proposal.id || generateProposalId(),
      userId: user.id,
      updatedAt: new Date(),
      createdAt: proposal.createdAt || new Date(),
    };

    saveProposal(proposalToSave);
    router.push(ROUTES.PROPOSAL_EDIT(proposalToSave.id));
  };

  if (showTemplateSelector) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            Choose a Template
          </h1>
          <TemplateSelector
            templates={templates}
            onSelectTemplate={handleTemplateSelect}
          />
        </div>
      </div>
    );
  }

  const initialProposal: Proposal | undefined = selectedTemplate
    ? {
        id: generateProposalId(),
        userId: getCurrentUser()?.id || "",
        title: selectedTemplate.name,
        templateId: selectedTemplate.id,
        sections: selectedTemplate.sections.map((s) => ({
          id: `section-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: s.type,
          title: s.title,
          content: s.defaultContent,
          order: s.order,
          metadata: s.metadata,
        })),
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    : undefined;

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ProposalBuilder proposal={initialProposal} onSave={handleSave}       />
    </div>
  );
}

export default function NewProposalPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <NewProposalContent />
    </Suspense>
  );
}
