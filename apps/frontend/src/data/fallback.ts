import type { AddOnEstimate, ClientReview, FaqItem, PlatformLink, PricingPlan, Project, Service, ServiceCaseStudy } from "../types";

const imageBase = "https://images.unsplash.com";

// ─── ADD-ON ESTIMATES ───────────────────────────────────────────────────────
// Indicative pricing for additions clients commonly request via the portal.
// Kept in one place so the Services pages and Client Portal stay consistent.
export const addOnEstimates: AddOnEstimate[] = [
  { label: "WhatsApp integration",        price: "₹1,000",      unit: "one-time" },
  { label: "Payment gateway",             price: "₹1,000",      unit: "one-time" },
  { label: "Delivery partner integration", price: "₹1,000",     unit: "one-time" },
  { label: "Social media setup",          price: "₹500",        unit: "per platform" },
  { label: "Domain registration",         price: "₹1,000",      unit: "per year" },
  { label: "Course / LMS module",         price: "up to ₹2,500", unit: "per year", note: "Variable as per platform cost" },
  { label: "Custom add-on module",        price: "up to ₹2,000", unit: "one-time", note: "Charges vary with scope" },
  { label: "Hosting renewal",             price: "from ₹5,000",  unit: "per 4 years", note: "Free for 3 years on new builds · varies by host cost" }
];

// ─── MARKETPLACE GROWTH ──────────────────────────────────────────────────────

const marketplacePlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹24,999",
    priceNote: "/ month",
    description: "One platform, structured operations, and monthly clarity on what's working.",
    features: [
      "1 marketplace platform (Amazon, Flipkart, Myntra, JioMart, or Meesho)",
      "Full catalog audit and gap report",
      "Product listing setup & optimization (up to 20 SKUs)",
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
      "Bulk product listing & optimization",
      "Brand store setup (Amazon) or brand registration",
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
    description: "Full marketplace operations across all platforms with a dedicated account manager.",
    features: [
      "All marketplace platforms (Amazon, Flipkart, Myntra, JioMart, Meesho)",
      "Amazon brand store + brand registry",
      "Myntra onboarding, approval & full dashboard management",
      "Flipkart bulk listing & seller dashboard management",
      "JioMart & Meesho product cataloging",
      "Dedicated account manager",
      "Real-time performance dashboard",
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
    a: "We work across Amazon India, Flipkart, Myntra, JioMart, and Meesho. We also handle Shopify and WooCommerce for D2C brands. Each platform is scoped separately based on your catalog size and goals."
  },
  {
    q: "Can you help a brand with zero sales or no existing listings?",
    a: "Yes — this is our specialty. We handle everything from scratch: brand registration, seller account setup, first listings, catalog architecture, and the first campaign. We've helped multiple startups go from zero to live in under 4 weeks."
  },
  {
    q: "Do you handle Amazon Brand Registry and brand store creation?",
    a: "Yes. We manage the full Amazon Brand Registry process and design + develop your Amazon Brand Store with enhanced A+ content, store pages, and campaign-ready assets."
  },
  {
    q: "How does Myntra onboarding work?",
    a: "Myntra requires a formal registration and approval process. We handle the application, document submission, catalogue setup, listing quality review, and image standards compliance — all the way to your first live product."
  },
  {
    q: "Can we upgrade or change plans later?",
    a: "Absolutely. Most clients start on Starter and scale to Growth within 2–3 months once they see the impact. We make the transition smooth with no interruption."
  }
];

// ─── DIGITAL MARKETING ───────────────────────────────────────────────────────

const digitalMarketingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹19,999",
    priceNote: "/ month",
    description: "One channel, set up and managed — ideal for brands starting their digital presence.",
    features: [
      "1 platform (Google Ads, Instagram, or Facebook)",
      "Account setup and campaign structure",
      "Up to ₹30,000 ad spend managed",
      "Ad creative direction (2 sets/month)",
      "Monthly performance report",
      "Keyword / audience research"
    ],
    cta: "Get Started"
  },
  {
    name: "Growth",
    price: "₹44,999",
    priceNote: "/ month",
    highlight: true,
    description: "Multi-channel campaigns with creative, targeting, and monthly growth reviews.",
    features: [
      "Google Ads + Instagram + Facebook",
      "Up to ₹1,00,000 ad spend managed",
      "Instagram & Facebook handle management",
      "Ad creative production (6 sets/month)",
      "WhatsApp Web bulk marketing campaigns",
      "Email marketing (up to 5,000 contacts)",
      "Bi-weekly performance reviews",
      "Dedicated strategy manager"
    ],
    cta: "Start Growth Plan"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Full-funnel digital marketing across all channels — tailored to your budget and growth targets.",
    features: [
      "All channels: Google, Instagram, Facebook, WhatsApp, Email",
      "Unlimited ad spend management",
      "Full social media management (content + posting)",
      "WhatsApp bulk marketing automation",
      "Email drip campaigns and lead nurturing",
      "Landing page design and A/B testing",
      "Brand positioning strategy",
      "Monthly growth audit and roadmap",
      "Dedicated account manager"
    ],
    cta: "Request a Quote"
  }
];

