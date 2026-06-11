import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  ExternalLink,
  Layers,
  Rocket,
  ShieldCheck,
  Target,
  Zap
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "../components/SectionHeading";
import { fallbackServices } from "../data/fallback";
import { api } from "../lib/api";
import type { ClientReview, Service } from "../types";

gsap.registerPlugin(ScrollTrigger);

const PROCESS = [
  {
    Icon: Target,
    label: "Discovery",
    body: "We map your goals, audience, and constraints — before a single pixel or line of code is written."
  },
  {
    Icon: Layers,
    label: "Strategy",
    body: "Full scope, timeline, and deliverable list agreed upfront. Nothing vague, nothing hidden."
  },
  {
    Icon: Zap,
    label: "Execution",
    body: "Structured sprints, clear milestones, and regular check-ins so you always know where things stand."
  },
  {
    Icon: Rocket,
    label: "Delivery",
    body: "We ship, hand off, and stay available for refinements, fixes, and whatever comes next."
  }
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="star-rating" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="14"
          height="14"
          viewBox="0 0 14 14"
          aria-hidden="true"
          className={n <= rating ? "star star--filled" : "star star--empty"}
        >
          <path d="M7 1l1.545 3.13 3.455.502-2.5 2.437.59 3.44L7 8.885 3.91 10.51l.59-3.44L2 4.632l3.455-.502z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: ClientReview }) {
  return (
    <article className="sd-review-card" data-card-interactive>
      <div className="sd-review-card__top">
        <StarRating rating={review.rating} />
        <span className="sd-review-card__verified">Verified Client</span>
      </div>
      <p className="sd-review-card__text">"{review.text}"</p>
      <div className="sd-review-card__author">
        <div className="sd-review-card__avatar" aria-hidden="true">
          {review.author.charAt(0)}
        </div>
        <div>
          <strong>{review.author}</strong>
          <span>{review.role}, {review.company}</span>
        </div>
      </div>
    </article>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq-item${open ? " faq-item--open" : ""}`}>
      <button
        className="faq-trigger"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span>{q}</span>
        <ChevronDown size={20} className="faq-chevron" aria-hidden="true" />
      </button>
      <div className="faq-answer" aria-hidden={!open}>
        <p>{a}</p>
      </div>
    </div>
  );
}

export default function ServiceDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [services, setServices] = useState<Service[]>(fallbackServices);
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    void api.getServices().then((items) => {
      if (active) setServices(items);
    });
    return () => {
      active = false;
    };
  }, []);

  const service = services.find((s) => s.slug === slug);
  if (!service) return <Navigate to="/services" replace />;

  const accentStyle = { "--service-accent": service.accent } as CSSProperties;

  return (
    <ServiceDetailInner
      key={service.slug}
      service={service}
      accentStyle={accentStyle}
      pageRef={pageRef}
    />
  );
}

function ServiceDetailInner({
  service,
  accentStyle,
  pageRef
}: {
  service: Service;
  accentStyle: CSSProperties;
  pageRef: React.RefObject<HTMLDivElement>;
}) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Hero content
      gsap.fromTo(
        ".service-hero__inner > div > *",
        { y: 36, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.11, delay: 0.2 }
      );

      // Why Us title
      gsap.fromTo(
        ".why-us-heading",
        { y: 32, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out",
          scrollTrigger: { trigger: ".why-us-section", start: "top 82%", once: true }
        }
      );

      // Why Us items stagger
      gsap.fromTo(
        ".why-us-item",
        { x: -28, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1, duration: 0.65, ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: ".why-us-grid", start: "top 82%", once: true }
        }
      );

      // Plan cards
      gsap.fromTo(
        ".plan-card",
        { y: 48, autoAlpha: 0, scale: 0.96 },
        {
          y: 0, autoAlpha: 1, scale: 1, duration: 0.9, ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".plans-grid", start: "top 82%", once: true }
        }
      );

      // Process steps
      gsap.fromTo(
        ".process-step-card",
        { y: 40, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.75, ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: ".process-steps-grid", start: "top 82%", once: true }
        }
      );

      // Deliverables
      gsap.fromTo(
        ".deliverable-item",
        { x: -20, autoAlpha: 0 },
        {
          x: 0, autoAlpha: 1, duration: 0.55, ease: "expo.out",
          stagger: 0.06,
          scrollTrigger: { trigger: ".deliverables-grid", start: "top 84%", once: true }
        }
      );

      // Case study cards
      gsap.fromTo(
        ".sd-case-card",
        { y: 56, autoAlpha: 0, scale: 0.95 },
        {
          y: 0, autoAlpha: 1, scale: 1, duration: 0.9, ease: "expo.out",
          stagger: 0.14,
          scrollTrigger: { trigger: ".sd-case-grid", start: "top 82%", once: true }
        }
      );

      // FAQ items
      gsap.fromTo(
        ".faq-item",
        { y: 20, autoAlpha: 0 },
        {
          y: 0, autoAlpha: 1, duration: 0.6, ease: "expo.out",
          stagger: 0.07,
          scrollTrigger: { trigger: ".faq-list", start: "top 84%", once: true }
        }
      );

      // Review cards fan in
      gsap.fromTo(
        ".sd-review-card",
        { y: 44, autoAlpha: 0, scale: 0.96 },
        {
          y: 0, autoAlpha: 1, scale: 1, duration: 0.85, ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ".sd-reviews-grid", start: "top 82%", once: true }
        }
      );
    }, pageRef);

    return () => ctx.revert();
  }, [service.slug]);

  return (
    <>
      <Helmet>
        <title>{service.title} — NextGen Ventures</title>
        <meta name="description" content={service.summary} />
        <meta property="og:title" content={`${service.title} — NextGen Ventures`} />
        <meta property="og:description" content={service.summary} />
        <meta property="og:url" content={`https://nextgenventures.in/services/${service.slug}`} />
      </Helmet>

      <div ref={pageRef}>
        {/* ── Hero ───────────────────────────────────────────── */}
        <section className="service-hero" style={accentStyle}>
          {service.imageUrl && (
            <div
              className="service-hero__bg"
              style={{ backgroundImage: `url(${service.imageUrl})` }}
              aria-hidden="true"
            />
          )}
          <div className="service-hero__inner section-shell">
            <div>
              <p className="eyebrow service-hero__kicker">{service.kicker}</p>
              <h1 className="service-hero__title">{service.title}</h1>
              <p className="service-hero__desc">{service.description}</p>
              <div className="service-hero__actions">
                <Link className="button button--dark" to={`/estimate?service=${service.slug}`}>
                  Start a Project
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link className="button button--light" to="/services">
                  All Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Why Choose NextGen Ventures ────────────────────── */}
        {service.whyUs && service.whyUs.length > 0 && (
          <section className="section-shell why-us-section" style={accentStyle}>
            <div className="why-us-heading">
              <p className="eyebrow">Our Edge</p>
              <h2>Why brands choose NextGen Ventures for {service.title.toLowerCase()}.</h2>
            </div>
            <div className="why-us-grid">
              {service.whyUs.map((point, i) => (
                <div key={i} className="why-us-item">
                  <ShieldCheck
                    size={18}
                    className="why-us-item__icon"
                    aria-hidden="true"
                  />
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Pricing Plans ──────────────────────────────────── */}
        {service.plans && service.plans.length > 0 && (
          <div className="section-bg-warm">
            <section className="section-shell plans-section">
              <SectionHeading
                eyebrow="Pricing"
                title="Pick the plan that fits where you are."
                copy="All plans include a discovery call, clear scope document, and direct communication throughout."
              />
              <div className="plans-grid">
                {service.plans.map((plan) => (
                  <article
                    key={plan.name}
                    className={`plan-card${plan.highlight ? " plan-card--featured" : ""}`}
                    style={accentStyle}
                    data-card-interactive
                  >
                    {plan.highlight && (
                      <span className="plan-badge">Most Popular</span>
                    )}
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      <div className="plan-price-row">
                        <strong className="plan-price">{plan.price}</strong>
                        {plan.priceNote && (
                          <span className="plan-price-note">{plan.priceNote}</span>
                        )}
                      </div>
                      <p className="plan-desc">{plan.description}</p>
                    </div>
                    <ul className="plan-features">
                      {plan.features.map((f) => (
                        <li key={f}>
                          <Check size={14} aria-hidden="true" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Link
                      className={`button plan-cta${plan.highlight ? " button--dark" : " button--outline"}`}
                      to={`/contact?service=${service.slug}&plan=${encodeURIComponent(plan.name)}`}
                    >
                      {plan.cta}
                      <ArrowRight size={16} aria-hidden="true" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── Process ────────────────────────────────────────── */}
        <section className="section-shell process-steps-section">
          <SectionHeading eyebrow="How We Work" title="Structured delivery, every time." />
          <div className="process-steps-grid">
            {PROCESS.map(({ Icon, label, body }, i) => (
              <div key={label} className="process-step-card" style={accentStyle}>
                <span className="process-step-num">{String(i + 1).padStart(2, "0")}</span>
                <Icon size={28} strokeWidth={1.8} aria-hidden="true" />
                <h3>{label}</h3>
                <p>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Deliverables ───────────────────────────────────── */}
        <section className="section-shell deliverables-section">
          <SectionHeading
            eyebrow="Deliverables"
            title="What ships at the end of every engagement."
          />
          <div className="deliverables-grid">
            {service.deliverables.map((item) => (
              <div key={item} className="deliverable-item" style={accentStyle}>
                <Check size={16} aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="platform-chips" style={{ marginTop: "32px" }}>
            {service.platforms.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>
        </section>

        {/* ── Selected Client Work ───────────────────────────── */}
        {service.caseStudies && service.caseStudies.length > 0 && (
          <div className="section-bg-warm">
            <section className="section-shell sd-work-section">
              <SectionHeading
                eyebrow="Our Work"
                title="Real brands. Real results."
                copy="Here's what we've built and delivered in this service line — live, verified, and linked."
              />
              <div className="sd-case-grid">
                {service.caseStudies.map((cs) => (
                  <article
                    key={cs.client}
                    className="sd-case-card"
                    style={{ "--case-color": cs.color } as CSSProperties}
                    data-card-interactive
                  >
                    {/* Image */}
                    <div
                      className="sd-case-card__image"
                      style={{ backgroundImage: `url(${cs.imageUrl})` }}
                      role="img"
                      aria-label={`${cs.client} work preview`}
                    />

                    {/* Body */}
                    <div className="sd-case-card__body">
                      <div className="sd-case-card__meta">
                        <p className="eyebrow">{cs.category}</p>
                        <div className="platform-chips">
                          {cs.platforms.map((p) => (
                            <span key={p}>{p}</span>
                          ))}
                        </div>
                      </div>

                      <h3>{cs.client}</h3>
                      <p>{cs.description}</p>

                      <ul className="sd-case-card__work">
                        {cs.work.slice(0, 4).map((w) => (
                          <li key={w}>
                            <Check size={13} aria-hidden="true" />
                            <span>{w}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Platform links */}
                    {(cs.links && cs.links.length > 0) ? (
                      <div className="sd-case-card__platform-links" onClick={(e) => e.stopPropagation()}>
                        {cs.links.map((link) => (
                          <a
                            key={link.platform}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sd-platform-chip"
                          >
                            <ExternalLink size={11} aria-hidden="true" />
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    ) : cs.liveUrl && (
                      <a
                        href={cs.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="sd-case-card__link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Live</span>
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    )}
                  </article>
                ))}
              </div>

              <div className="sd-work-cta" data-reveal>
                <p>Want results like these for your brand?</p>
                <Link className="button button--dark" to={`/estimate?service=${service.slug}`}>
                  Start a Project
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </section>
          </div>
        )}

        {/* ── FAQ ────────────────────────────────────────────── */}
        {service.faq && service.faq.length > 0 && (
          <section className="section-shell faq-section">
            <SectionHeading eyebrow="FAQ" title="Common questions, direct answers." />
            <div className="faq-list">
              {service.faq.map((item) => (
                <FaqItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </section>
        )}

        {/* ── Client Reviews ─────────────────────────────────── */}
        {service.reviews && service.reviews.length > 0 && (
          <div className="section-bg-near">
            <section className="section-shell sd-reviews-section">
              <SectionHeading
                eyebrow="Client Reviews"
                title="What clients say about working with us."
                copy="Real feedback from brands who've shipped with NextGen Ventures on this service line."
              />
              <div className="sd-reviews-grid">
                {service.reviews.map((review) => (
                  <ReviewCard key={review.author} review={review} />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── Closing CTA ────────────────────────────────────── */}
        <section className="section-shell closing-cta">
          <div data-reveal="left">
            <p className="eyebrow">Ready to build?</p>
            <h2>Start your {service.title} engagement.</h2>
          </div>
          <Link className="button button--dark" to="/contact" data-reveal="right">
            Contact Us
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>
      </div>
    </>
  );
}
