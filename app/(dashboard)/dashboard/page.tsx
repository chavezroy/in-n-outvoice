"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Plus, FileText, Clock } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";
import { getUserProposals, getCurrentUser } from "@/lib/storage";
import { Proposal } from "@/types/proposal";

export default function DashboardPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      const userProposals = getUserProposals(user.id);
      setProposals(userProposals);
    }
    setIsLoading(false);
  }, []);

  const stats = {
    total: proposals.length,
    drafts: proposals.filter((p) => p.status === "draft").length,
    sent: proposals.filter((p) => p.status === "sent").length,
  };

  const recentProposals = proposals
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
            <div className="h-32 bg-neutral-200 dark:bg-neutral-800 rounded"></div>
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
              Dashboard
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Manage your proposals and templates
            </p>
          </div>
          <Link href={ROUTES.PROPOSAL_NEW}>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              New Proposal
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Total Proposals
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {stats.total}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Drafts
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {stats.drafts}
                </p>
              </div>
              <Clock className="h-8 w-8 text-secondary-600" />
            </div>
          </Card>
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Sent
                </p>
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {stats.sent}
                </p>
              </div>
              <FileText className="h-8 w-8 text-success-600" />
            </div>
          </Card>
        </div>

        {/* Recent Proposals */}
        <div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Recent Proposals
          </h2>
          {recentProposals.length > 0 ? (
            <div className="space-y-4">
              {recentProposals.map((proposal, index) => (
                <motion.div
                  key={proposal.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <Link href={ROUTES.PROPOSAL_EDIT(proposal.id)}>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-neutral-900 dark:text-neutral-100">
                            {proposal.title}
                          </h3>
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            Updated {new Date(proposal.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            proposal.status === "draft"
                              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                              : "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                  No proposals yet
                </p>
                <Link href={ROUTES.PROPOSAL_NEW}>
                  <Button variant="primary">Create Your First Proposal</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
