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
};

export type Metric = {
  label: string;
  value: string;
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
  metrics: Metric[];
};

export type LeadPayload = {
  name: string;
  email: string;
  company: string;
  phone?: string;
  serviceInterest?: string;
  message: string;
};
