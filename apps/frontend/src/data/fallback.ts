import type { FaqItem, PricingPlan, Project, Service } from "../types";

const imageBase = "https://images.unsplash.com";

const marketplacePlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹24,999",
    priceNote: "/ month",
    description: "One platform, structured operations, and monthly clarity on what's working.",
    features: [
      "1 marketplace platform (Amazon, Flipkart, or Myntra)",
      "Full catalog audit and gap report",
      "10 listing optimizations per month",
      "Basic campaign structure setup",
      "Monthly performance report",
      "30-day onboarding call"
    ],
    cta: "Get Started"
  },
  {
    name: "Growth",
    price: "₹54,999",
    priceNote: "/ month",
    highlight: true,
    description: "Multi-platform management with live tracking and proactive optimizations.",
    features: [
      "2 marketplace platforms",
      "Full catalog management — unlimited SKUs",
      "40 listing optimizations per month",
      "Campaign setup, tracking, and spend analysis",
      "Competitor pricing and ranking monitoring",
      "Bi-weekly performance reports",
      "Dedicated Slack / WhatsApp channel"
    ],
    cta: "Start Growth Plan"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full marketplace operations with a dedicated account manager and real-time dashboards.",
    features: [
      "All marketplace platforms",
      "Dedicated account manager",
      "Real-time performance dashboard",
      "Unlimited SKU tracking and optimization",
      "Daily reporting and alerts",
      "Full campaign management and budget planning",
      "D2C channel integration",
      "Custom analytics and data exports"
    ],
    cta: "Request a Quote"
  }
];

const marketplaceFaq: FaqItem[] = [
  {
    q: "Which marketplaces do you support?",
    a: "We work across Amazon India, Flipkart, and Myntra. For Enterprise clients we also support Meesho, JioMart, and Shopify-based D2C channels."
  },
  {
    q: "How quickly can we expect results?",
    a: "Listing optimizations typically show measurable improvements in click-through and conversion within 30–45 days. Campaign improvements are visible within the first billing cycle."
  },
  {
    q: "Do we need to give you seller account access?",
    a: "Yes — read-level access to your seller central is required. We use it for reporting, audits, and listing management. You remain in full control."
  },
  {
    q: "Can we upgrade or change plans later?",
    a: "Absolutely. Most clients start on Starter and scale to Growth within 2–3 months once they see the impact. We make the transition smooth with no interruption."
  }
];

const uiuxPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹39,999",
    priceNote: "one-time",
    description: "Core screens designed and handed off — ideal for landing pages or focused product flows.",
    features: [
      "Up to 8 high-fidelity screens",
      "1 user flow mapped end-to-end",
      "Basic component library in Figma",
      "Mobile and desktop variants",
      "2 rounds of revisions",
      "Figma file handoff with annotations"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "₹79,999",
    priceNote: "one-time",
    highlight: true,
    description: "Full UX research through polished design system — for serious product launches.",
    features: [
      "Up to 22 high-fidelity screens",
      "UX research and competitive analysis",
      "Complete information architecture",
      "Full design system with tokens",
      "Interactive Figma prototype",
      "Motion guidelines for developers",
      "3 rounds of revisions",
      "Developer handoff documentation"
    ],
    cta: "Start Pro Design"
  },
  {
    name: "Studio",
    price: "Custom",
    description: "Ongoing design partnership — for teams building products that need consistent design ops.",
    features: [
      "Unlimited screens and flows",
      "Monthly design retainer",
      "Full product design ownership",
      "Multi-platform design systems",
      "Motion design and micro-interactions",
      "User testing and iteration cycles",
      "Dedicated designer assigned",
      "Weekly sync and async reviews"
    ],
    cta: "Request a Quote"
  }
];

