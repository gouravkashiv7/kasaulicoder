export type SidebarView =
  | "overview"
  | "management"
  | "requests"
  | "pricing"
  | "cohort"
  | "programs";

export interface Program {
  _id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Plan {
  _id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingType: "one_time" | "recurring";
  billingCycle?: "monthly" | "yearly";
  features: string[];
  targetAudience: "student" | "professional" | "both";
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ContactRequest {
  _id: string;
  name: string;
  email: string;
  userType: "student" | "professional";
  query: string;
  isRead: boolean;
  ipAddress: string;
  device: string;
  createdAt: string;
}

export interface CohortInterest {
  _id: string;
  email: string;
  emailSent: boolean;
  createdAt: string;
}
