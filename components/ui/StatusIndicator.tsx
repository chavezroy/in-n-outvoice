"use client";

import { CheckCircle2, Loader2, AlertCircle, Save } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type StatusType = "idle" | "saving" | "saved" | "error" | "exporting" | "exported";

interface StatusIndicatorProps {
  status: StatusType;
  message?: string;
  className?: string;
}

const statusConfig: Record<
  StatusType,
  {
    icon: typeof Loader2 | typeof CheckCircle2 | typeof AlertCircle | null;
    color: string;
    bgColor: string;
    message?: string;
  }
> = {
  idle: {
    icon: null,
    color: "text-neutral-400",
    bgColor: "bg-neutral-100 dark:bg-neutral-800",
  },
  saving: {
    icon: Loader2,
    color: "text-primary-600 dark:text-primary-400",
    bgColor: "bg-primary-50 dark:bg-primary-900/20",
    message: "Saving...",
  },
  saved: {
    icon: CheckCircle2,
    color: "text-success-600 dark:text-success-400",
    bgColor: "bg-success-50 dark:bg-success-900/20",
    message: "Saved",
  },
  error: {
    icon: AlertCircle,
    color: "text-error-600 dark:text-error-400",
    bgColor: "bg-error-50 dark:bg-error-900/20",
    message: "Error",
  },
  exporting: {
    icon: Loader2,
    color: "text-primary-600 dark:text-primary-400",
    bgColor: "bg-primary-50 dark:bg-primary-900/20",
    message: "Exporting PDF...",
  },
  exported: {
    icon: CheckCircle2,
    color: "text-success-600 dark:text-success-400",
    bgColor: "bg-success-50 dark:bg-success-900/20",
    message: "Exported",
  },
};

export default function StatusIndicator({
  status,
  message,
  className,
}: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;
  const displayMessage = message || config.message || "";

  if (status === "idle" && !displayMessage) {
    return null;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={cn(
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium",
          config.bgColor,
          config.color,
          className
        )}
      >
        {Icon && (
          <Icon
            className={cn(
              "h-4 w-4",
              status === "saving" || status === "exporting"
                ? "animate-spin"
                : ""
            )}
          />
        )}
        {displayMessage && (
          <span className="whitespace-nowrap">{displayMessage}</span>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