const uiuxFaq: FaqItem[] = [
  {
    q: "What file formats do you deliver?",
    a: "All design work is delivered as organized Figma files with component libraries, named layers, and developer-ready annotations. We can also export assets in any format required."
  },
  {
    q: "Do you do branding or only UI?",
    a: "Our focus is UI/UX — product design, interfaces, and flows. If you need brand identity work (logos, brand guidelines), we can scope that separately or recommend partners."
  },
  {
    q: "How many revision rounds are included?",
    a: "Starter includes 2 rounds, Pro includes 3 rounds. Each revision round covers feedback on the entire batch of screens delivered at that stage — not individual changes per screen."
  },
  {
    q: "Can you work with our existing brand guidelines?",
    a: "Yes, and we prefer it. Existing brand assets, typography, and color systems give us a head start. We extend them into a full digital component system."
  }
];

const websitePlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹59,999",
    priceNote: "one-time",
    description: "A clean, fast brand website with the fundamentals done right.",
    features: [
      "Up to 5 pages designed and built",
      "React + Vite stack",
      "Mobile responsive design",
      "Contact form with email delivery",
      "Google Analytics 4 setup",
      "Basic on-page SEO structure",
      "1 month of post-launch support"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "₹1,19,999",
    priceNote: "one-time",
    highlight: true,
    description: "Motion-rich website with CMS, conversion tracking, and performance tuning.",
    features: [
      "Up to 12 pages designed and built",
      "GSAP scroll animations and transitions",
      "Headless CMS integration (Sanity / Contentful)",
      "Advanced SEO — sitemaps, schema, meta",
      "Conversion event tracking",
      "Performance score 90+ guaranteed",
      "Blog or resources section",
      "3 months of post-launch support"
    ],
    cta: "Start Pro Build"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-scale web platform with custom backend, e-commerce, or multi-language support.",
    features: [
      "Unlimited pages and sections",
      "Custom backend and API integrations",
      "E-commerce or booking flows",
      "Multi-language support",
      "Advanced CMS with editorial workflows",
      "CDN and performance infrastructure",
      "Dedicated project manager",
      "6 months of post-launch support"
    ],
    cta: "Request a Quote"
  }
];

const websiteFaq: FaqItem[] = [
  {
    q: "How long does a website project take?",
    a: "Starter sites take 3–4 weeks. Pro builds typically run 6–8 weeks including design, development, and review cycles. Enterprise timelines are scoped per project."
  },
  {
    q: "Do you handle hosting and domain setup?",
    a: "We deploy to Vercel, Netlify, or your preferred host. We assist with domain setup and DNS configuration. Ongoing hosting costs are billed directly to you at provider rates."
  },
  {
    q: "Can we update the website ourselves after launch?",
    a: "Yes — Pro and Enterprise builds include a CMS so your team can edit content, add pages, and publish blog posts without touching code."
  },
  {
    q: "What happens if we need changes after launch?",
    a: "All plans include post-launch support for bugs and fixes. For ongoing feature additions or redesigns, we offer monthly retainer arrangements."
  }
];

const appPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹99,999",
    priceNote: "one-time",
    description: "A working MVP with your 3 core features — ready to test with real users.",
    features: [
      "3 core product modules",
      "React frontend application",
      "Node.js + Express REST API",
      "PostgreSQL database with Prisma",
      "Basic email/password authentication",
      "Admin panel for data management",
      "Deployment to cloud (Render / Railway)",
      "2 months of post-launch support"
    ],
    cta: "Get Started"
  },
  {
    name: "Pro",
    price: "₹2,49,999",
    priceNote: "one-time",
    highlight: true,
    description: "Full product with role-based access, real-time features, and a polished admin experience.",
    features: [
      "Unlimited product modules",
      "Role-based auth (admin, manager, viewer)",
      "Real-time updates with WebSockets",
      "Full admin dashboard with analytics",
      "File uploads and media management",
      "Email notifications and webhooks",
      "CI/CD pipeline setup",
      "Load testing and performance tuning",
      "4 months of post-launch support"
    ],
    cta: "Start Pro Build"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "End-to-end SaaS product engineering — from architecture to scaling infrastructure.",
    features: [
      "Full SaaS product architecture",
      "Multi-tenant data isolation",
      "Billing and subscription integration",
      "Microservices or modular monolith",
      "Advanced security and compliance review",
      "Scalable cloud infrastructure (AWS / GCP)",
      "Dedicated engineering team",
      "On-call support and SLAs"
    ],
    cta: "Request a Quote"
  }
];

