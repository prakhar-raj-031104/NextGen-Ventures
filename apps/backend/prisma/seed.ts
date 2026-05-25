import { PrismaClient, type Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const imageBase = "https://images.unsplash.com";

const services = [
  {
    slug: "marketplace-growth",
    title: "Marketplace Growth Systems",
    kicker: "Amazon, Flipkart, Myntra",
    summary: "Operational systems for catalog, pricing, campaign, and marketplace performance.",
    description:
      "We build the commerce operating layer that helps brands manage listings, promotions, reporting, inventory signals, and marketplace-specific growth loops across Amazon, Flipkart, Myntra, and D2C storefronts.",
    deliverables: [
      "Marketplace audit",
      "Catalog architecture",
      "Campaign dashboards",
      "Listing optimization",
      "Conversion reporting"
    ],
    platforms: ["Amazon", "Flipkart", "Myntra", "Shopify", "WooCommerce"],
    accent: "#36f5a2",
    imageUrl: `${imageBase}/photo-1556742502-ec7c0e9f34b1?auto=format&fit=crop&w=1600&q=80`
  },
  {
    slug: "ui-ux-design",
    title: "UI UX Design",
    kicker: "Research to interface",
    summary: "Product strategy, journeys, wireframes, visual systems, and high-fidelity prototypes.",
    description:
      "We shape complex business ideas into clear digital products using research, content structure, component systems, prototyping, and polished interface design.",
    deliverables: [
      "User journeys",
      "Information architecture",
      "Wireframes",
      "Design systems",
      "Clickable prototypes"
    ],
    platforms: ["Figma", "Framer", "Design systems", "Product analytics"],
    accent: "#ff5c35",
    imageUrl: `${imageBase}/photo-1559028012-481c04fa702d?auto=format&fit=crop&w=1600&q=80`
  },
  {
    slug: "website-design-development",
    title: "Website Design and Development",
    kicker: "Fast marketing engines",
    summary: "Premium websites with motion, CMS-ready architecture, SEO foundations, and analytics.",
    description:
      "We design and develop fast, conversion-focused websites that give service companies and ecommerce brands a polished digital front door.",
    deliverables: [
      "Brand website design",
      "React development",
      "CMS structure",
      "Technical SEO",
      "Analytics setup"
    ],
    platforms: ["React", "Next.js", "Vite", "Headless CMS", "PostgreSQL"],
    accent: "#00a3ff",
    imageUrl: `${imageBase}/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1600&q=80`
  },
  {
    slug: "application-development",
    title: "Application Development",
    kicker: "Web apps and portals",
    summary: "Custom dashboards, admin tools, SaaS MVPs, and customer portals built for scale.",
    description:
      "We create secure application platforms with clean APIs, role-aware workflows, PostgreSQL data models, and frontend experiences teams can use every day.",
    deliverables: [
      "SaaS MVP planning",
      "Frontend engineering",
      "Backend APIs",
      "Database modeling",
      "Deployment readiness"
    ],
    platforms: ["React", "Node.js", "Express", "PostgreSQL", "Prisma"],
    accent: "#ffe45c",
    imageUrl: `${imageBase}/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80`
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
  metrics: Prisma.InputJsonValue;
}> = [
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

async function main() {
  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service
    });
  }

  for (const project of projects) {
    await prisma.project.upsert({
      where: { slug: project.slug },
      update: project,
      create: project
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
