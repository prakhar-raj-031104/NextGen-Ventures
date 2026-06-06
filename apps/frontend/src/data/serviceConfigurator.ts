import { Boxes, ClipboardList, Code, Globe, ShoppingBag, ShoppingCart, Sparkles, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type ConfigOption = {
  value: string;
  label: string;
  price?: number;       // INR added to the running estimate when selected
  priceLabel?: string;  // chip badge, e.g. "₹1,000"
  note?: string;
};

export type ConfigQuestion = {
  id: string;
  label: string;
  hint?: string;
  type: "single" | "multi" | "number";
  options: ConfigOption[];
};

export type ServiceConfig = {
  slug: string;
  name: string;
  icon: LucideIcon;
  accent: string;
  tagline: string;
  estimatable: boolean; // true → show a running ₹ estimate
  perProduct?: boolean; // true → estimate = quantity × selected per-product rates
  questions: ConfigQuestion[];
};

// Common marketplace add-ons priced from the NextGen rate card.
const WEBSITE_ADDONS: ConfigOption[] = [
  { value: "whatsapp",  label: "WhatsApp integration",       price: 1000, priceLabel: "₹1,000" },
  { value: "payment",   label: "Payment gateway",            price: 1000, priceLabel: "₹1,000" },
  { value: "delivery",  label: "Delivery partner integration", price: 1000, priceLabel: "₹1,000" },
  { value: "social",    label: "Social media integration",   price: 500,  priceLabel: "₹500 / platform" },
  { value: "api",       label: "API / third-party integration", price: 2000, priceLabel: "up to ₹2,000", note: "Charges vary with scope" },
  { value: "course",    label: "Course / LMS module",        price: 2500, priceLabel: "up to ₹2,500 / yr", note: "Varies by platform" },
  { value: "domain",    label: "Domain registration",        price: 1000, priceLabel: "₹1,000 / yr" }
];

export const serviceConfigs: ServiceConfig[] = [
  {
    slug: "website-design-development",
    name: "Website Development",
    icon: Globe,
    accent: "#00a3ff",
    tagline: "Pick a package and the add-ons you need — see the estimate live.",
    estimatable: true,
    questions: [
      {
        id: "type",
        label: "What type of website do you need?",
        type: "single",
        hint: "This sets your base package.",
        options: [
          { value: "starter",   label: "Starter — brand website",        price: 7000,  priceLabel: "₹7,000", note: "Free hosting 3 yrs" },
          { value: "ecommerce", label: "E-commerce store",               price: 15000, priceLabel: "₹15,000", note: "Free hosting 3 yrs" },
          { value: "premium",   label: "Premium — courses / custom",     price: 25000, priceLabel: "₹25,000" },
          { value: "corporate", label: "Corporate — custom scope",       price: 50000, priceLabel: "₹50,000+", note: "Varies by requirement" }
        ]
      },
      {
        id: "addons",
        label: "Add-ons & integrations",
        type: "multi",
        hint: "Select everything you'd like included.",
        options: WEBSITE_ADDONS
      },
      {
        id: "domain_hosting",
        label: "Do you already have a domain & hosting?",
        type: "single",
        options: [
          { value: "have_both", label: "Yes, I have both" },
          { value: "need_domain", label: "I need a domain" },
          { value: "need_both", label: "I need domain + hosting" }
        ]
      },
      {
        id: "pages",
        label: "Roughly how many pages?",
        type: "single",
        options: [
          { value: "1-5", label: "1–5 pages" },
          { value: "6-12", label: "6–12 pages" },
          { value: "12+", label: "12+ pages" }
        ]
      }
    ]
  },
  {
    slug: "application-development",
    name: "Application Development",
    icon: Code,
    accent: "#ffe45c",
    tagline: "SaaS, dashboards, portals, and corporate platforms.",
    estimatable: false,
    questions: [
      {
        id: "kind",
        label: "What are you building?",
        type: "single",
        options: [
          { value: "saas", label: "SaaS MVP" },
          { value: "dashboard", label: "Admin / ops dashboard" },
          { value: "portal", label: "Customer portal" },
          { value: "corporate", label: "Corporate platform" }
        ]
      },
      {
        id: "platform",
        label: "Which platform?",
        type: "single",
        options: [
          { value: "web", label: "Web app" },
          { value: "mobile", label: "Mobile app" },
          { value: "both", label: "Both" }
        ]
      },
      {
        id: "features",
        label: "Features you need",
        type: "multi",
        options: [
          { value: "auth", label: "Authentication & roles" },
          { value: "admin", label: "Admin dashboard" },
          { value: "payments", label: "Payments" },
          { value: "notify", label: "Notifications / email" },
          { value: "api", label: "Third-party API integration" },
          { value: "analytics", label: "Analytics & reporting" }
        ]
      }
    ]
  },
  {
    slug: "software-development",
    name: "Software Development (AI)",
    icon: Sparkles,
    accent: "#22d3ee",
    tagline: "Agentic AI, LLM apps, fine-tuning, and MLOps.",
    estimatable: false,
    questions: [
      {
        id: "need",
        label: "What do you need?",
        type: "single",
        options: [
          { value: "agent", label: "LLM agent / copilot" },
          { value: "rag", label: "RAG chatbot over our data" },
          { value: "finetune", label: "Model fine-tuning" },
          { value: "mlops", label: "MLOps pipeline" },
          { value: "platform", label: "Full multi-agent platform" }
        ]
      },
      {
        id: "model",
        label: "Model preference",
        type: "single",
        options: [
          { value: "hosted", label: "Hosted (Claude / OpenAI)" },
          { value: "open", label: "Open-source / self-hosted" },
          { value: "advise", label: "Not sure — advise us" }
        ]
      },
      {
        id: "capabilities",
        label: "Capabilities",
        type: "multi",
        options: [
          { value: "tools", label: "Tool calling / actions" },
          { value: "memory", label: "Memory" },
          { value: "retrieval", label: "Retrieval (RAG)" },
          { value: "guardrails", label: "Evaluation & guardrails" },
          { value: "monitor", label: "Monitoring & retraining" },
          { value: "finetune", label: "Fine-tuning on our data" }
        ]
      },
      {
        id: "data",
        label: "Data sources to connect",
        type: "multi",
        options: [
          { value: "docs", label: "Documents / PDFs" },
          { value: "db", label: "Database" },
          { value: "apis", label: "APIs" },
          { value: "web", label: "Website" },
          { value: "none", label: "None yet" }
        ]
      }
    ]
  },
  {
    slug: "marketplace-growth",
    name: "Marketplace Growth",
    icon: ShoppingBag,
    accent: "#36f5a2",
    tagline: "Amazon, Flipkart, Myntra, JioMart & Meesho operations.",
    estimatable: false,
    questions: [
      {
        id: "marketplaces",
        label: "Which marketplaces?",
        type: "multi",
        options: [
          { value: "amazon", label: "Amazon" },
          { value: "flipkart", label: "Flipkart" },
          { value: "myntra", label: "Myntra" }
        ]
      },
      {
        id: "status",
        label: "Account status",
        type: "single",
        options: [
          { value: "new", label: "New — need onboarding" },
          { value: "existing", label: "Existing — need management" }
        ]
      },
      {
        id: "services",
        label: "Services needed",
        type: "multi",
        options: [
          { value: "listing", label: "Listing & catalog" },
          { value: "store", label: "Brand store / A+ content" },
          { value: "ads", label: "Ads & campaigns" },
          { value: "imaging", label: "Product imaging" },
          { value: "inventory", label: "Pricing & inventory" }
        ]
      }
    ]
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    icon: TrendingUp,
    accent: "#c084fc",
    tagline: "Ads, social, email, and WhatsApp campaigns.",
    estimatable: false,
    questions: [
      {
        id: "channels",
        label: "Which channels?",
        type: "multi",
        options: [
          { value: "google", label: "Google Ads" },
          { value: "instagram", label: "Instagram" },
          { value: "facebook", label: "Facebook" },
          { value: "whatsapp", label: "WhatsApp campaigns" },
          { value: "email", label: "Email" }
        ]
      },
      {
        id: "budget",
        label: "Monthly ad budget",
        type: "single",
        options: [
          { value: "low", label: "Under ₹25k" },
          { value: "mid", label: "₹25k – 1L" },
          { value: "high", label: "₹1L+" },
          { value: "unsure", label: "Not sure yet" }
        ]
      },
      {
        id: "goals",
        label: "Primary goals",
        type: "multi",
        options: [
          { value: "leads", label: "Leads" },
          { value: "sales", label: "Sales" },
          { value: "awareness", label: "Brand awareness" },
          { value: "engagement", label: "Followers / engagement" }
        ]
      }
    ]
  },
  {
    slug: "ui-ux-design",
    name: "UI / UX Design",
    icon: Boxes,
    accent: "#ff5c35",
    tagline: "Research, interfaces, and design systems.",
    estimatable: false,
    questions: [
      {
        id: "scope",
        label: "What's the scope?",
        type: "single",
        options: [
          { value: "audit", label: "UX audit" },
          { value: "new", label: "New product design" },
          { value: "system", label: "Design system" },
          { value: "redesign", label: "Redesign" }
        ]
      },
      {
        id: "screens",
        label: "Roughly how many screens?",
        type: "single",
        options: [
          { value: "1-5", label: "1–5" },
          { value: "6-15", label: "6–15" },
          { value: "15+", label: "15+" }
        ]
      },
      {
        id: "deliverables",
        label: "Deliverables",
        type: "multi",
        options: [
          { value: "wireframes", label: "Wireframes" },
          { value: "hifi", label: "Hi-fi UI" },
          { value: "prototype", label: "Prototype" },
          { value: "library", label: "Component library" }
        ]
      }
    ]
  },
  {
    slug: "ecommerce-imaging",
    name: "E-commerce Imaging",
    icon: ShoppingCart,
    accent: "#fbbf24",
    tagline: "Listing images, infographics & A+ content.",
    estimatable: false,
    questions: [
      {
        id: "skus",
        label: "How many SKUs?",
        type: "single",
        options: [
          { value: "1-5", label: "1–5 SKUs" },
          { value: "6-20", label: "6–20 SKUs" },
          { value: "20+", label: "20+ SKUs" }
        ]
      },
      {
        id: "types",
        label: "Image types",
        type: "multi",
        options: [
          { value: "white", label: "White background" },
          { value: "lifestyle", label: "Lifestyle" },
          { value: "infographic", label: "Infographic" },
          { value: "aplus", label: "A+ content" },
          { value: "video", label: "Video" }
        ]
      }
    ]
  },
  {
    slug: "product-listing",
    name: "Product Listing",
    icon: ClipboardList,
    accent: "#fb7185",
    tagline: "Pick what you need per product — your estimate updates live.",
    estimatable: true,
    perProduct: true,
    questions: [
      {
        id: "quantity",
        label: "How many products?",
        type: "number",
        hint: "Enter the number of products you want listed.",
        options: []
      },
      {
        id: "services",
        label: "What do you need per product?",
        type: "multi",
        hint: "Charged per product — select everything you'd like included.",
        options: [
          { value: "image", label: "Image creation", price: 10, priceLabel: "₹10 / product" },
          { value: "info", label: "Product information (keywords, short & long description)", price: 5, priceLabel: "₹5 / product" },
          { value: "listing", label: "Product listing", price: 5, priceLabel: "₹5 / product" }
        ]
      }
    ]
  }
];

export const formatINR = (n: number): string => `₹${n.toLocaleString("en-IN")}`;