const digitalMarketingFaq: FaqItem[] = [
  {
    q: "What platforms do you run ads on?",
    a: "We run campaigns on Google (Search, Shopping, Display, YouTube), Instagram, and Facebook. For lead generation, we also set up WhatsApp Web bulk marketing and email drip campaigns — all under one roof."
  },
  {
    q: "Is pricing flexible based on our budget?",
    a: "Yes — our plans are designed to scale with your budget. We work with brands spending ₹10,000/month to ₹10L+/month. Our fee is separate from your ad spend and scales transparently."
  },
  {
    q: "Do you handle Instagram and Facebook page management too?",
    a: "Yes. Beyond running paid ads, we also manage your Instagram and Facebook handles — content calendar, posting, engagement, and story creation — on the Growth and Enterprise plans."
  },
  {
    q: "Can you set up WhatsApp marketing for us?",
    a: "Yes. We set up WhatsApp Web bulk marketing campaigns for broadcast messaging, product launches, and lead follow-ups. This is especially effective for ecommerce and local service businesses."
  }
];

// ─── UI UX DESIGN ────────────────────────────────────────────────────────────

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
    description: "Ongoing design partnership for teams building products that need consistent design ops.",
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
    a: "Starter includes 2 rounds, Pro includes 3 rounds. Each revision round covers feedback on the entire batch of screens delivered at that stage."
  },
  {
    q: "Can you work with our existing brand guidelines?",
    a: "Yes, and we prefer it. Existing brand assets, typography, and color systems give us a head start. We extend them into a full digital component system."
  }
];

// ─── WEBSITE DESIGN & DEVELOPMENT ───────────────────────────────────────────

const websitePlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹7,000",
    priceNote: "one-time",
    description: "A clean, professional brand website to get your business online — fast and affordable.",
    features: [
      "Up to 5 responsive pages",
      "Mobile-first, SEO-ready build",
      "Free hosting for 3 years",
      "Domain — ₹1,000 / year",
      "Contact form + WhatsApp link",
      "Google Analytics setup",
      "1 month of post-launch support"
    ],
    cta: "Get Started"
  },
  {
    name: "E-commerce",
    price: "₹15,000",
    priceNote: "one-time",
    description: "A complete online store with payments, delivery, and WhatsApp ordering built in.",
    features: [
      "Everything in Starter",
      "Product catalogue, cart & checkout",
      "Free hosting for 3 years",
      "WhatsApp integration — ₹1,000",
      "Payment gateway — ₹1,000",
      "Delivery partner integration — ₹1,000",
      "Social media setup — ₹500 / platform"
    ],
    cta: "Launch My Store"
  },
  {
    name: "Premium",
    price: "₹25,000",
    priceNote: "one-time",
    highlight: true,
    description: "An advanced platform with custom modules, courses, and integrations — built to scale.",
    features: [
      "Everything in E-commerce",
      "Individual course / LMS module — up to ₹2,500 / year (varies by platform)",
      "Custom add-on modules — up to ₹2,000 (charges vary)",
      "WhatsApp — ₹1,000 · Payment gateway — ₹1,000",
      "Social media setup — ₹500 / platform",
      "Delivery partner — ₹1,000 (if needed)",
      "Priority post-launch support"
    ],
    cta: "Go Premium"
  },
  {
    name: "Corporate",
    price: "₹50,000+",
    priceNote: "varies by scope",
    description: "An enterprise-grade corporate website, scoped and priced to your exact requirements.",
    features: [
      "Fully custom design & development",
      "Scope-based pricing (varies by requirement)",
      "Hosting — ₹5,000 for 4 years (varies by host cost)",
      "All integrations available on request",
      "Dedicated project manager",
      "Priority SLA & extended support"
    ],
    cta: "Request a Quote"
  }
];

