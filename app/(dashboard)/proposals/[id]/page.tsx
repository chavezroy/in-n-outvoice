"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import ProposalBuilder from "@/components/proposals/ProposalBuilder";
import { Proposal } from "@/types/proposal";
import { getProposal, saveProposal, getCurrentUser } from "@/lib/storage";
import { ROUTES } from "@/lib/constants";

interface ProposalEditPageProps {
  params: Promise<{ id: string }>;
}

export default function ProposalEditPage({ params }: ProposalEditPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const loadedProposal = getProposal(id);
    if (loadedProposal) {
      if (loadedProposal.userId !== user.id) {
        router.push(ROUTES.PROPOSALS);
        return;
      }
      setProposal(loadedProposal);
    }
    setIsLoading(false);
  }, [id, router]);

  const handleSave = (updatedProposal: Proposal) => {
    const user = getCurrentUser();
    if (!user) {
      router.push(ROUTES.LOGIN);
      return;
    }

    const proposalToSave: Proposal = {
      ...updatedProposal,
      userId: user.id,
      updatedAt: new Date(),
    };

    saveProposal(proposalToSave);
    setProposal(proposalToSave);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="animate-pulse text-neutral-600 dark:text-neutral-400">
          Loading proposal...
        </div>
      </div>
    );
  }

  if (!proposal) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Proposal not found
          </p>
          <button
            onClick={() => router.push(ROUTES.PROPOSALS)}
            className="text-primary-600 dark:text-primary-400 hover:underline"
          >
            Back to Proposals
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <ProposalBuilder proposal={proposal} onSave={handleSave} />
    </div>
  );
}
