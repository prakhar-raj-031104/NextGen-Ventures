import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "../components/SectionHeading";
import { fallbackServices } from "../data/fallback";
import { api } from "../lib/api";
import type { Service } from "../types";

gsap.registerPlugin(ScrollTrigger);

// Catalogue order — development lines first, then commerce & growth.
const SERVICE_ORDER = [
  "website-design-development",
  "application-development",
  "software-development",
  "ecommerce-imaging",
  "marketplace-growth",
  "digital-marketing",
  "ui-ux-design"
];

const orderServices = (list: Service[]): Service[] =>
  [...list].sort(
    (a, b) =>
      (SERVICE_ORDER.indexOf(a.slug) + 1 || 999) - (SERVICE_ORDER.indexOf(b.slug) + 1 || 999)
  );

export default function Services() {
  const [services, setServices] = useState<Service[]>(() => orderServices(fallbackServices));
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void api.getServices().then((items) => {
      if (active) setServices(orderServices(items));
    });
    return () => {
      active = false;
    };
  }, []);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // ── Desktop / tablet (≥861px): full sticky-stack animation ─────────
      mm.add("(min-width: 861px)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".service-detail");
        const HEADER = 88;

        cards.forEach((card, i) => {
          if (i === cards.length - 1) return;

          // Pin: freeze each card once it reaches the sticky top
          ScrollTrigger.create({
            trigger: card,
            start: `top ${HEADER}px`,
            endTrigger: ".service-fit",
            end: "top bottom",
            pin: true,
            pinSpacing: false,
            anticipatePin: 1,
            invalidateOnRefresh: true
          });

          // Scale down as the next card slides up — snappier scrub
          gsap.to(card, {
            scale: 0.92,
            ease: "none",
            scrollTrigger: {
              trigger: cards[i + 1],
              start: "top bottom",
              end: `top ${HEADER}px`,
              scrub: 0.5,
              invalidateOnRefresh: true
            }
          });
        });
      });

      // ── Mobile (<861px): plain stagger entrance, no pinning ────────────
      mm.add("(max-width: 860px)", () => {
        gsap.fromTo(
          ".service-detail",
          { y: 36, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.7,
            ease: "expo.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".service-detail-list",
              start: "top 82%",
              once: true
            }
          }
        );
      });

      // ── Fit-grid entrance (all viewports) ──────────────────────────────
      gsap.fromTo(
        ".fit-grid article",
        { y: 36, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".fit-grid", start: "top 82%", once: true }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [services]);

  return (
    <div ref={pageRef}>
      <Helmet>
        <title>Services — NextGen Ventures | Marketplace, Marketing, Design & Development</title>
        <meta name="description" content="Marketplace growth (Amazon, Flipkart, Myntra, JioMart, Meesho), digital marketing, UI/UX design, website development, e-commerce imaging, and application development." />
        <meta property="og:title" content="Services — NextGen Ventures" />
        <meta property="og:description" content="6 focused service lines: Marketplace Growth, Digital Marketing, UI/UX Design, Website Development, E-commerce Imaging, and Application Development." />
        <meta property="og:url" content="https://nextgenventures.in/services" />
      </Helmet>

      <section className="page-hero section-shell">
        <div data-reveal="left">
          <p className="eyebrow">Services</p>
          <h1>Marketplace growth, digital marketing, design, websites, and applications.</h1>
        </div>
        <p data-reveal="right">
          NextGen Ventures covers the full digital stack — from Amazon and Flipkart marketplace management
          to Google Ads, UI/UX design, WordPress and React websites, product imaging, and custom applications.
          Real work for real brands — with live results you can verify.
        </p>
      </section>

      <section className="section-shell service-detail-list">
        {services.map((service, index) => (
          <article
            className="service-detail"
            key={service.slug}
            style={{ "--accent": service.accent, zIndex: index + 1 } as CSSProperties}
            data-card-interactive
          >
            <div
              className="service-detail__media"
              style={{ backgroundImage: service.imageUrl ? `url(${service.imageUrl})` : undefined }}
            />
            <div className="service-detail__content">
              <span className="service-detail__num">{String(index + 1).padStart(2, "0")}</span>
              <p className="eyebrow">{service.kicker}</p>
              <h2>{service.title}</h2>
              <p>{service.description}</p>

              {/* Deliverables */}
              <div className="deliverables">
                {service.deliverables.slice(0, 5).map((item) => (
                  <span key={item}>
                    <Check size={15} aria-hidden="true" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Client work badge strip */}
              {service.caseStudies && service.caseStudies.length > 0 && (
                <div className="service-detail__clients">
                  <span className="service-detail__clients-label">Work done for:</span>
                  {service.caseStudies.map((cs) => (
                    <span
                      key={cs.client}
                      className="service-detail__client-badge"
                      style={{ "--badge-color": cs.color } as CSSProperties}
                    >
                      {cs.client}
                    </span>
                  ))}
                </div>
              )}

              <div className="platform-chips" style={{ marginTop: "4px" }}>
                {service.platforms.map((platform) => (
                  <span key={platform}>{platform}</span>
                ))}
              </div>

              <Link
                className="service-detail__cta"
                to={`/services/${service.slug}`}
              >
                View Plans & Our Work
                <ArrowUpRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </section>

      <section className="section-shell service-fit">
        <SectionHeading
          eyebrow="Best Fit"
          title="Built for founders, ecommerce brands, and teams replacing manual workflows."
        />
        <div className="fit-grid">
          <article data-card-interactive>
            <h3>For marketplace brands</h3>
            <p>
              Launch from zero or scale existing operations — listings, catalog management, brand store,
              campaign tracking, and product images across Amazon, Flipkart, Myntra, JioMart, and Meesho.
            </p>
          </article>
          <article data-card-interactive>
            <h3>For growth-focused businesses</h3>
            <p>
              Run Google Ads, manage your Instagram and Facebook handles, deploy WhatsApp bulk campaigns,
              and track leads with a digital marketing setup built around your budget.
            </p>
          </article>
          <article data-card-interactive>
            <h3>For brands needing a web presence</h3>
            <p>
              Get a premium React or WordPress website, an ecommerce storefront, or a full-stack
              application — designed with motion, SEO foundations, and a CMS your team can manage.
            </p>
          </article>
          <article data-card-interactive>
            <h3>For product teams & corporates</h3>
            <p>
              Turn complex workflows into clean SaaS dashboards, admin portals, or enterprise platforms
              with React, typed APIs, PostgreSQL data models, and role-based access from day one.
            </p>
          </article>
        </div>
        <Link className="button button--dark" to="/contact" data-reveal>
          Plan a Project
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
