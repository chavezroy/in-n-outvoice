export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  companyName?: string;
  logoUrl?: string;
  branding?: BrandingSettings;
}

export interface BrandingSettings {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  companyName?: string;
}

