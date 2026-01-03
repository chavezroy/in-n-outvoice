export const APP_NAME = "In-N-OutVoice";
export const APP_DESCRIPTION =
  "Create professional proposals quickly with our custom template generator";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  PROPOSALS: "/proposals",
  PROPOSAL_NEW: "/proposals/new",
  PROPOSAL_EDIT: (id: string) => `/proposals/${id}`,
  TEMPLATES: "/templates",
} as const;

export const TEMPLATE_CATEGORIES = [
  "general",
  "consulting",
  "design",
  "development",
  "marketing",
  "client",
  "other",
] as const;