const websiteFaq: FaqItem[] = [
  {
    q: "Do you build WordPress websites?",
    a: "Yes. We build WordPress sites with Elementor, ACF, or custom themes depending on your needs. For marketing sites, blogs, and content-heavy platforms, WordPress is often the right call. For performance-critical or highly interactive sites, we recommend React."
  },
  {
    q: "Can you build an ecommerce website too?",
    a: "Yes — ecommerce websites are a separate project type with their own scope. We integrate Shopify, WooCommerce, or custom cart/checkout systems. Pricing varies based on catalog size and feature requirements."
  },
  {
    q: "How long does a website project take?",
    a: "Starter sites take 3–4 weeks. Pro builds typically run 6–8 weeks including design, development, and review cycles. Enterprise timelines are scoped per project."
  },
  {
    q: "Can we update the website ourselves after launch?",
    a: "Yes — Pro and Enterprise builds include a CMS so your team can edit content, add pages, and publish blog posts without touching code."
  }
];

// ─── E-COMMERCE IMAGING & CREATIVE ──────────────────────────────────────────

const imagingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "₹9,999",
    priceNote: "one-time",
    description: "Essential listing images for a focused SKU launch — marketplace-compliant and conversion-ready.",
    features: [
      "Up to 5 SKUs",
      "7 images per SKU (main + lifestyle + infographic)",
      "White background main images",
      "2 infographic / feature-callout images per SKU",
      "Marketplace-compliant dimensions (Amazon, Flipkart, Myntra)",
      "2 rounds of revisions",
      "Final files in all required formats"
    ],
    cta: "Get Started"
  },
  {
    name: "Growth",
    price: "₹24,999",
    priceNote: "one-time",
    highlight: true,
    description: "Full catalog imaging for a product launch — A+ content, infographics, and lifestyle visuals.",
    features: [
      "Up to 20 SKUs",
      "Full image set per SKU (main, lifestyle, infographic, comparison)",
      "Amazon A+ Content design (basic module set)",
      "Brand Story banner",
      "Myntra catalogue-ready image sets",
      "Flipkart enhanced listing images",
      "3 rounds of revisions",
      "Source files delivered"
    ],
    cta: "Start Growth Package"
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Ongoing creative production for brands running large catalogs across multiple marketplaces.",
    features: [
      "Unlimited SKUs per month",
      "Full A+ Content (all module types)",
      "Amazon Brand Story + Store banners",
      "Video thumbnail and product demo covers",
      "Seasonal campaign creatives",
      "Dedicated creative lead",
      "Priority turnaround (48–72 hrs per batch)",
      "Monthly retainer available"
    ],
    cta: "Request a Quote"
  }
];

const imagingFaq: FaqItem[] = [
  {
    q: "Do you do product photography or only graphic design?",
    a: "We specialise in e-commerce creative design — infographics, lifestyle composites, A+ content, and listing image sets. For physical product photography, we work with studio partners and can coordinate shoots as part of a broader creative package."
  },
  {
    q: "Which marketplaces are the images optimised for?",
    a: "We deliver images compliant with Amazon India, Flipkart, Myntra, JioMart, and Meesho specifications — correct dimensions, DPI, background requirements, and text guidelines for each platform."
  },
  {
    q: "What is A+ Content?",
    a: "A+ Content (formerly Enhanced Brand Content) is a premium Amazon listing feature that lets Brand Registry sellers add rich media modules — comparison tables, lifestyle banners, feature highlight sections — below the product description."
  },
  {
    q: "How fast is the turnaround?",
    a: "Starter packages are delivered in 5–7 business days. Growth packages take 10–14 days. Enterprise clients on retainer get 48–72 hour priority turnaround per batch."
  }
];

// ─── APPLICATION DEVELOPMENT ─────────────────────────────────────────────────

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
    description: "End-to-end corporate or SaaS product engineering — from architecture to scaling infrastructure.",
    features: [
      "Full SaaS or corporate platform architecture",
      "Multi-tenant data isolation",
      "Billing and subscription integration",
      "ERP / CRM system integrations",
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
    q: "Can you build corporate or enterprise platforms?",
    a: "Yes. We build internal tools, portals, dashboards, and enterprise management systems for corporates. These are scoped under the Enterprise plan with dedicated delivery, proper security review, and integration into your existing infrastructure."
  },
  {
    q: "Can you work with our existing codebase?",
    a: "Yes. We regularly join projects mid-way. We'll do a code audit first, agree on what stays and what needs reworking, and then scope from there."
  }
];