const appFaq: FaqItem[] = [
  {
    q: "Do you build mobile apps?",
    a: "Our core strength is web applications — React-based frontends that work perfectly on desktop and mobile browsers. For native iOS/Android apps, we can scope React Native builds separately."
  },
  {
    q: "Who owns the code after the project?",
    a: "You do — completely. All source code is transferred to your repository at handoff. There are no licensing fees, no vendor lock-in, and no strings attached."
  },
  {
    q: "How do you handle ongoing bugs after launch?",
    a: "All plans include post-launch support for critical bugs. We also offer monthly maintenance retainers for teams that want ongoing development, hosting management, and feature additions."
  },
  {
    q: "Can you work with our existing codebase?",
    a: "Yes. We regularly join projects mid-way. We'll do a code audit first, agree on what stays and what needs reworking, and then scope from there."
  }
];

export const fallbackServices: Service[] = [
  {
    slug: "marketplace-growth",
    title: "Marketplace Growth Systems",
    kicker: "Amazon, Flipkart, Myntra",
    summary: "Catalog, campaign, pricing, and reporting systems for marketplace-led brands.",
    description:
      "NextGen Ventures creates the operating layer behind marketplace growth. We connect product data, listing quality, campaign planning, and live reporting so your teams can move faster across Amazon, Flipkart, Myntra, and owned D2C channels.",
    deliverables: [
      "Marketplace audit",
      "Catalog and listing architecture",
      "Campaign dashboards",
      "Pricing and stock workflows",
      "Conversion reporting"
    ],
    platforms: ["Amazon", "Flipkart", "Myntra", "Shopify", "WooCommerce"],
    accent: "#36f5a2",
    imageUrl: `${imageBase}/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80`,
    plans: marketplacePlans,
    faq: marketplaceFaq
  },
  {
    slug: "ui-ux-design",
    title: "UI UX Design",
    kicker: "Research to interface",
    summary: "Product journeys, wireframes, design systems, and polished high-fidelity screens.",
    description:
      "We turn complex business workflows into clear digital products through research, content structure, interaction design, component systems, and motion-ready interface design.",
    deliverables: [
      "User journeys",
      "Information architecture",
      "Wireframes",
      "Design systems",
      "Interactive prototypes"
    ],
    platforms: ["Figma", "Framer", "Product analytics", "Design systems"],
    accent: "#ff5c35",
    imageUrl: `${imageBase}/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80`,
    plans: uiuxPlans,
    faq: uiuxFaq
  },
  {
    slug: "website-design-development",
    title: "Website Design and Development",
    kicker: "Premium web presence",
    summary: "Fast websites with motion, SEO foundations, analytics, and CMS-ready structure.",
    description:
      "We design and develop conversion-focused websites for service companies, startups, and ecommerce teams that need a polished digital front door and a scalable content foundation.",
    deliverables: [
      "Brand website design",
      "React development",
      "CMS-ready content structure",
      "Technical SEO",
      "Analytics events"
    ],
    platforms: ["React", "Vite", "Next.js", "Headless CMS", "PostgreSQL"],
    accent: "#00a3ff",
    imageUrl: `${imageBase}/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80`,
    plans: websitePlans,
    faq: websiteFaq
  },
  {
    slug: "application-development",
    title: "Application Development",
    kicker: "SaaS, portals, dashboards",
    summary: "Custom web applications, admin tools, dashboards, and customer portals.",
    description:
      "We build secure full-stack applications with clean APIs, role-aware workflows, PostgreSQL data models, and frontend experiences that real teams can use every day.",
    deliverables: [
      "SaaS MVP planning",
      "Frontend engineering",
      "Backend APIs",
      "Database modeling",
      "Deployment readiness"
    ],
    platforms: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"],
    accent: "#ffe45c",
    imageUrl: `${imageBase}/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80`,
    plans: appPlans,
    faq: appFaq
  }
];

