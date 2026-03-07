export type SidebarView =
  | "overview"
  | "management"
  | "requests"
  | "pricing"
  | "cohort"
  | "programs"
  | "blogs"
  | "projects";

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

export interface Project {
  _id: string;
  title: string;
  slug: string;
  outcome: string;
  desc: string;
  images: string[];
  tags: string[];
  content?: string;
  githubUrl?: string;
  liveUrl?: string;
  videoUrl?: string;
  status: "active" | "past";
  featured: boolean;
  members: Array<{
    _id: string;
    name: string;
    image?: string;
    designation?: string;
  }>;
  createdAt: string;
  updatedAt: string;
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

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  mainImageUrl: string;
  tagline: string;
  description: string;
  content: string;
  writtenBy: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}