// ─── CASE STUDIES ────────────────────────────────────────────────────────────

const hccLinks: PlatformLink[] = [
  { platform: "Amazon Brand Store", url: "https://www.amazon.in/stores/HenryCastleCo/page/EC65B8F2-B1B9-4C37-8BE1-F400657E6E8E" },
  { platform: "Flipkart — Grey Jeans", url: "https://www.flipkart.com/henry-castle-co-regular-men-grey-jeans/p/itm24371449d219c" },
  { platform: "Flipkart — White Formal Shirt", url: "https://www.flipkart.com/henry-castle-co-men-solid-formal-white-shirt/p/itmced0c71532161" },
  { platform: "Flipkart — Blue Formal Shirt", url: "https://www.flipkart.com/henry-castle-co-men-solid-formal-blue-shirt/p/itmdad588305fc29" },
  { platform: "Instagram", url: "https://www.instagram.com/castleinstyle" }
];

const degrossLinks: PlatformLink[] = [
  { platform: "Amazon Brand Store", url: "https://www.amazon.in/stores/Degross/page/58B1D9CF-D9FD-4EA7-B1E1-3FAABD5A1025" },
  { platform: "Flipkart — Blue Solid Shirt", url: "https://www.flipkart.com/degross-men-solid-casual-blue-shirt/p/itm6bfda268e6460" },
  { platform: "Flipkart — Green Solid Shirt", url: "https://www.flipkart.com/degross-men-solid-casual-green-shirt/p/itm647fdd10af975" },
  { platform: "Flipkart — Geometric Print", url: "https://www.flipkart.com/degross-men-geometric-print-casual-blue-shirt/p/itm0ca36afe28771" }
];

const marketplaceCaseStudies: ServiceCaseStudy[] = [
  {
    client: "Henry Castle & Co.",
    category: "Men's Premium Fashion",
    description:
      "Premium men's fashion brand selling jeans, formal shirts, and casual wear. We set up their complete Amazon Brand Store, Flipkart seller account, and full product catalog — taking them from zero marketplace presence to fully live across both platforms.",
    work: [
      "Amazon Brand Registry & Brand Store design",
      "Flipkart seller account setup & bulk catalog upload",
      "50+ SKUs listed with optimized titles, bullets & attributes",
      "Amazon Sponsored Products campaign structure",
      "Formal shirts, jeans & casual wear categorized correctly",
      "Listing image direction & upload across Amazon and Flipkart"
    ],
    imageUrl: `${imageBase}/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80`,
    platforms: ["Amazon", "Flipkart"],
    color: "#ffe45c",
    liveUrl: "https://www.amazon.in/stores/HenryCastleCo/page/EC65B8F2-B1B9-4C37-8BE1-F400657E6E8E",
    links: hccLinks
  },
  {
    client: "Degross",
    category: "Men's Casual Shirts",
    description:
      "Men's casual shirts brand specialising in solid and geometric print designs. Full Amazon Brand Store setup and Flipkart bulk catalog management — solid shirts in blue, green, and other colors plus geometric prints, from brand registration through to live campaigns.",
    work: [
      "Amazon Brand Store design & launch",
      "Flipkart bulk product listing (solid + geometric print shirts)",
      "Color variants & size mapping for each SKU",
      "Amazon Sponsored Products campaign setup",
      "Ongoing catalog updates, new color additions & stock sync"
    ],
    imageUrl: `${imageBase}/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80`,
    platforms: ["Amazon", "Flipkart"],
    color: "#36f5a2",
    liveUrl: "https://www.amazon.in/stores/Degross/page/58B1D9CF-D9FD-4EA7-B1E1-3FAABD5A1025",
    links: degrossLinks
  }
];

