import { useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  FileText,
  Globe,
  Layers,
  Lock,
  MessageSquare,
  Monitor,
  Palette,
  RefreshCw,
  Send,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  Users,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../lib/api";
import type { TicketPayload } from "../types";

gsap.registerPlugin(ScrollTrigger);

const SERVICE_TYPES = [
  "Website Development",
  "Application Development",
  "UI / UX Design",
  "Marketplace Growth",
  "Digital Marketing",
  "E-commerce Imaging",
  "Other"
];

const REQUEST_TYPES = [
  "Add a new page or section",
  "Update existing content or design",
  "Fix a bug or issue",
  "Performance optimisation",
  "Feature addition",
  "Integrate a new tool or API",
  "SEO or content update",
  "Other request"
];

const TIMELINE_OPTIONS = [
  "ASAP — critical",
  "Within this week",
  "Within 2 weeks",
  "Within a month",
  "Flexible / no rush"
];

type Priority = "NORMAL" | "HIGH" | "URGENT";

const PRIORITY_OPTIONS: { value: Priority; label: string; sla: string; color: string; icon: React.ReactNode }[] = [
  { value: "NORMAL",  label: "Normal",  sla: "3–5 business days", color: "#36f5a2", icon: <Clock size={18} /> },
  { value: "HIGH",    label: "High",    sla: "1–2 business days", color: "#ff9d42", icon: <AlertCircle size={18} /> },
  { value: "URGENT",  label: "Urgent",  sla: "Within 24 hours",   color: "#ff4d4d", icon: <Zap size={18} /> }
];

const WHAT_YOU_CAN_REQUEST = [
  { Icon: FileText,    label: "Add a new page",          desc: "Expand your site with new content sections, landing pages, or feature modules." },
  { Icon: Palette,     label: "Design updates",          desc: "Refresh visuals, update branding, tweak layouts, or improve UI consistency." },
  { Icon: AlertCircle, label: "Bug fixes",               desc: "Report anything broken — layout issues, form errors, broken links, display glitches." },
  { Icon: Zap,         label: "Performance boost",       desc: "Speed optimisations, lazy loading, image compression, Core Web Vitals fixes." },
  { Icon: Sparkles,    label: "New feature",             desc: "Add functionality — booking flows, calculators, dashboards, integrations." },
  { Icon: Globe,       label: "API / tool integration",  desc: "Connect to new APIs, CRMs, payment gateways, analytics tools, or third-party services." },
  { Icon: TrendingUp,  label: "SEO & content",           desc: "Meta tags, schema markup, content updates, blog additions, or sitemap changes." },
  { Icon: MessageSquare, label: "Anything else",         desc: "Not sure what category it falls in? Describe it and we'll figure it out together." }
];

const TICKET_FLOW = [
  { num: "01", label: "Submitted",   status: "OPEN",        color: "#ff6a1a" },
  { num: "02", label: "In Review",   status: "IN_REVIEW",   color: "#ff9d42" },
  { num: "03", label: "In Progress", status: "IN_PROGRESS", color: "#60a5fa" },
  { num: "04", label: "Resolved",    status: "RESOLVED",    color: "#36f5a2" }
];

const initialForm: TicketPayload = {
  clientName: "", email: "", company: "",
  projectRef: "", serviceType: "", requestType: "",
  priority: "NORMAL", title: "", description: "", timeline: ""
};

export default function ClientPortal() {
  const pageRef   = useRef<HTMLDivElement>(null);
  const formRef   = useRef<HTMLFormElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  const [form, setForm]           = useState<TicketPayload>(initialForm);
  const [status, setStatus]       = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg]   = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [copied, setCopied]       = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  const set = (field: keyof TicketPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {

      /* ── Hero ────────────────────────────────────────────── */
      const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });
      heroTl
        .fromTo(".cp-exclusive-badge", { y: -24, opacity: 0, scale: 0.88 }, { y: 0, opacity: 1, scale: 1, duration: 0.7 })
        .fromTo(".cp-hero__word", { y: "120%", opacity: 0 }, { y: "0%", opacity: 1, duration: 1.1, stagger: 0.09 }, "-=0.3")
        .fromTo(".cp-hero__sub", { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.55")
        .fromTo(".cp-hero__actions > *", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.55")
        .fromTo(".cp-ticket-flow", { opacity: 0, x: 48 }, { opacity: 1, x: 0, duration: 1 }, "-=1.1")
        .fromTo(".cp-flow-step", { opacity: 0, scale: 0.72, y: 16 }, { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.14, ease: "back.out(1.5)" }, "-=0.8")
        .fromTo(".cp-flow-line", { scaleX: 0 }, { scaleX: 1, duration: 0.5, stagger: 0.14, ease: "power2.inOut" }, "-=0.65")
        .fromTo(".cp-mini-chip", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.07 }, "-=0.3");

      /* ── "What you can request" ──────────────────────────── */
      gsap.fromTo(".cp-req-card", { y: 40, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, ease: "expo.out", stagger: 0.07,
        scrollTrigger: { trigger: ".cp-req-grid", start: "top 84%" }
      });

      /* ── Sidebar ─────────────────────────────────────────── */
      gsap.fromTo(".cp-panel-block", { opacity: 0, x: -28 }, {
        opacity: 1, x: 0, duration: 0.65, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: ".cp-sidebar", start: "top 82%" }
      });

      /* ── Form sections ───────────────────────────────────── */
      gsap.fromTo(".cp-form-section", { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.65, ease: "expo.out", stagger: 0.12,
        scrollTrigger: { trigger: ".cp-ticket-form", start: "top 86%" }
      });

      /* ── SLA strip ───────────────────────────────────────── */
      gsap.fromTo(".cp-sla-item", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.09,
        scrollTrigger: { trigger: ".cp-sla-strip", start: "top 84%" }
      });

      /* ── Trust strip ─────────────────────────────────────── */
      gsap.fromTo(".cp-trust-stat", { opacity: 0, y: 20 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: ".cp-trust-section", start: "top 82%" }
      });

    }, pageRef);
    return () => ctx.revert();
  }, []);

  const copyTicket = () => {
    void navigator.clipboard.writeText(ticketNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await api.submitTicket(form);
      setTicketNumber(res.data.ticketNumber);
      setStatus("success");

      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.to(formRef.current, {
          opacity: 0, y: -28, duration: 0.45, ease: "power3.in",
          onComplete: () => {
            if (formRef.current)  formRef.current.style.display  = "none";
            if (confirmRef.current) {
              confirmRef.current.style.display = "flex";
              const tl = gsap.timeline();
              tl.fromTo(confirmRef.current, { opacity: 0, scale: 0.88, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: "expo.out" })
                .fromTo(".cp-confirm__ticket-num", { opacity: 0, y: 24, scale: 0.8 }, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: "back.out(1.4)" }, "-=0.45")
                .fromTo(".cp-confirm__step", { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: "expo.out" }, "-=0.4")
                .fromTo(".cp-confirm__back", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }, "-=0.2");
            }
          }
        });
      }
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unable to submit your request. Please try again.");
      // Shake the submit button
      gsap.fromTo(".cp-submit-btn", { x: -8 }, { x: 0, duration: 0.4, ease: "elastic.out(1, 0.3)" });
    }
  };

  return (
    <div ref={pageRef} className="client-portal">
      <Helmet>
        <title>Client Portal — NextGen Ventures | Request Updates</title>
        <meta name="description" content="Existing NextGen Ventures clients: raise a ticket to request changes, additions, or updates to your live project. Tracked, prioritised, resolved." />
      </Helmet>

      {/* ══════════════════════════════════════════════════════ */}
      {/* HERO                                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="cp-hero">
        <div className="cp-hero__noise" aria-hidden="true" />
        <div className="cp-hero__glow" aria-hidden="true" />

        <div className="section-shell cp-hero__layout">
          {/* LEFT */}
          <div className="cp-hero__left">
            <div className="cp-exclusive-badge">
              <Lock size={12} aria-hidden="true" />
              Exclusive — Existing Clients Only
            </div>

            <h1 className="cp-hero__headline">
              {["Your project", "is live.", "We're still", "here."].map((word, i) => (
                <span key={i} className="cp-hero__word-wrap">
                  <span className="cp-hero__word">{word}</span>
                </span>
              ))}
            </h1>

            <p className="cp-hero__sub">
              This portal is <strong>exclusively for active NextGen Ventures clients.</strong> If we've
              already built or are managing your website, app, marketplace account, or campaign — this is
              your dedicated channel to request changes, new additions, bug fixes, or improvements.
              Every request becomes a tracked ticket with a guaranteed response SLA.
            </p>

            <p className="cp-hero__not-client">
              Not yet a client?&nbsp;
              <Link to="/contact" className="cp-hero__contact-link">
                Start a new project <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </p>

            <div className="cp-hero__actions">
              <a href="#submit-ticket" className="button button--primary cp-hero__cta">
                Submit a Request
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <div className="cp-active-indicator">
                <span className="status-dot" aria-hidden="true" />
                Portal Active · 24 / 7
              </div>
            </div>

            {/* Mini request type chips */}
            <div className="cp-mini-chips">
              {["Add a page", "Fix a bug", "New feature", "Update design", "Optimise performance", "API integration"].map((chip) => (
                <span key={chip} className="cp-mini-chip">{chip}</span>
              ))}
            </div>
          </div>

          {/* RIGHT — Ticket flow visualisation */}
          <div className="cp-ticket-flow">
            <div className="cp-flow-header">
              <span className="cp-flow-header__label">Live ticket pipeline</span>
              <span className="cp-flow-header__dot" />
            </div>

            <div className="cp-flow-steps">
              {TICKET_FLOW.map(({ num, label, status: s, color }, i) => (
                <div key={num} className="cp-flow-col">
                  <div className="cp-flow-step" style={{ "--fc": color } as CSSProperties}>
                    <div className="cp-flow-step__ring">
                      <span className="cp-flow-step__num">{num}</span>
                    </div>
                    <span className="cp-flow-step__status">{s}</span>
                    <span className="cp-flow-step__label">{label}</span>
                  </div>
                  {i < TICKET_FLOW.length - 1 && (
                    <div className="cp-flow-line" style={{ "--fc": color } as CSSProperties} aria-hidden="true" />
                  )}
                </div>
              ))}
            </div>

            {/* Sample ticket card */}
            <div className="cp-sample-ticket">
              <div className="cp-sample-ticket__top">
                <span className="cp-sample-ticket__id">NGV-202506-00042</span>
                <span className="cp-sample-ticket__status">IN PROGRESS</span>
              </div>
              <p className="cp-sample-ticket__title">Add testimonials section to homepage</p>
              <div className="cp-sample-ticket__meta">
                <span><Clock size={12} /> Raised 2 days ago</span>
                <span><Users size={12} /> Assigned to design team</span>
              </div>
              <div className="cp-sample-ticket__bar">
                <div className="cp-sample-ticket__fill" />
              </div>
            </div>

            {/* SLA quick view */}
            <div className="cp-flow-sla-row">
              {PRIORITY_OPTIONS.map(({ label, sla, color }) => (
                <div key={label} className="cp-flow-sla" style={{ "--fc": color } as CSSProperties}>
                  <span className="cp-flow-sla__label">{label}</span>
                  <strong className="cp-flow-sla__val">{sla}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* WHAT YOU CAN REQUEST                                  */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="section-shell cp-what-section" data-reveal>
        <div className="cp-section-intro">
          <p className="eyebrow">What you can request</p>
          <h2>Eight categories.<br />One unified ticket system.</h2>
          <p className="cp-section-sub">
            Anything related to your live project — however big or small — can be raised as a ticket.
            Our team triages, assigns, and tracks every request from open to close.
          </p>
        </div>

        <div className="cp-req-grid">
          {WHAT_YOU_CAN_REQUEST.map(({ Icon, label, desc }) => (
            <div key={label} className="cp-req-card" data-card-interactive>
              <div className="cp-req-card__icon">
                <Icon size={20} aria-hidden="true" />
              </div>
              <h3 className="cp-req-card__label">{label}</h3>
              <p className="cp-req-card__desc">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MAIN FORM ZONE                                        */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="section-shell cp-form-zone" id="submit-ticket">
        <div className="cp-form-layout">

          {/* ── SIDEBAR ─────────────────────────────────────── */}
          <aside className="cp-sidebar">

            {/* Identity box */}
            <div className="cp-panel-block cp-panel-identity">
              <div className="cp-panel-identity__icon">
                <ShieldCheck size={22} />
              </div>
              <div>
                <strong>Verified Client Access</strong>
                <p>This portal is visible only to clients actively working with NextGen Ventures. Your project team is notified within 30 minutes of every new ticket.</p>
              </div>
            </div>

            {/* SLA reference */}
            <div className="cp-panel-block cp-panel-sla">
              <span className="cp-panel-block__heading">Response SLA</span>
              {PRIORITY_OPTIONS.map(({ label, sla, color, icon }) => (
                <div key={label} className="cp-sla-row" style={{ "--fc": color } as CSSProperties}>
                  <div className="cp-sla-row__icon">{icon}</div>
                  <div>
                    <span className="cp-sla-row__label">{label}</span>
                    <strong className="cp-sla-row__val">{sla}</strong>
                  </div>
                </div>
              ))}
            </div>

            {/* What happens next */}
            <div className="cp-panel-block cp-panel-process">
              <span className="cp-panel-block__heading">After you submit</span>
              {[
                { Icon: Ticket,        text: "Ticket ID generated instantly" },
                { Icon: MessageSquare, text: "Team notified in ≤ 30 minutes" },
                { Icon: CheckCircle2,  text: "Progress updated at each stage" },
                { Icon: Star,          text: "You're notified on completion" }
              ].map(({ Icon, text }) => (
                <div key={text} className="cp-process-row">
                  <Icon size={15} aria-hidden="true" />
                  {text}
                </div>
              ))}
            </div>

            {/* Not a client? */}
            <div className="cp-panel-block cp-panel-new-client">
              <p>Not yet working with us?</p>
              <Link to="/contact" className="cp-panel-new-client__link">
                Start a project <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </aside>

          {/* ── FORM ────────────────────────────────────────── */}
          <div className="cp-form-container">

            {/* Form header */}
            <div className="cp-form-header">
              <h2 className="cp-form-header__title">Submit a request ticket</h2>
              <p className="cp-form-header__sub">All fields marked <span className="required-mark">*</span> are required. Be as specific as possible — it helps us resolve faster.</p>
            </div>

            <form ref={formRef} className="cp-ticket-form" onSubmit={onSubmit}>

              {/* ── SECTION 1: Who are you? ──────────────────── */}
              <fieldset className="cp-form-section">
                <div className="cp-form-section__head">
                  <span className="cp-form-section__num">01</span>
                  <div>
                    <legend className="cp-form-section__title">Your identity</legend>
                    <p className="cp-form-section__hint">We use this to verify you're an existing client and to contact you with updates.</p>
                  </div>
                </div>
                <div className="cp-field-grid-2">
                  <div className="cp-field">
                    <label htmlFor="cp-name">Your Name <span className="required-mark">*</span></label>
                    <input id="cp-name" required minLength={2} value={form.clientName} onChange={(e) => set("clientName", e.target.value)} placeholder="Full name" />
                  </div>
                  <div className="cp-field">
                    <label htmlFor="cp-email">Work Email <span className="required-mark">*</span></label>
                    <input id="cp-email" required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@company.com" />
                  </div>
                </div>
                <div className="cp-field">
                  <label htmlFor="cp-company">Company / Brand Name <span className="required-mark">*</span></label>
                  <input id="cp-company" required minLength={2} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="The company or brand we've worked on" />
                </div>
              </fieldset>

              {/* ── SECTION 2: Project reference ─────────────── */}
              <fieldset className="cp-form-section">
                <div className="cp-form-section__head">
                  <span className="cp-form-section__num">02</span>
                  <div>
                    <legend className="cp-form-section__title">Project reference</legend>
                    <p className="cp-form-section__hint">Tell us which project and what kind of service needs attention.</p>
                  </div>
                </div>
                <div className="cp-field">
                  <label htmlFor="cp-ref">Project Reference <span className="required-mark">*</span></label>
                  <input id="cp-ref" required minLength={2} value={form.projectRef} onChange={(e) => set("projectRef", e.target.value)} placeholder="e.g. NGV-2025-HCC or your website / app name" />
                  <span className="cp-field__hint">Your project ref is on your original proposal or agreement. When in doubt, use your domain name.</span>
                </div>
                <div className="cp-field-grid-2">
                  <div className="cp-field">
                    <label htmlFor="cp-service">Service Area <span className="required-mark">*</span></label>
                    <select id="cp-service" required value={form.serviceType} onChange={(e) => set("serviceType", e.target.value)}>
                      <option value="">Select the service area</option>
                      {SERVICE_TYPES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="cp-field">
                    <label htmlFor="cp-reqtype">Request Type <span className="required-mark">*</span></label>
                    <select id="cp-reqtype" required value={form.requestType} onChange={(e) => set("requestType", e.target.value)}>
                      <option value="">What kind of change?</option>
                      {REQUEST_TYPES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </fieldset>

              {/* ── SECTION 3: The request ────────────────────── */}
              <fieldset className="cp-form-section">
                <div className="cp-form-section__head">
                  <span className="cp-form-section__num">03</span>
                  <div>
                    <legend className="cp-form-section__title">Request details</legend>
                    <p className="cp-form-section__hint">The more detail you give, the faster we can resolve it.</p>
                  </div>
                </div>

                {/* Priority selector */}
                <div className="cp-field">
                  <label>Priority Level <span className="required-mark">*</span></label>
                  <div className="cp-priority-grid">
                    {PRIORITY_OPTIONS.map(({ value, label, sla, color, icon }) => (
                      <button
                        key={value}
                        type="button"
                        className={`cp-priority-card ${form.priority === value ? "cp-priority-card--active" : ""}`}
                        style={{ "--p-color": color } as CSSProperties}
                        onClick={() => set("priority", value)}
                      >
                        <div className="cp-priority-card__icon">{icon}</div>
                        <strong className="cp-priority-card__label">{label}</strong>
                        <span className="cp-priority-card__sla">{sla}</span>
                        {form.priority === value && (
                          <div className="cp-priority-card__check"><CheckCircle2 size={14} /></div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="cp-field">
                  <label htmlFor="cp-title">Request Title <span className="required-mark">*</span></label>
                  <input id="cp-title" required minLength={5} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="One clear sentence — what do you need?" />
                </div>

                <div className="cp-field">
                  <label htmlFor="cp-desc">
                    Description <span className="required-mark">*</span>
                  </label>
                  <textarea
                    id="cp-desc"
                    required
                    minLength={20}
                    maxLength={3000}
                    rows={6}
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe exactly what needs to change or be added. Share links, screenshots, or references where possible. The more context, the faster we act."
                  />
                  <span className="cp-field__char-count">
                    {form.description.length} / 3000
                    {form.description.length >= 20 && <CheckCircle2 size={12} className="cp-field__char-check" />}
                  </span>
                </div>

                <div className="cp-field">
                  <label htmlFor="cp-timeline">Preferred Timeline</label>
                  <select id="cp-timeline" value={form.timeline} onChange={(e) => set("timeline", e.target.value)}>
                    <option value="">When do you need this done?</option>
                    {TIMELINE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </fieldset>

              {/* ── Submit ───────────────────────────────────── */}
              <div className="cp-form-footer">
                <button className="button button--primary cp-submit-btn" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? (
                    <><RefreshCw size={17} className="spin" /> Submitting…</>
                  ) : (
                    <>Submit Request Ticket <Send size={17} /></>
                  )}
                </button>
                <p className="cp-form-footer__note">
                  <Lock size={12} />
                  Your request is encrypted and visible only to the NextGen Ventures team.
                </p>
                {status === "error" && (
                  <p className="cp-form-error"><AlertCircle size={15} /> {errorMsg}</p>
                )}
              </div>
            </form>

            {/* ── Confirmation ─────────────────────────────────── */}
            <div ref={confirmRef} className="cp-confirm" style={{ display: "none" }}>
              <div className="cp-confirm__glow" aria-hidden="true" />
              <div className="cp-confirm__icon"><CheckCircle2 size={44} /></div>
              <span className="cp-confirm__eyebrow">Ticket Created Successfully</span>
              <div className="cp-confirm__ticket-num">
                <span>{ticketNumber}</span>
                <button type="button" className="cp-copy-btn" onClick={copyTicket} aria-label="Copy ticket number">
                  {copied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="cp-confirm__msg">
                Save this ticket number. You'll receive an email confirmation shortly, and our team
                will respond on your registered email address within the SLA for your chosen priority.
              </p>
              <div className="cp-confirm__steps">
                {[
                  { Icon: Ticket,        text: "Ticket logged and queued" },
                  { Icon: MessageSquare, text: "Team notified within 30 min" },
                  { Icon: Layers,        text: "Progress tracked in pipeline" },
                  { Icon: Zap,           text: "Update delivered & ticket closed" }
                ].map(({ Icon, text }) => (
                  <div key={text} className="cp-confirm__step">
                    <Icon size={15} aria-hidden="true" />
                    {text}
                  </div>
                ))}
              </div>
              <a className="button button--outline cp-confirm__back" href="/client-portal">
                Submit another request
                <ArrowRight size={15} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* TRUST SECTION                                         */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="section-shell cp-trust-section">
        <div className="cp-trust-inner" data-card-interactive>
          <div className="cp-trust-left">
            <p className="eyebrow">Our commitment</p>
            <h2>Every ticket is logged, tracked, and resolved with full transparency.</h2>
            <p>We don't let requests fall through the cracks. Our internal SLA system flags overdue tickets automatically, and your dedicated account contact is always on the loop.</p>
          </div>
          <div className="cp-trust-stats">
            {[
              { value: "< 30m",  label: "Avg. first response" },
              { value: "98%",    label: "Tickets resolved on time" },
              { value: "4.9 ★",  label: "Average satisfaction" },
              { value: "0",      label: "Tickets dropped" }
            ].map(({ value, label }) => (
              <div key={label} className="cp-trust-stat">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════ */}
      {/* SLA STRIP                                             */}
      {/* ══════════════════════════════════════════════════════ */}
      <section className="section-shell cp-sla-strip">
        <div className="cp-sla-grid">
          {[
            { icon: <Clock size={22} />,      label: "Normal SLA",     value: "3–5 business days", color: "#36f5a2" },
            { icon: <AlertCircle size={22} />, label: "High priority",  value: "1–2 business days", color: "#ff9d42" },
            { icon: <Zap size={22} />,         label: "Urgent SLA",     value: "Within 24 hours",   color: "#ff4d4d" },
            { icon: <ShieldCheck size={22} />, label: "Audit trail",    value: "Full ticket history", color: "#60a5fa" }
          ].map(({ icon, label, value, color }) => (
            <div key={label} className="cp-sla-item" style={{ "--fc": color } as CSSProperties} data-card-interactive>
              <div className="cp-sla-item__icon">{icon}</div>
              <span className="cp-sla-item__label">{label}</span>
              <strong className="cp-sla-item__value">{value}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
