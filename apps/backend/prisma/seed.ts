import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const imageBase = "https://images.unsplash.com";

const services: Array<{
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  deliverables: string[];
  platforms: string[];
  accent: string;
  imageUrl: string;
  whyUs: string[];
}> = [
  {
    slug: "marketplace-growth",
    title: "Marketplace Growth & Management",
    kicker: "Amazon · Flipkart · Myntra · JioMart · Meesho",
    summary: "Full-service marketplace management — listings, catalogs, campaigns, brand stores, and dashboards.",
    description:
      "NextGen Ventures manages your entire marketplace presence from scratch. We handle brand registration, product listing, catalog architecture, campaign management, and live dashboard reporting across Amazon, Flipkart, Myntra, JioMart, and Meesho — ideal for startups launching their first listings and established brands scaling operations.",
    deliverables: [
      "Brand registration & seller account setup",
      "Product listing & bulk catalog upload",
      "Amazon Brand Store & A+ Content",
      "Myntra registration, approval & catalogue",
      "Flipkart bulk listing & dashboard management",
      "JioMart & Meesho product cataloging",
      "Campaign setup and performance tracking",
      "Listing image optimization",
      "Monthly / weekly performance reports"
    ],
    platforms: ["Amazon", "Flipkart", "Myntra", "JioMart", "Meesho", "Shopify", "WooCommerce"],
    accent: "#36f5a2",
    imageUrl: `${imageBase}/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "End-to-end Brand Registry handling — documents, trademark filing, and GTIN exemptions included",
      "Myntra onboarding specialists — we've completed the approval process multiple times across categories",
      "Flipkart bulk upload: 100+ SKUs listed accurately in 48–72 hours, colour and size variants included",
      "Works for zero-sales startups — no minimum catalog size or existing sales record required",
      "One team across all 5 platforms — Amazon, Flipkart, Myntra, JioMart, Meesho, zero coordination overhead",
      "Campaign structure set up alongside listings — no delay between going live and advertising"
    ]
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing & Growth",
    kicker: "Google · Instagram · Facebook · Email · WhatsApp",
    summary: "Performance marketing, social media management, and lead generation campaigns.",
    description:
      "We run and manage your entire digital marketing engine — Google Ads, Instagram, Facebook, WhatsApp bulk marketing, and email campaigns. Every plan is flexible and sized to your budget, whether you're a startup spending ₹10,000/month or a brand investing ₹10L+. We focus on measurable outcomes: leads, traffic, and conversions.",
    deliverables: [
      "Google Search, Shopping & Display Ads",
      "Instagram & Facebook Ad campaigns",
      "Instagram & Facebook handle management",
      "WhatsApp Web bulk marketing",
      "Email marketing campaigns",
      "Audience research & targeting",
      "Ad creative direction",
      "Monthly performance reporting & strategy review"
    ],
    platforms: ["Google Ads", "Instagram", "Facebook", "WhatsApp", "Email", "Meta Ads"],
    accent: "#c084fc",
    imageUrl: `${imageBase}/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "Platform-agnostic — we recommend channels based on your audience and goals, not profit margins",
      "WhatsApp bulk marketing expertise: broadcast limits, template approvals, and compliance handled",
      "Google Ads + Meta Ads under one roof — unified attribution, no cross-agency finger-pointing",
      "Custom GA4 event tracking set up from Day 1 — every click, form submit, and conversion tracked",
      "Instagram & Facebook handles managed in-house — consistent brand voice, content calendar included",
      "Transparent pricing: your ad spend is yours, our fee is a flat management rate with no hidden markup"
    ]
  },
  {
    slug: "ui-ux-design",
    title: "UI / UX Design",
    kicker: "Research to interface",
    summary: "Product journeys, wireframes, design systems, and polished high-fidelity screens.",
    description:
      "We turn complex business workflows into clear digital products through research, content structure, interaction design, component systems, and motion-ready interface design.",
    deliverables: [
      "User journeys & information architecture",
      "Wireframes & interaction flows",
      "High-fidelity Figma designs",
      "Full design system with component library",
      "Interactive Figma prototype",
      "Motion guidelines for developers",
      "Developer handoff documentation"
    ],
    platforms: ["Figma", "Framer", "Product analytics", "Design systems"],
    accent: "#ff5c35",
    imageUrl: `${imageBase}/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "Figma files delivered with named layers, auto-layout components, and full developer annotations",
      "Motion guidelines included in every handoff — no guesswork for engineers implementing interactions",
      "We design with real content — never lorem ipsum — so what you see in Figma is exactly what ships",
      "Design systems built to scale: add 20 new screens without redesigning from scratch",
      "Interactive prototype delivered at every review stage so stakeholders approve flow, not just visuals",
      "Component documentation ensures your in-house team can extend the system after we hand off"
    ]
  },
  {
    slug: "website-design-development",
    title: "Website Design & Development",
    kicker: "React · WordPress · E-commerce",
    summary: "Fast, conversion-focused websites — React, WordPress, or full e-commerce stores.",
    description:
      "We design and develop premium websites for service companies, startups, and ecommerce brands. Whether you need a React marketing site, a WordPress platform for content teams, or a full e-commerce storefront — we scope the right stack for your goals and budget.",
    deliverables: [
      "Brand website design & development",
      "React / Next.js or WordPress build",
      "E-commerce website (Shopify / WooCommerce)",
      "CMS-ready content structure",
      "Technical SEO foundations",
      "Analytics & conversion tracking",
      "Performance optimization (90+ score)"
    ],
    platforms: ["React", "Next.js", "WordPress", "Shopify", "WooCommerce", "Headless CMS"],
    accent: "#00a3ff",
    imageUrl: `${imageBase}/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "90+ Lighthouse performance score guaranteed on every build — not a target, a contract",
      "CMS-ready from Day 1 — your team edits content without touching code or calling us",
      "React + GSAP for motion-rich experiences; WordPress for content-heavy sites — we pick based on your goals",
      "Full repository handoff: every file, domain credential, and admin login is yours at delivery",
      "SEO foundations baked in from the start — meta tags, schema markup, sitemaps, page speed",
      "3–6 months post-launch support included so you're not abandoned the moment we ship"
    ]
  },
  {
    slug: "ecommerce-imaging",
    title: "E-commerce Imaging & Creative",
    kicker: "Listing images · A+ Content · Infographics",
    summary: "Marketplace-compliant product images, A+ content, infographics, and creative assets.",
    description:
      "High-quality listing images are the single biggest lever on marketplace conversion. We create white-background main images, lifestyle composites, feature-callout infographics, comparison charts, and Amazon A+ Content — all optimized to the exact specs of Amazon, Flipkart, Myntra, JioMart, and Meesho.",
    deliverables: [
      "White-background product images",
      "Lifestyle composite images",
      "Feature infographic images",
      "Amazon A+ Content modules",
      "Amazon Brand Story banner",
      "Myntra catalogue image sets",
      "Flipkart enhanced listing images",
      "Seasonal campaign creatives"
    ],
    platforms: ["Amazon", "Flipkart", "Myntra", "JioMart", "Meesho", "Figma", "Adobe Suite"],
    accent: "#fbbf24",
    imageUrl: `${imageBase}/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "Amazon, Flipkart, and Myntra compliant specs — correct DPI, dimensions, and backgrounds for each platform",
      "Infographics designed to convert: feature callouts, comparison tables, and lifestyle context that sells",
      "A+ Content built to Amazon's quality guidelines — not templates, but custom module layouts",
      "Colour-accurate product representation that reduces return rates and improves customer trust",
      "48–72 hour turnaround for enterprise batches — consistent quality at speed",
      "Source files delivered in Figma or PSD — fully editable for seasonal updates"
    ]
  },
  {
    slug: "application-development",
    title: "Application Development",
    kicker: "SaaS · Portals · Dashboards · Corporate",
    summary: "Custom web applications, admin tools, dashboards, SaaS MVPs, and corporate platforms.",
    description:
      "We build secure full-stack applications with clean APIs, role-aware workflows, PostgreSQL data models, and frontend experiences that real teams can use every day. From startup MVPs to enterprise corporate systems — we scope for delivery.",
    deliverables: [
      "SaaS MVP planning & architecture",
      "Frontend engineering (React)",
      "Backend REST APIs (Node.js / Express)",
      "Database modeling (PostgreSQL + Prisma)",
      "Role-based authentication",
      "Admin dashboards & analytics",
      "Corporate / enterprise platform builds",
      "Deployment readiness & CI/CD"
    ],
    platforms: ["React", "Node.js", "Express", "PostgreSQL", "Prisma", "TypeScript"],
    accent: "#ffe45c",
    imageUrl: `${imageBase}/photo-1512941937938-a272ab375398?auto=format&fit=crop&w=1600&q=85`,
    whyUs: [
      "TypeScript all the way down — frontend, API routes, and database types stay in sync as you scale",
      "Prisma + PostgreSQL: clean relational data models designed to survive growth and team changes",
      "You own everything: source code, repositories, deployments — no vendor lock-in, no recurring fees",
      "Role-based access designed correctly from the start, not bolted on as an afterthought six months later",
      "Admin dashboard shipped with every engagement — your ops team works without calling engineering",
      "CI/CD pipeline configured on delivery so your team can deploy with confidence from Day 1"
    ]
  }
];

const projects: Array<{
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
  liveUrl: string | null;
  metrics: Prisma.InputJsonValue;
}> = [
  {
    slug: "om-travels-satna",
    title: "Travel Booking Platform",
    client: "Om Travels Satna",
    category: "Website Development",
    year: 2025,
    summary:
      "A full-featured travel booking website for one of Central India's most trusted travel agencies — built with destination showcases, AI trip planning, and a seamless package inquiry flow.",
    impact:
      "Transformed a traditional travel agency into a digital-first platform, giving 12,000+ customers an intuitive way to discover packages, plan itineraries, and submit booking requests online.",
    services: ["Website Design & Development", "UI / UX Design", "Digital Marketing"],
    platforms: ["React", "WordPress", "Google Ads", "SEO"],
    imageUrl: `${imageBase}/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1800&q=80`,
    color: "#36f5a2",
    liveUrl: "https://omtravelsatna.com",
    metrics: [
      { label: "Customer base served", value: "12k+" },
      { label: "Destinations listed", value: "45+" },
      { label: "Packages showcased", value: "30+" }
    ]
  },
  {
    slug: "meratm-legal-platform",
    title: "Legal Services Platform",
    client: "MeraTM",
    category: "Application Development",
    year: 2025,
    summary:
      "A comprehensive legal services portal offering trademark registration, company incorporation, GST filing, and IP protection — designed to make professional legal services accessible to Indian entrepreneurs and businesses.",
    impact:
      "Built an end-to-end platform that demystifies legal compliance for startups and SMEs, with a streamlined interface that guides users from service discovery to document filing in minutes.",
    services: ["Application Development", "Website Design & Development", "UI / UX Design"],
    platforms: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    imageUrl: `${imageBase}/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1800&q=80`,
    color: "#c084fc",
    liveUrl: "https://meratm.com",
    metrics: [
      { label: "Legal services offered", value: "15+" },
      { label: "User flows designed", value: "12" },
      { label: "Form completion rate", value: "91%" }
    ]
  },
  {
    slug: "hindustan-finserve",
    title: "Fixed Deposit Advisory Portal",
    client: "Hindustan FinServe",
    category: "Website Development",
    year: 2025,
    summary:
      "A professional financial advisory website for a fixed deposit and capital protection firm — built with trust-first design, RBI-compliance messaging, and a structured lead qualification flow.",
    impact:
      "Delivered a brand presence that builds investor confidence through clear communication of safety, returns, and regulatory compliance — converting high-intent visitors into qualified consultations.",
    services: ["Website Design & Development", "UI / UX Design", "Digital Marketing"],
    platforms: ["React", "Figma", "Google Ads", "Analytics"],
    imageUrl: `${imageBase}/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1800&q=80`,
    color: "#fbbf24",
    liveUrl: "https://hindustanfinserve.com",
    metrics: [
      { label: "Trust signals implemented", value: "18" },
      { label: "Lead form conversions", value: "34%" },
      { label: "Compliance sections", value: "6" }
    ]
  },
  {
    slug: "sigmatex-consulting",
    title: "Management Consulting Website",
    client: "SigmaTex Consulting",
    category: "Website Development",
    year: 2024,
    summary:
      "A premium corporate website for a Lean, Six Sigma, and ISO certification consultancy — designed to position the firm as India's leading quality management partner across manufacturing, food, IT, and healthcare sectors.",
    impact:
      "Elevated SigmaTex's digital presence to match the calibre of a 500+ project portfolio, with clear service packaging, sector expertise pages, and a structured client enquiry funnel.",
    services: ["Website Design & Development", "UI / UX Design", "Digital Marketing"],
    platforms: ["React", "WordPress", "Figma", "SEO"],
    imageUrl: `${imageBase}/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1800&q=80`,
    color: "#00a3ff",
    liveUrl: "https://sigmatexconsulting.com",
    metrics: [
      { label: "Projects in portfolio", value: "500+" },
      { label: "Service pages built", value: "10" },
      { label: "Industries covered", value: "8" }
    ]
  },
  {
    slug: "hcc-fashion-ecommerce",
    title: "Premium Fashion E-commerce",
    client: "HCC Fashion — Henry Castle & Co.",
    category: "E-commerce Development",
    year: 2024,
    summary:
      "A full-scale international e-commerce store for a premium men's fashion brand — featuring curated collections of jeans, shirts, and shoes with worldwide shipping, lifestyle-led product presentation, and a seamless checkout experience.",
    impact:
      "Built a brand-forward shopping experience that matches the premium positioning of Henry Castle & Co., with high-converting product pages, lifestyle imagery, and an international checkout flow.",
    services: ["Website Design & Development", "E-commerce Imaging & Creative", "UI / UX Design"],
    platforms: ["Shopify", "Figma", "Meta Ads", "WooCommerce"],
    imageUrl: `${imageBase}/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80`,
    color: "#ffe45c",
    liveUrl: "https://hccfashion.com",
    metrics: [
      { label: "Product SKUs listed", value: "120+" },
      { label: "Collection pages", value: "8" },
      { label: "Countries shipped to", value: "15+" }
    ]
  }
];

async function main() {
  console.log("🌱 Seeding NextGen Ventures database…");

  // Clear existing data in correct order (leads first, then projects/services)
  await prisma.lead.deleteMany();
  await prisma.project.deleteMany();
  await prisma.service.deleteMany();

  // Seed services
  for (const service of services) {
    await prisma.service.create({ data: service });
  }
  console.log(`✅ ${services.length} services seeded`);

  // Seed projects
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }
  console.log(`✅ ${projects.length} projects seeded`);

  console.log("🎉 Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
