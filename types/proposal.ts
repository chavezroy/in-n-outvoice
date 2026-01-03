import type { BrandingSettings } from "./user";
import type { PricingSectionData } from "./pricing";

export interface Proposal {
  id: string;
  userId: string;
  title: string;
  templateId?: string;
  sections: ProposalSection[];
  branding?: BrandingSettings;
  status: ProposalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalSection {
  id: string;
  type: SectionType;
  title: string;
  content: string;
  order: number;
  metadata?: Record<string, unknown>;
  // Structured data for pricing sections
  pricingData?: PricingSectionData; // Only when type === "pricing"
}

export type SectionType =
  | "header"
  | "hero"
  | "services"
  | "pricing"
  | "testimonials"
  | "timeline"
  | "about"
  | "contact"
  | "custom";

export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";

// BrandingSettings is imported from @/types/user to avoid duplication