export const fallbackProjects: Project[] = [
  {
    slug: "aurora-amazon-command-center",
    title: "Amazon Command Center",
    client: "Aurora Home",
    category: "Marketplace Operations",
    year: 2026,
    summary:
      "A catalog, campaign, and performance dashboard for a home decor brand scaling across Amazon India.",
    impact: "Reduced weekly reporting time and gave leadership live SKU-level visibility.",
    services: ["Marketplace Growth", "Application Development", "Analytics"],
    platforms: ["Amazon", "PostgreSQL", "React"],
    imageUrl: `${imageBase}/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1800&q=80`,
    color: "#36f5a2",
    metrics: [
      { label: "Reporting hours saved", value: "42%" },
      { label: "Listing score lift", value: "31%" },
      { label: "Dashboards shipped", value: "9" }
    ]
  },
  {
    slug: "velora-myntra-experience",
    title: "Myntra Launch Experience",
    client: "Velora Fashion",
    category: "Ecommerce Design",
    year: 2025,
    summary:
      "Product storytelling, launch pages, and conversion-focused listing assets for a fashion rollout.",
    impact: "Improved launch readiness with a reusable design system for seasonal collections.",
    services: ["UI UX Design", "Marketplace Growth", "Creative Direction"],
    platforms: ["Myntra", "Figma", "Brand Kit"],
    imageUrl: `${imageBase}/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1800&q=80`,
    color: "#ff5c35",
    metrics: [
      { label: "Launch assets", value: "64" },
      { label: "Reusable modules", value: "18" },
      { label: "Production cycles cut", value: "3x" }
    ]
  },
  {
    slug: "nexa-flipkart-growth",
    title: "Flipkart Growth Suite",
    client: "Nexa Appliances",
    category: "Commerce Platform",
    year: 2025,
    summary:
      "A Flipkart performance workspace for pricing, stock signals, ad spend, and competitor movement.",
    impact: "Unified fragmented spreadsheets into a clean, daily growth workflow.",
    services: ["Application Development", "Marketplace Growth", "Data Modeling"],
    platforms: ["Flipkart", "Node.js", "Prisma"],
    imageUrl: `${imageBase}/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1800&q=80`,
    color: "#00a3ff",
    metrics: [
      { label: "SKUs tracked", value: "1.8k" },
      { label: "Manual checks removed", value: "76%" },
      { label: "Team adoption", value: "100%" }
    ]
  },
  {
    slug: "kindleleaf-d2c-storefront",
    title: "D2C Storefront Rebuild",
    client: "KindleLeaf Wellness",
    category: "Website Development",
    year: 2024,
    summary:
      "A fast brand website and ecommerce storefront with product education, landing pages, and analytics.",
    impact: "Created a polished owned-channel experience beyond marketplace dependency.",
    services: ["Website Design", "UI UX Design", "Frontend Development"],
    platforms: ["React", "Shopify", "Analytics"],
    imageUrl: `${imageBase}/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1800&q=80`,
    color: "#ffe45c",
    metrics: [
      { label: "Page speed score", value: "96" },
      { label: "Sections designed", value: "22" },
      { label: "Conversion events", value: "14" }
    ]
  }
];

export const platformNames = [
  "Amazon",
  "Myntra",
  "Flipkart",
  "Shopify",
  "WooCommerce",
  "React",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "TypeScript",
  "Figma",
  "Framer",
  "Next.js",
  "Express",
  "Tailwind CSS",
  "Docker"
];
