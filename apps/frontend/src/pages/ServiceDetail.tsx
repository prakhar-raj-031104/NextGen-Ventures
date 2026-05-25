import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowRight, Check, ChevronDown, Layers, Rocket, Target, Zap } from "lucide-react";
import { SectionHeading } from "../components/SectionHeading";
import { fallbackServices } from "../data/fallback";
import { api } from "../lib/api";
import type { Service } from "../types";

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
    <>
      {/* ── Hero ── */}
      <section className="service-hero" style={accentStyle}>
        {service.imageUrl && (
          <div
            className="service-hero__bg"
            style={{ backgroundImage: `url(${service.imageUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="service-hero__inner section-shell">
          <div data-reveal="left">
            <p className="eyebrow service-hero__kicker">{service.kicker}</p>
            <h1 className="service-hero__title">{service.title}</h1>
            <p className="service-hero__desc">{service.description}</p>
            <div className="service-hero__actions">
              <Link className="button button--dark" to="/contact">
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

      {/* ── Pricing Plans ── */}
      {service.plans && service.plans.length > 0 && (
        <section className="section-shell plans-section">
          <SectionHeading
            eyebrow="Pricing"
            title="Pick the plan that fits where you are."
            copy="All plans include a discovery call, clear scope document, and direct communication throughout the engagement."
          />
          <div className="plans-grid" data-stagger>
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
      )}

      {/* ── Process ── */}
      <section className="section-shell process-steps-section">
        <SectionHeading eyebrow="How We Work" title="Structured delivery, every time." />
        <div className="process-steps-grid" data-stagger>
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

      {/* ── Deliverables ── */}
      <section className="section-shell deliverables-section">
        <SectionHeading
          eyebrow="Deliverables"
          title="What ships at the end of every engagement."
        />
        <div className="deliverables-grid" data-stagger>
          {service.deliverables.map((item) => (
            <div key={item} className="deliverable-item" style={accentStyle}>
              <Check size={16} aria-hidden="true" />
              <span>{item}</span>
            </div>
          ))}
        </div>
        <div className="platform-chips" data-reveal style={{ marginTop: "32px" }}>
          {service.platforms.map((p) => (
            <span key={p}>{p}</span>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      {service.faq && service.faq.length > 0 && (
        <section className="section-shell faq-section">
          <SectionHeading eyebrow="FAQ" title="Common questions, direct answers." />
          <div className="faq-list" data-reveal>
            {service.faq.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </section>
      )}

      {/* ── CTA ── */}
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
    </>
  );
}
