import { ProposalSection, SectionType } from "./proposal";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  thumbnailUrl?: string;
  previewUrl?: string;
  sections: TemplateSection[];
  isPremium: boolean;
  createdAt: Date;
}

export interface TemplateSection {
  id: string;
  type: SectionType;
  title: string;
  defaultContent: string;
  order: number;
  isRequired: boolean;
  metadata?: Record<string, unknown>;
}

export type TemplateCategory =
  | "general"
  | "consulting"
  | "design"
  | "development"
  | "marketing"
  | "client"
  | "other";

