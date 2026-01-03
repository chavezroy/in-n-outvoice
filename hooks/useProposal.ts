import { useState, useCallback, useEffect } from "react";
import { Proposal } from "@/types/proposal";
import {
  getProposal,
  saveProposal as saveProposalToStorage,
  deleteProposal as deleteProposalFromStorage,
  generateProposalId,
} from "@/lib/storage";

export function useProposal(proposalId?: string) {
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load proposal on mount if ID provided
  useEffect(() => {
    if (proposalId) {
      setIsLoading(true);
      const loadedProposal = getProposal(proposalId);
      if (loadedProposal) {
        setProposal(loadedProposal);
      } else {
        setError("Proposal not found");
      }
      setIsLoading(false);
    }
  }, [proposalId]);

  const updateProposal = useCallback(
    (updates: Partial<Proposal>) => {
      if (proposal) {
        const updated = { ...proposal, ...updates, updatedAt: new Date() };
        setProposal(updated);
        // Auto-save to localStorage
        saveProposalToStorage(updated);
      }
    },
    [proposal]
  );

  const saveProposal = useCallback(
    async (proposalToSave?: Proposal) => {
      const proposalToUse = proposalToSave || proposal;
      if (!proposalToUse) return;

      setIsLoading(true);
      setError(null);

      try {
        const success = saveProposalToStorage(proposalToUse);
        if (success) {
          setProposal(proposalToUse);
        } else {
          setError("Failed to save proposal");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save proposal");
      } finally {
        setIsLoading(false);
      }
    },
    [proposal]
  );

  const deleteProposal = useCallback(async () => {
    if (!proposal?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const success = deleteProposalFromStorage(proposal.id);
      if (success) {
        setProposal(null);
      } else {
        setError("Failed to delete proposal");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete proposal");
    } finally {
      setIsLoading(false);
    }
  }, [proposal]);

  const createProposal = useCallback(
    (initialData?: Partial<Proposal>): Proposal => {
      const newProposal: Proposal = {
        id: generateProposalId(),
        userId: "current-user", // Will be set from auth
        title: initialData?.title || "New Proposal",
        sections: initialData?.sections || [],
        status: "draft",
        createdAt: new Date(),
        updatedAt: new Date(),
        ...initialData,
      };
      setProposal(newProposal);
      return newProposal;
    },
    []
  );

  return {
    proposal,
    setProposal,
    updateProposal,
    saveProposal,
    deleteProposal,
    createProposal,
    isLoading,
    error,
  };
}
