export type PricingPlan = {
  name: string;
  price: string;
  priceNote?: string;
  highlight?: boolean;
  description: string;
  features: string[];
  cta: string;
};

export type FaqItem = {
  q: string;
  a: string;
};

export type Service = {
  id?: string;
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  deliverables: string[];
  platforms: string[];
  accent: string;
  imageUrl?: string | null;
  plans?: PricingPlan[];
  faq?: FaqItem[];
  caseStudies?: ServiceCaseStudy[];
  whyUs?: string[];
  reviews?: ClientReview[];
};

export type Metric = {
  label: string;
  value: string;
};

export type PlatformLink = {
  platform: string;
  url: string;
};

export type ClientReview = {
  author: string;
  role: string;
  company: string;
  rating: number;
  text: string;
};

export type ServiceCaseStudy = {
  client: string;
  category: string;
  description: string;
  work: string[];
  imageUrl: string;
  platforms: string[];
  color: string;
  liveUrl?: string;
  links?: PlatformLink[];
};

export type Project = {
  id?: string;
  slug: string;
  title: string;
  client: string;
  category: string;
  year: number;
  summary: string;
  impact: string;
  services: string[];
  platforms: string[];
  imageUrl: string;
  color: string;
  liveUrl?: string;
  metrics: Metric[];
  links?: PlatformLink[];
  review?: ClientReview;
};

export type LeadPayload = {
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceInterest?: string;
  budget?: string;
  timeline?: string;
  businessType?: string;
  message: string;
};

export type TicketPayload = {
  clientName: string;
  email: string;
  company: string;
  projectRef: string;
  serviceType: string;
  requestType: string;
  priority: "NORMAL" | "HIGH" | "URGENT";
  title: string;
  description: string;
  timeline?: string;
};

export type AddOnEstimate = {
  label: string;
  price: string;
  unit: string;
  note?: string;
};

export type ClientAccount = {
  id: string;
  name: string;
  email: string;
  company: string;
  domain: string;
  mobile: string;
  dob: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  company: string;
  domain: string;
  mobile: string;
  dob: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type AuthSession = {
  token: string;
  tokenType: string;
  account: ClientAccount;
  // Only present on registration — the one-time generated password.
  password?: string;
};

export type InquirySelection = { question: string; answers: string[] };

export type ServiceInquiryPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  serviceSlug: string;
  serviceName: string;
  selections: InquirySelection[];
  estimate?: string;
  message?: string;
};

/* ── Admin control panel ─────────────────────────────────── */
export type AdminServiceInquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  serviceSlug: string;
  serviceName: string;
  selections: InquirySelection[];
  estimate?: string | null;
  message?: string | null;
  status: string;
  createdAt: string;
};
export type AdminTicket = {
  id: string;
  ticketNumber: string;
  clientName: string;
  email: string;
  company: string;
  projectRef: string;
  serviceType: string;
  requestType: string;
  priority: string;
  title: string;
  description: string;
  timeline?: string | null;
  status: string;
  createdAt: string;
};

export type AdminLead = {
  id: string;
  name: string;
  email: string;
  company: string;
  phone?: string | null;
  serviceInterest?: string | null;
  budget?: string | null;
  timeline?: string | null;
  businessType?: string | null;
  message: string;
  status: string;
  createdAt: string;
};

export type AdminInternship = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
  education: string;
  skills: string;
  portfolio?: string | null;
  linkedin?: string | null;
  coverNote: string;
  resumeUrl?: string | null;
  status: string;
  createdAt: string;
};

export type AdminClient = {
  id: string;
  name: string;
  email: string;
  company: string;
  domain: string;
  mobile: string;
  dob: string;
  lastLoginAt?: string | null;
  createdAt: string;
  _count?: { tickets: number };
};

export type AdminOverview = {
  totals: {
    tickets: number;
    leads: number;
    internships: number;
    clients: number;
    inquiries: number;
    openTickets: number;
    newLeads: number;
    newInquiries: number;
  };
  ticketsByStatus: Record<string, number>;
  leadsByStatus: Record<string, number>;
  internshipsByStatus: Record<string, number>;
  recentTickets: AdminTicket[];
  recentLeads: AdminLead[];
};

export type InternshipPayload = {
  name: string;
  email: string;
  phone?: string;
  role: string;
  education: string;
  skills: string;
  portfolio?: string;
  linkedin?: string;
  coverNote: string;
};
