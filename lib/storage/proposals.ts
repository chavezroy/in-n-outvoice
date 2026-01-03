import { Proposal } from "@/types/proposal";
import { getStorageItem, setStorageItem, STORAGE_KEYS } from "./utils";
import { getCurrentUser } from "./auth";

/**
 * Get all proposals from localStorage
 */
export function getProposals(): Proposal[] {
  const proposals = getStorageItem<Proposal[]>(STORAGE_KEYS.PROPOSALS);
  return proposals || [];
}

/**
 * Get proposals for a specific user
 */
export function getUserProposals(userId: string): Proposal[] {
  const allProposals = getProposals();
  return allProposals.filter((p) => p.userId === userId);
}

/**
 * Get a single proposal by ID
 */
export function getProposal(id: string): Proposal | null {
  const proposals = getProposals();
  return proposals.find((p) => p.id === id) || null;
}

/**
 * Save a proposal to localStorage (creates or updates)
 */
export function saveProposal(proposal: Proposal): boolean {
  const proposals = getProposals();
  const existingIndex = proposals.findIndex((p) => p.id === proposal.id);
  const currentUser = getCurrentUser();

  const proposalToSave: Proposal = {
    ...proposal,
    userId: proposal.userId || currentUser?.id || "guest",
    updatedAt: new Date(),
    createdAt: proposal.createdAt || new Date(),
  };

  if (existingIndex >= 0) {
    proposals[existingIndex] = proposalToSave;
  } else {
    proposals.push(proposalToSave);
  }

  return setStorageItem(STORAGE_KEYS.PROPOSALS, proposals);
}

/**
 * Delete a proposal from localStorage
 */
export function deleteProposal(id: string): boolean {
  const proposals = getProposals();
  const filtered = proposals.filter((p) => p.id !== id);
  return setStorageItem(STORAGE_KEYS.PROPOSALS, filtered);
}

/**
 * Generate a unique proposal ID
 */
export function generateProposalId(): string {
  return `proposal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

