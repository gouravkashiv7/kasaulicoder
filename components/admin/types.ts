export type SidebarView =
  | "overview"
  | "management"
  | "requests"
  | "pricing"
  | "cohort"
  | "programs"
  | "blogs"
  | "projects"
  | "social-media"
  | "policies"
  | "finance"
  | "discussions";

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
  media: Array<{ type: "image" | "video"; url: string }>;
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
  company?: string;
  service?: string;
  budget?: string;
  timeline?: string;
  isRead: boolean;
  status?: "pending" | "rejected";
  rejectionReason?: string;
  rejectedAt?: string;
  rejectionEmailSent?: boolean;
  ipAddress: string;
  device: string;
  createdAt: string;
}

export interface RejectConfirm {
  id: string;
  name: string;
  email: string;
  reason: string;
  isSubmitting: boolean;
  error?: string;
}

export interface MailAdminsForm {
  subject: string;
  message: string;
  recipientCount: number | null;
  isSubmitting: boolean;
  error?: string;
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
  updatedAt: Date;
}

export interface SocialMediaAccount {
  _id: string;
  platform: string;
  username: string;
  password?: string;
  managedBy: {
    _id: string;
    name: string;
    email: string;
    image?: string;
  };
  platformUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** A row from /api/admin/users or /api/admin/staff. */
export interface DirectoryRecord {
  _id: string;
  name: string;
  email: string;
  role?: string;
  userType?: "student" | "professional";
  designation?: string;
  roleDescription?: string;
  image?: string;
  isActive?: boolean;
  isDirector?: boolean;
  createdAt: string;
}

/** The signed-in admin as cached in localStorage by the login flow. */
export interface CurrentUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
}

export interface StaffForm {
  name: string;
  email: string;
  password: string;
  role: string;
  designation: string;
  roleDescription: string;
  image: string;
  isDirector: boolean;
}

export interface PlanForm {
  name: string;
  description: string;
  price: number;
  currency: string;
  billingType: "one_time" | "recurring";
  billingCycle: "monthly" | "yearly";
  features: string[];
  targetAudience: "student" | "professional" | "both";
  isFeatured: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface ProgramForm {
  name: string;
  tagline: string;
  description: string;
  image: string;
  features: string[];
  isActive: boolean;
  isVisible: boolean;
  sortOrder: number;
}

export interface SocialMediaFormData {
  platform: string;
  username: string;
  password: string;
  managedBy: string;
  platformUrl: string;
  isActive: boolean;
}

export interface ToggleConfirm {
  id: string;
  type: "users" | "staff";
  currentStatus: boolean;
  name: string;
  isSubmitting: boolean;
  error?: string;
}

/** A board director as returned by /api/director/* routes. */
export interface DirectorRef {
  id: string;
  name: string;
  email: string;
  image?: string;
}

export interface PolicyRecord {
  _id: string;
  title: string;
  body: string;
  type: "finance";
  // Missing on policies created before a client was required
  client?: { _id: string; name: string };
  split?: {
    companyBps: number;
    directors: Array<{ staff: { _id: string; name: string }; bps: number }>;
  };
  proposedBy: { _id: string; name: string };
  votes: Array<{
    staff: { _id: string; name: string };
    vote: "yes" | "no";
    comment?: string;
    at: string;
  }>;
  status: "proposed" | "approved" | "rejected" | "superseded";
  decidedAt?: string;
  createdAt: string;
}

export interface FinanceSummary {
  receivedPaise: number;
  companyEarnedPaise: number;
  companyBalancePaise: number;
  awaitingReleasePaise: number;
  releasedPaise: number;
  directorShares: Array<{ id: string; name: string; paise: number }>;
  awaitingMyApproval: number;
}

export interface ClientRecord {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  notes?: string;
  managedBy?: { _id: string; name: string } | null;
  isActive: boolean;
}

export interface PaymentRecord {
  _id: string;
  client: { _id: string; name: string } | null;
  amountPaise: number;
  receivedOn: string;
  reference?: string;
  note?: string;
  attachment?: string;
  recordedBy: { _id: string; name: string };
  allocation: {
    companyPaise: number;
    shares: Array<{ staff: { _id: string; name: string }; paise: number }>;
  };
  status: "recorded" | "void";
  voidReason?: string;
}

export interface ExpenseRecord {
  _id: string;
  purpose: string;
  amountPaise: number;
  attachment: string;
  requestedBy: { _id: string; name: string };
  approvals: Array<{
    staff: { _id: string; name: string };
    decision: "approve" | "reject";
    comment?: string;
  }>;
  status: "pending" | "approved" | "rejected" | "released";
  release?: {
    by?: { _id: string; name: string };
    at?: string;
    reference?: string;
    attachment?: string;
  };
  createdAt: string;
}

export interface DiscussionThread {
  _id: string;
  title: string;
  createdBy: { _id: string; name: string };
  lastMessageAt: string;
  preview: string;
  messageCount: number;
  unread: boolean;
}

export interface DiscussionMessage {
  _id: string;
  author: { _id: string; name: string };
  body: string;
  createdAt: string;
  emails: Array<{
    to: string[];
    subject: string;
    sentBy?: { _id: string; name: string };
    at: string;
  }>;
}

export interface DirectorBadges {
  policies: number;
  finance: number;
  discussions: number;
}