const imagingCaseStudies: ServiceCaseStudy[] = [
  {
    client: "Henry Castle & Co.",
    category: "Jeans & Formal Shirts",
    description:
      "Complete listing image set for a premium men's fashion brand — white-background main images, lifestyle shots, and feature infographics for Amazon and Flipkart across jeans, formal shirts, and casual collections.",
    work: [
      "White-background main images (Amazon-compliant)",
      "Lifestyle composite images per SKU",
      "Feature infographic callout images",
      "Flipkart catalogue-compliant image sets",
      "Amazon A+ Content banner design"
    ],
    imageUrl: `${imageBase}/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80`,
    platforms: ["Amazon", "Flipkart"],
    color: "#ffe45c",
    liveUrl: "https://www.amazon.in/stores/HenryCastleCo/page/EC65B8F2-B1B9-4C37-8BE1-F400657E6E8E",
    links: hccLinks
  },
  {
    client: "Degross",
    category: "Casual Shirts — Solid & Printed",
    description:
      "Full product image set for solid and geometric-print casual shirts, optimised for Amazon and Flipkart listing standards. Colour-accurate representations that reduce returns and improve click-through rates.",
    work: [
      "Solid & geometric print image sets",
      "White-background + lifestyle variant images",
      "Infographic feature callout images",
      "Colour-accurate product shots for each SKU",
      "Image upload and placement optimisation"
    ],
    imageUrl: `${imageBase}/photo-1620012253295-c15cc3e65df4?auto=format&fit=crop&w=800&q=80`,
    platforms: ["Amazon", "Flipkart"],
    color: "#36f5a2",
    liveUrl: "https://www.amazon.in/stores/Degross/page/58B1D9CF-D9FD-4EA7-B1E1-3FAABD5A1025",
    links: degrossLinks
  }
];

const websiteCaseStudies: ServiceCaseStudy[] = [
  {
    client: "Om Travels Satna",
    category: "Travel Agency",
    description:
      "Full travel booking platform with destination showcase, AI trip planner, and package inquiry flow for one of Central India's most trusted travel agencies — 12,000+ customers served.",
    work: [
      "React website design & development",
      "Package showcase with 45+ destinations",
      "Booking enquiry & contact flow",
      "Google Analytics 4 & SEO foundations"
    ],
    imageUrl: `${imageBase}/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80`,
    platforms: ["React", "SEO", "Analytics"],
    color: "#36f5a2",
    liveUrl: "https://omtravelsatna.com"
  },
  {
    client: "MeraTM",
    category: "Legal Services Platform",
    description:
      "Comprehensive legal services portal for trademark registration, company incorporation, and GST filing — making professional legal compliance accessible to Indian entrepreneurs.",
    work: [
      "Full-stack application design & build",
      "Service discovery & enquiry flows",
      "Multi-step legal filing UX",
      "Performance-optimised React frontend"
    ],
    imageUrl: `${imageBase}/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80`,
    platforms: ["React", "Node.js", "PostgreSQL"],
    color: "#c084fc",
    liveUrl: "https://meratm.com"
  },
  {
    client: "SigmaTex Consulting",
    category: "Management Consulting",
    description:
      "Premium corporate website for a Lean, Six Sigma, and ISO certification consultancy with 500+ projects — built to position SigmaTex as India's leading quality management firm.",
    work: [
      "Corporate website design",
      "8 sector-specific service pages",
      "Client enquiry funnel",
      "SEO and technical foundations"
    ],
    imageUrl: `${imageBase}/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80`,
    platforms: ["React", "WordPress", "SEO"],
    color: "#00a3ff",
    liveUrl: "https://sigmatexconsulting.com"
  }
];

const appCaseStudies: ServiceCaseStudy[] = [
  {
    client: "MeraTM",
    category: "Legal SaaS Platform",
    description:
      "End-to-end legal services web application with multi-step service flows, user onboarding, document management, and a structured lead qualification backend.",
    work: [
      "React 18 frontend application",
      "Node.js + Express REST API",
      "PostgreSQL data modeling with Prisma",
      "User authentication & service flow routing",
      "Admin panel for lead & service management"
    ],
    imageUrl: `${imageBase}/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80`,
    platforms: ["React", "Node.js", "PostgreSQL", "TypeScript"],
    color: "#c084fc",
    liveUrl: "https://meratm.com"
  },
  {
    client: "Hindustan FinServe",
    category: "Financial Advisory Portal",
    description:
      "RBI-compliant fixed deposit advisory portal with trust-first design, investor lead capture, and a structured consultation funnel for a capital protection advisory firm.",
    work: [
      "Financial services portal design & build",
      "Lead qualification form with CRM integration",
      "Compliance-aware content structure",
      "Performance optimisation (95+ Lighthouse)"
    ],
    imageUrl: `${imageBase}/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80`,
    platforms: ["React", "Analytics", "PostgreSQL"],
    color: "#fbbf24",
    liveUrl: "https://hindustanfinserve.com"
  }
];

// ─── EXPORTED SERVICE LIST ───────────────────────────────────────────────────

