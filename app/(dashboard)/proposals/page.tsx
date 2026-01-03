"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { ROUTES } from "@/lib/constants";
import { getUserProposals, getCurrentUser } from "@/lib/storage";
import { Proposal } from "@/types/proposal";

export default function ProposalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [filteredProposals, setFilteredProposals] = useState<Proposal[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const userProposals = getUserProposals(user.id);
      setProposals(userProposals);
      setFilteredProposals(userProposals);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProposals(proposals);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = proposals.filter(
      (proposal) =>
        proposal.title.toLowerCase().includes(query) ||
        proposal.sections.some(
          (section) =>
            section.title.toLowerCase().includes(query) ||
            section.content.toLowerCase().includes(query)
        )
    );
    setFilteredProposals(filtered);
  }, [searchQuery, proposals]);

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              Proposals
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Manage all your proposals
            </p>
          </div>
          <Link href={ROUTES.PROPOSAL_NEW}>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            type="search"
            placeholder="Search proposals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Proposals List */}
        {filteredProposals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProposals.map((proposal, index) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <Link href={ROUTES.PROPOSAL_EDIT(proposal.id)}>
                    <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100 mb-2">
                      {proposal.title}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                      Updated {new Date(proposal.updatedAt).toLocaleDateString()}
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        proposal.status === "draft"
                          ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          : "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                      }`}
                    >
                      {proposal.status}
                    </span>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <div className="text-center py-12">
              <p className="text-neutral-500 dark:text-neutral-400 mb-4">
                {searchQuery
                  ? "No proposals match your search"
                  : "No proposals yet"}
              </p>
              {!searchQuery && (
                <Link href={ROUTES.PROPOSAL_NEW}>
                  <Button variant="primary">Create Your First Proposal</Button>
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
