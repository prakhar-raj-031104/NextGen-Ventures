import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import {
  ArrowRight,
  BadgeCheck,
  Boxes,
  Globe,
  Handshake,
  Layers3,
  Lightbulb,
  LineChart,
  MapPin,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "../components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

const MANIFESTO =
  "We combine premium design taste with full-stack engineering depth to build the digital infrastructure that serious commerce brands run on. Every project we take on is scoped for delivery — clear milestones, real content, tested code, and an architecture that scales long after launch day.";

const stats = [
  { value: 30, suffix: "+", label: "Builds delivered", desc: "Across marketplaces, products, and websites" },
  { value: 6, suffix: "", label: "Service lines", desc: "Marketplace · Design · Engineering · Marketing" },
  { value: 5, suffix: "", label: "Marketplace channels", desc: "Amazon · Flipkart · Myntra · JioMart · Meesho" },
  { value: 100, suffix: "%", label: "Ownership model", desc: "You own every asset, code, and account we build" }
];

const services = [
  {
    title: "Marketplace Growth",
    accent: "#36f5a2",
    icon: ShoppingBag,
    summary: "Amazon Brand Store, Flipkart bulk listing, Myntra catalogue, JioMart & Meesho expansion — for brands with zero sales today.",
    slug: "marketplace-growth"
  },
  {
    title: "Digital Marketing",
    accent: "#c084fc",
    icon: TrendingUp,
    summary: "Google Ads, Instagram, Facebook, WhatsApp bulk marketing, email — budget-flexible plans from startup to enterprise.",
    slug: "digital-marketing"
  },
  {
    title: "UI / UX Design",
    accent: "#ff5c35",
    icon: Sparkles,
    summary: "Figma design systems, Framer prototypes, full design-to-dev handoff for apps and websites.",
    slug: "ui-ux-design"
  },
  {
    title: "Website Development",
    accent: "#00a3ff",
    icon: Globe,
    summary: "React / Next.js, WordPress, Shopify & WooCommerce — from landing pages to full e-commerce stores.",
    slug: "website-design-development"
  },
  {
    title: "Product Imaging",
    accent: "#fbbf24",
    icon: Boxes,
    summary: "Marketplace listing images, A+ Content, infographics, brand store banners, and lifestyle shoots.",
    slug: "ecommerce-imaging"
  },
  {
    title: "Application Dev",
    accent: "#ffe45c",
    icon: Zap,
    summary: "SaaS MVPs, internal portals, dashboards, and corporate / enterprise platforms — TypeScript all the way down.",
    slug: "application-development"
  }
];

const approach = [
  {
    num: "01",
    title: "Scope & Strategy",
    body: "We start with the outcome, not the output. Every engagement has clear goals, KPIs, and a defined scope before development begins. No surprises mid-project."
  },
  {
    num: "02",
    title: "Design-led thinking",
    body: "Craft before code. UI/UX systems are built in Figma first, validated with you, then handed off to engineering — ensuring pixel-perfect fidelity from day one."
  },
  {
    num: "03",
    title: "Engineering with ownership",
    body: "Clean TypeScript, tested code, documented APIs. We own the architecture — and you own every asset, account, and repository the moment we deliver."
  },
  {
    num: "04",
    title: "Measure & iterate",
    body: "Analytics, conversion tracking, and marketplace reporting are wired in from the start. Post-launch, we help you read the numbers and act on them fast."
  }
];

const techCategories = [
  { label: "Frontend", items: ["React 18", "TypeScript", "Vite", "GSAP", "Three.js", "Next.js"] },
  { label: "Backend", items: ["Node.js", "Express", "PostgreSQL", "Prisma", "Zod", "Docker"] },
  { label: "Marketplaces", items: ["Amazon Seller Central", "Flipkart Seller Hub", "Myntra Partner", "JioMart", "Meesho"] },
  { label: "Marketing", items: ["Google Ads", "Meta Ads", "WhatsApp Business", "Email Marketing", "GA4"] },
  { label: "Design & CMS", items: ["Figma", "Framer", "WordPress", "Shopify", "WooCommerce"] },
  { label: "DevOps", items: ["Docker", "Nginx", "GitHub Actions", "Vercel", "Railway"] }
];

const timeline = [
  {
    year: "2024",
    title: "Studio Founded",
    body: "NextGen Ventures launched in Bengaluru with a focus on marketplace management and e-commerce for startups competing on Amazon, Flipkart, and Myntra."
  },
  {
    year: "Q1 2025",
    title: "UI/UX & Web Dev Wing",
    body: "Expanded into full-stack website development and Figma-led UI/UX design — serving product companies and D2C brands needing a digital presence."
  },
  {
    year: "Q2 2025",
    title: "Digital Marketing & Imaging",
    body: "Launched Google Ads, Meta, WhatsApp marketing services alongside the in-house e-commerce imaging studio for listing and A+ content creation."
  },
  {
    year: "Q3 2025",
    title: "20+ Builds Delivered",
    body: "Crossed 20 live projects — marketplace builds, SaaS dashboards, brand websites, and app launches across Bengaluru and pan-India clients."
  },
  {
    year: "2026",
    title: "Full-Service Studio",
    body: "30+ builds. 6 service lines. 5 marketplace channels. Still based in Bengaluru, still operating with the precision and speed of day one."
  }
];

const values = [
  {
    icon: BadgeCheck,
    title: "Outcome-led",
    text: "We start with revenue, conversion, and workflow clarity — not aesthetic opinions. Every design and engineering decision ties back to a measurable business goal."
  },
  {
    icon: Layers3,
    title: "System-minded",
    text: "Every page, dashboard, and data model is built as part of a reusable operating system — not a one-off project that breaks the moment someone edits it."
  },
  {
    icon: Handshake,
    title: "Partner energy",
    text: "We embed with your team from day one — founders, ops leads, ecommerce managers — and operate like an internal department, not an external vendor."
  },
  {
    icon: Lightbulb,
    title: "Craft before compromise",
    text: "We don't ship half-measures. If it doesn't meet our own bar for quality — technically, visually, or commercially — it doesn't go live."
  },
  {
    icon: LineChart,
    title: "Data-driven iteration",
    text: "Analytics, marketplace reports, and conversion data are part of every engagement. We help you read the numbers and act on them fast, not once a quarter."
  }
];

const marqueeItems = [
  "Marketplace Growth", "Digital Marketing", "UI / UX Design",
  "Website Development", "Product Imaging", "Application Dev",
  "Amazon", "Flipkart", "Myntra", "JioMart", "Meesho", "Google Ads"
];

export default function About() {
  const pageRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Manifesto scrub word reveal
      const words = gsap.utils.toArray<HTMLElement>(".about-manifesto__word");
      if (words.length) {
        gsap.fromTo(
          words,
          { color: "rgba(255,247,239,0.14)" },
          {
            color: "rgba(255,247,239,0.96)",
            stagger: 0.045,
            ease: "none",
            scrollTrigger: {
              trigger: ".about-manifesto",
              start: "top 72%",
              end: "bottom 28%",
              scrub: 1.4
            }
          }
        );
      }

      // Timeline line draw
      const lineFill = document.querySelector<HTMLElement>(".about-timeline__line-fill");
      if (lineFill) {
        gsap.fromTo(
          lineFill,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: {
              trigger: ".about-timeline",
              start: "top 64%",
              end: "bottom 72%",
              scrub: 1.6
            }
          }
        );
      }

      // Story image parallax
      const storyMedia = document.querySelector<HTMLElement>(".about-story-media");
      if (storyMedia) {
        gsap.to(storyMedia, {
          y: -70,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-origin",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });
      }

      // Hero orbs drift on scroll
      gsap.utils.toArray<HTMLElement>(".about-hero-orb").forEach((orb, i) => {
        gsap.to(orb, {
          y: i === 0 ? -100 : i === 1 ? -140 : -60,
          x: i === 0 ? 30 : i === 1 ? -30 : 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-hero",
            start: "top top",
            end: "bottom top",
            scrub: i === 0 ? 2.2 : i === 1 ? 3 : 1.8
          }
        });
      });

      // Service cards staggered reveal with scale
      gsap.utils.toArray<HTMLElement>(".about-service-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 52, autoAlpha: 0, scale: 0.93 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 0.9,
            ease: "expo.out",
            delay: (i % 3) * 0.08,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true
            }
          }
        );
      });

      // Approach cards slide in from left
      gsap.utils.toArray<HTMLElement>(".about-approach-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { x: i % 2 === 0 ? -48 : 48, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1.05,
            ease: "expo.out",
            scrollTrigger: {
              trigger: card,
              start: "top 87%",
              once: true
            }
          }
        );
      });

      // Tech category cards
      gsap.utils.toArray<HTMLElement>(".about-tech-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.82,
            ease: "expo.out",
            delay: (i % 3) * 0.09,
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              once: true
            }
          }
        );
      });

      // Timeline items alternate reveal
      gsap.utils.toArray<HTMLElement>(".about-timeline-item").forEach((item, i) => {
        gsap.fromTo(
          item,
          { x: 56, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 86%",
              once: true
            }
          }
        );
      });

      // Hero right panel slide in
      gsap.fromTo(
        ".about-hero-panel",
        { x: 64, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out", delay: 0.35 }
      );

      // Panel stat items
      gsap.fromTo(
        ".about-hero-panel__stat",
        { y: 22, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.75, ease: "expo.out", stagger: 0.09, delay: 0.7 }
      );

      // Panel service chips
      gsap.fromTo(
        ".about-hero-panel__chip",
        { scale: 0.78, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.55, ease: "back.out(1.6)", stagger: 0.07, delay: 1.05 }
      );

      // Stats number burst — scale punch
      gsap.utils.toArray<HTMLElement>(".about-stat-card").forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: 40, autoAlpha: 0, scale: 0.88 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            ease: "back.out(1.4)",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              once: true
            }
          }
        );
      });

    }, pageRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>About Us — NextGen Ventures | Digital Studio, Bengaluru</title>
        <meta name="description" content="NextGen Ventures is a focused digital studio in Bengaluru combining premium design, full-stack engineering, and marketplace expertise for ambitious brands." />
        <meta property="og:title" content="About NextGen Ventures — Digital Studio, Bengaluru" />
        <meta property="og:description" content="Commerce · Design · Engineering — the operating philosophy behind every NextGen Ventures engagement." />
        <meta property="og:url" content="https://nextgenventures.in/about" />
      </Helmet>

      {/* ── Cinematic Hero ────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-orb about-hero-orb--1" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb--2" aria-hidden="true" />
        <div className="about-hero-orb about-hero-orb--3" aria-hidden="true" />

        <div className="section-shell about-hero__inner">
          {/* ── Left: copy ──────────────────────────────── */}
          <div className="about-hero__copy">
            <p className="eyebrow" data-reveal="left">About Us — Est. 2024, Bengaluru</p>
            <h1 className="about-hero__headline">
              {["We", "build", "the", "digital", "infrastructure", "commerce", "runs", "on."].map((word, i) => (
                <span key={i} className="hero-word-wrap">
                  <span className="hero-word" style={{ animationDelay: `${0.08 + i * 0.072}s` }}>
                    {word}
                  </span>
                  {" "}
                </span>
              ))}
            </h1>
            <p className="about-hero__sub" data-reveal="left">
              Six service lines. Five marketplace channels. One focused studio in Bengaluru — built to
              ship fast, design with care, and grow brands at every channel they compete on.
            </p>
            <div className="hero-actions" data-reveal="left">
              <Link className="button button--dark" to="/services">
                View Services
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link className="button button--light" to="/contact">
                Start a Project
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* ── Right: studio overview panel ─────────── */}
          <div className="about-hero__right" aria-label="Studio overview">
            <div className="about-hero-panel">
              {/* Top glow accent line */}
              <div className="about-hero-panel__glow-line" aria-hidden="true" />

              {/* Header */}
              <div className="about-hero-panel__header">
                <span className="about-hero-panel__live-dot" aria-hidden="true" />
                <span>Studio Overview</span>
              </div>

              {/* Stats 2×2 grid */}
              <div className="about-hero-panel__stats">
                {stats.map((stat) => (
                  <div key={stat.label} className="about-hero-panel__stat">
                    <strong data-count={stat.value} data-suffix={stat.suffix}>
                      {stat.value}{stat.suffix}
                    </strong>
                    <span>{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Service chips */}
              <div className="about-hero-panel__block">
                <p className="about-hero-panel__block-label">Active Service Lines</p>
                <div className="about-hero-panel__chips">
                  {services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <span
                        key={s.slug}
                        className="about-hero-panel__chip"
                        style={{ "--chip-accent": s.accent } as CSSProperties}
                      >
                        <Icon size={13} aria-hidden="true" />
                        {s.title}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="about-hero-panel__footer">
                <MapPin size={13} aria-hidden="true" />
                <span>Bengaluru, India</span>
                <span className="about-hero-panel__footer-sep" aria-hidden="true">·</span>
                <span>Est. 2024</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Scrolling service marquee ─────────────────────────── */}
      <div className="about-marquee-band" aria-hidden="true">
        <div className="about-marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      {/* ── Manifesto — scrub word reveal ─────────────────────── */}
      <section className="about-manifesto section-shell">
        <p className="eyebrow" data-reveal="left">Our Manifesto</p>
        <p className="about-manifesto__text">
          {MANIFESTO.split(" ").map((word, i) => (
            <span key={i} className="about-manifesto__word">{word}{" "}</span>
          ))}
        </p>
      </section>

      {/* ── Impact Stats ─────────────────────────────────────── */}
      <div className="section-bg-warm">
        <section className="section-shell about-stats-section">
          <div className="about-stats-grid">
            {stats.map((stat) => (
              <article key={stat.label} className="about-stat-card" data-card-interactive>
                <strong data-count={stat.value} data-suffix={stat.suffix}>
                  {stat.value}{stat.suffix}
                </strong>
                <span>{stat.label}</span>
                <p>{stat.desc}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* ── Origin Story ─────────────────────────────────────── */}
      <section className="section-shell about-origin">
        <div className="about-origin__media-wrap">
          <div className="about-story-media" data-scale />
          <div className="about-origin__media-badge" data-reveal="right">
            <strong>Est. 2024</strong>
            <span>Bengaluru, India</span>
          </div>
        </div>
        <div className="about-origin__copy" data-reveal="right">
          <p className="eyebrow">Our Story</p>
          <h2>Started by builders, for brands serious about growth.</h2>
          <p>
            NextGen Ventures was founded in Bengaluru with a clear thesis: most Indian brands competing
            on Amazon, Flipkart, and Myntra were underserved on design and engineering. Great products,
            weak listings, inconsistent branding, and no real digital infrastructure.
          </p>
          <p>
            We built the studio to fix that. We handle everything from marketplace registration and
            catalogue management to full-stack SaaS applications — working with startups who have zero
            marketplace sales today and want to compete seriously tomorrow.
          </p>
          <p>
            Our edge is the combination. Most agencies do marketing or design. We do both — plus
            engineering. One partner, one accountability chain, one integrated system from Day 1.
          </p>
          <Link className="text-link" to="/projects">
            See our work
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ── Services Overview ─────────────────────────────────── */}
      <div className="section-bg-warm">
        <section className="section-shell about-services-section">
          <SectionHeading
            eyebrow="What we do"
            title="Six service lines. One integrated studio."
            copy="Every capability is in-house — no outsourcing, no third-party hand-offs, no broken chains."
          />
          <div className="about-services-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="about-service-card"
                  style={{ "--service-accent": service.accent } as CSSProperties}
                >
                  <div className="about-service-card__icon">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3>{service.title}</h3>
                  <p>{service.summary}</p>
                  <span className="about-service-card__arrow" aria-hidden="true">
                    <ArrowRight size={15} />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Approach ─────────────────────────────────────────── */}
      <section className="section-shell about-approach-section">
        <SectionHeading
          eyebrow="How we work"
          title="Our approach to every project."
          copy="Four stages. No surprises. Fully transparent from brief to launch."
        />
        <div className="about-approach-grid">
          {approach.map((step) => (
            <article key={step.num} className="about-approach-card" data-card-interactive>
              <span className="about-approach-card__num">{step.num}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Tech Stack ───────────────────────────────────────── */}
      <div className="section-bg-near">
        <section className="section-shell about-tech-section">
          <SectionHeading
            eyebrow="Tech & Tools"
            title="What we build with."
            copy="Production-grade tools across every layer — frontend, backend, marketplaces, and marketing."
          />
          <div className="about-tech-grid">
            {techCategories.map((cat) => (
              <div key={cat.label} className="about-tech-card">
                <p className="about-tech-card__label">{cat.label}</p>
                <div className="about-tech-items">
                  {cat.items.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <section className="section-shell about-timeline">
        <SectionHeading eyebrow="Our Journey" title="How we got here." />
        <div className="about-timeline__track">
          <div className="about-timeline__spine">
            <div className="about-timeline__line-fill" />
          </div>
          {timeline.map((item) => (
            <div key={item.year} className="about-timeline-item">
              <div className="about-timeline-item__dot" />
              <div className="about-timeline-item__content" data-card-interactive>
                <span className="about-timeline-item__year">{item.year}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────── */}
      <div className="section-bg-mid">
        <section className="section-shell values-section">
          <SectionHeading
            eyebrow="Principles"
            title="What clients should feel while working with us."
            copy="Clear scope, strong design taste, calm engineering decisions, and visible progress at every step."
          />
          <div className="about-values-grid" data-stagger>
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <article key={value.title} data-card-interactive>
                  <Icon size={24} aria-hidden="true" />
                  <h3>{value.title}</h3>
                  <p>{value.text}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Closing CTA ──────────────────────────────────────── */}
      <div className="section-bg-deep">
        <section className="section-shell closing-cta">
          <div data-reveal="left">
            <p className="eyebrow">Ready to build?</p>
            <h2>Bring your marketplace, marketing, website, or product idea to NextGen Ventures.</h2>
          </div>
          <Link className="button button--dark" to="/contact" data-reveal="right">
            Contact Us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </div>
  );
}