export const fallbackServices: Service[] = [
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
    plans: marketplacePlans,
    faq: marketplaceFaq,
    caseStudies: marketplaceCaseStudies,
    whyUs: [
      "End-to-end Brand Registry handling — documents, trademark filing, and GTIN exemptions included",
      "Myntra onboarding specialists — we've completed the approval process multiple times across categories",
      "Flipkart bulk upload: 100+ SKUs listed accurately in 48–72 hours, colour and size variants included",
      "Works for zero-sales startups — no minimum catalog size or existing sales record required",
      "One team across all 5 platforms — Amazon, Flipkart, Myntra, JioMart, Meesho, zero coordination overhead",
      "Campaign structure set up alongside listings — no delay between going live and advertising"
    ],
    reviews: [
      {
        author: "Arjun Mehta",
        role: "Founder",
        company: "Henry Castle & Co.",
        rating: 5,
        text: "They took us from zero Amazon presence to a fully live brand store with 50+ SKUs in under 4 weeks. The team handled everything — Brand Registry, Flipkart onboarding, campaigns — without us having to chase anyone."
      },
      {
        author: "Rajan Sharma",
        role: "Director",
        company: "Degross Apparel",
        rating: 5,
        text: "Our solid and geometric print shirts are now live across Amazon and Flipkart with proper variant mapping and campaign tracking. The listing quality improvement immediately showed up in our click-through rates."
      },
      {
        author: "Priya Nair",
        role: "E-commerce Head",
        company: "Kastum Fashion",
        rating: 5,
        text: "Managing 3 platforms was overwhelming until NextGen Ventures took over. They consolidated everything, cleaned up our listings, and now we get a clean monthly dashboard showing exactly what's working."
      }
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
    imageUrl: `/digital-marketing.jpg`,
    plans: digitalMarketingPlans,
    faq: digitalMarketingFaq,
    whyUs: [
      "Platform-agnostic — we recommend channels based on your audience and goals, not profit margins",
      "WhatsApp bulk marketing expertise: broadcast limits, template approvals, and compliance handled",
      "Google Ads + Meta Ads under one roof — unified attribution, no cross-agency finger-pointing",
      "Custom GA4 event tracking set up from Day 1 — every click, form submit, and conversion tracked",
      "Instagram & Facebook handles managed in-house — consistent brand voice, content calendar included",
      "Transparent pricing: your ad spend is yours, our fee is a flat management rate with no hidden markup"
    ],
    reviews: [
      {
        author: "Neha Agarwal",
        role: "Marketing Manager",
        company: "UrbanKraft Decor",
        rating: 5,
        text: "They set up our Google Ads and Instagram campaigns simultaneously and within the first month we saw a 3× improvement in our cost per lead. The GA4 tracking they configured gives us complete visibility."
      },
      {
        author: "Vikram Patel",
        role: "CEO",
        company: "FreshRoots Organics",
        rating: 5,
        text: "Our WhatsApp bulk campaigns had been inconsistent. NextGen Ventures restructured everything — template approvals, broadcast lists, follow-up sequences — and our conversion rate on WhatsApp doubled."
      },
      {
        author: "Divya Krishnan",
        role: "Founder",
        company: "Lumos Wellness",
        rating: 4,
        text: "Solid execution across Google Ads and Instagram. They managed our ₹50k/month budget carefully, improved our ROAS month-over-month, and the reporting is clear and honest."
      }
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
      "User journeys",
      "Information architecture",
      "Wireframes",
      "Design systems",
      "Interactive prototypes"
    ],
    platforms: ["Figma", "Framer", "Product analytics", "Design systems"],
    accent: "#ff5c35",
    imageUrl: `${imageBase}/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1600&q=85`,
    plans: uiuxPlans,
    faq: uiuxFaq,
    whyUs: [
      "Figma files delivered with named layers, auto-layout components, and full developer annotations",
      "Motion guidelines included in every handoff — no guesswork for engineers implementing interactions",
      "We design with real content — never lorem ipsum — so what you see in Figma is exactly what ships",
      "Design systems built to scale: add 20 new screens without redesigning from scratch",
      "Interactive prototype delivered at every review stage so stakeholders approve flow, not just visuals",
      "Component documentation ensures your in-house team can extend the system after we hand off"
    ],
    reviews: [
      {
        author: "Sameer Joshi",
        role: "Product Lead",
        company: "FlowStack SaaS",
        rating: 5,
        text: "The design system they built for us is something our engineering team actually enjoys using. Every component is documented, every token is named — and we've shipped 30+ new screens using the system without a single redesign call."
      },
      {
        author: "Meera Reddy",
        role: "Co-Founder",
        company: "Staywise Rentals",
        rating: 5,
        text: "They mapped out the complete booking journey before touching any screens. The information architecture workshop alone saved us months of back-and-forth. The final Figma prototype was exactly what we needed to get investor buy-in."
      },
      {
        author: "Ankit Gupta",
        role: "CTO",
        company: "CreditSpark",
        rating: 5,
        text: "Working with a design team that understands engineering constraints is rare. They know what's feasible, what needs custom code, and what can reuse existing components — which means handoff is smooth and nothing gets redesigned post-dev."
      }
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
    plans: websitePlans,
    faq: websiteFaq,
    caseStudies: websiteCaseStudies,
    whyUs: [
      "90+ Lighthouse performance score guaranteed on every build — not a target, a contract",
      "CMS-ready from Day 1 — your team edits content without touching code or calling us",
      "React + GSAP for motion-rich experiences; WordPress for content-heavy sites — we pick based on your goals",
      "Full repository handoff: every file, domain credential, and admin login is yours at delivery",
      "SEO foundations baked in from the start — meta tags, schema markup, sitemaps, page speed",
      "3–6 months post-launch support included so you're not abandoned the moment we ship"
    ],
    reviews: [
      {
        author: "Suresh Pandey",
        role: "Director",
        company: "Om Travels Satna",
        rating: 5,
        text: "Our travel website went from a static brochure to a full booking experience. Customers can now browse packages, plan itineraries, and send enquiries in one seamless flow. The response from our clients was immediate."
      },
      {
        author: "Arun Kapoor",
        role: "Managing Partner",
        company: "SigmaTex Consulting",
        rating: 5,
        text: "The corporate website they built for us has completely changed how clients perceive us. Professional, fast, and structured exactly right for a quality management consultancy. We closed two enterprise contracts within a month of launch."
      },
      {
        author: "Rajesh Verma",
        role: "Founder",
        company: "MeraTM Legal Platform",
        rating: 5,
        text: "They built us a platform that genuinely made legal services approachable. The flows are clean, the interface is fast, and our clients can complete trademark and company filing journeys without needing to call us."
      }
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
    plans: imagingPlans,
    faq: imagingFaq,
    caseStudies: imagingCaseStudies,
    whyUs: [
      "Amazon, Flipkart, and Myntra compliant specs — correct DPI, dimensions, and backgrounds for each platform",
      "Infographics designed to convert: feature callouts, comparison tables, and lifestyle context that sells",
      "A+ Content built to Amazon's quality guidelines — not templates, but custom module layouts",
      "Colour-accurate product representation that reduces return rates and improves customer trust",
      "48–72 hour turnaround for enterprise batches — consistent quality at speed",
      "Source files delivered in Figma or PSD — fully editable for seasonal updates"
    ],
    reviews: [
      {
        author: "Arjun Mehta",
        role: "Founder",
        company: "Henry Castle & Co.",
        rating: 5,
        text: "The listing images they created for our jeans and shirts are genuinely premium. White-background shots that pop on Amazon, lifestyle composites that tell a story — and the A+ Content modules have noticeably lifted our conversion rate."
      },
      {
        author: "Rajan Sharma",
        role: "Director",
        company: "Degross Apparel",
        rating: 5,
        text: "Colour accuracy was our biggest concern for the solid and geometric shirts — a wrong shade means returns. They got it exactly right, delivered infographics that highlight our USPs, and the images went live without a single rejection."
      },
      {
        author: "Sneha Malhotra",
        role: "Brand Manager",
        company: "Lumion Skincare",
        rating: 5,
        text: "Our Myntra catalogue images kept getting rejected until NextGen Ventures stepped in. They know the exact specs for every platform — and our first batch passed Myntra quality review without a single revision request."
      }
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
    plans: appPlans,
    faq: appFaq,
    caseStudies: appCaseStudies,
    whyUs: [
      "TypeScript all the way down — frontend, API routes, and database types stay in sync as you scale",
      "Prisma + PostgreSQL: clean relational data models designed to survive growth and team changes",
      "You own everything: source code, repositories, deployments — no vendor lock-in, no recurring fees",
      "Role-based access designed correctly from the start, not bolted on as an afterthought six months later",
      "Admin dashboard shipped with every engagement — your ops team works without calling engineering",
      "CI/CD pipeline configured on delivery so your team can deploy with confidence from Day 1"
    ],
    reviews: [
      {
        author: "Amit Jain",
        role: "Managing Director",
        company: "Hindustan FinServe",
        rating: 5,
        text: "The portal they built for us communicates trust and compliance exactly the way we needed. Investors land on our page and immediately see a professional, RBI-aware advisory firm — not just another financial website. Lead quality improved immediately."
      },
      {
        author: "Rajesh Verma",
        role: "Founder",
        company: "MeraTM",
        rating: 5,
        text: "The full-stack application they built handles our entire trademark and legal services workflow. Multi-step flows, document management, user onboarding — all clean, fast, and maintained with a codebase we actually understand."
      },
      {
        author: "Kiran Desai",
        role: "Operations Head",
        company: "VendorTrack Logistics",
        rating: 5,
        text: "We needed a vendor management portal in 8 weeks. They scoped it precisely, shipped the MVP on time, and the admin dashboard they built means our ops team runs the entire system without calling engineering once."
      }
    ]
  }
];

export const fallbackProjects: Project[] = [
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
    ],
    review: {
      author: "Suresh Pandey",
      role: "Director",
      company: "Om Travels Satna",
      rating: 5,
      text: "Our travel website went from a static brochure to a full booking experience. Customers can now browse packages, plan itineraries, and send enquiries in one seamless flow. The response from clients was immediate and the leads coming in are far more qualified."
    }
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
    ],
    review: {
      author: "Rajesh Verma",
      role: "Founder",
      company: "MeraTM",
      rating: 5,
      text: "NextGen Ventures built us a platform that genuinely made legal services approachable. The flows are clean, the interface is fast, and our clients can complete trademark and company filing journeys without needing to call us. The quality of engineering work is evident — we own the code fully."
    }
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
    ],
    review: {
      author: "Amit Jain",
      role: "Managing Director",
      company: "Hindustan FinServe",
      rating: 5,
      text: "The website they built for us communicates trust and compliance exactly the way we needed. Investors land on our page and immediately see a professional, RBI-aware advisory firm — not just another financial website. We've closed larger consultations since launch."
    }
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
    ],
    review: {
      author: "Arun Kapoor",
      role: "Managing Partner",
      company: "SigmaTex Consulting",
      rating: 5,
      text: "The corporate website completely changed how enterprise clients perceive us. Professional, fast, and structured exactly right for a quality management consultancy. We closed two enterprise contracts within a month of launch."
    }
  },
  {
    slug: "hcc-fashion-ecommerce",
    title: "Premium Fashion Marketplace Launch",
    client: "HCC Fashion — Henry Castle & Co.",
    category: "Marketplace Growth & E-commerce",
    year: 2024,
    summary:
      "Full marketplace launch for a premium men's fashion brand — Amazon Brand Store setup, complete Flipkart seller onboarding, 50+ SKUs listed across jeans, formal shirts, and casual wear, and a live advertising structure from Day 1.",
    impact:
      "Took Henry Castle & Co. from zero marketplace presence to fully live on Amazon and Flipkart in under 4 weeks. Product listings are live and verifiable — real products, real listings, real brand presence across both platforms.",
    services: ["Marketplace Growth & Management", "E-commerce Imaging & Creative", "UI / UX Design"],
    platforms: ["Amazon", "Flipkart", "Figma", "Adobe Suite"],
    imageUrl: `${imageBase}/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1800&q=80`,
    color: "#ffe45c",
    liveUrl: "https://www.amazon.in/stores/HenryCastleCo/page/EC65B8F2-B1B9-4C37-8BE1-F400657E6E8E",
    metrics: [
      { label: "SKUs listed live", value: "50+" },
      { label: "Marketplace platforms", value: "2" },
      { label: "Days to first live listing", value: "28" }
    ],
    links: hccLinks,
    review: {
      author: "Arjun Mehta",
      role: "Founder",
      company: "Henry Castle & Co.",
      rating: 5,
      text: "NextGen Ventures took us from zero marketplace presence to fully live on Amazon and Flipkart in under a month. The Brand Store, campaign setup, and listing quality all matched the premium positioning we wanted. I'd recommend them to any fashion brand starting out on marketplaces."
    }
  }
];

export const platformNames = [
  "Amazon",
  "Myntra",
  "Flipkart",
  "JioMart",
  "Meesho",
  "Shopify",
  "WooCommerce",
  "WordPress",
  "React",
  "Node.js",
  "PostgreSQL",
  "TypeScript",
  "Figma",
  "Google Ads",
  "Meta Ads",
  "Next.js",
  "Express",
  "Tailwind CSS",
  "Docker"
];
