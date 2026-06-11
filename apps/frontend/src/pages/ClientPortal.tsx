import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  AtSign,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  Globe,
  IndianRupee,
  Info,
  KeyRound,
  Layers,
  Lock,
  LogIn,
  LogOut,
  Mail,
  MessageSquare,
  Palette,
  Phone,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  TrendingUp,
  UserPlus,
  Users,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../lib/api";
import { addOnEstimates } from "../data/fallback";
import { useClientAuth } from "../hooks/useClientAuth";
import type { ClientPayment, ClientTicketRow, TicketPayload } from "../types";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

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

  const set = (field: keyof TicketPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Interactive add-on estimate
  const [addOns, setAddOns] = useState<string[]>([]);
  const addOnTotal = addOns.reduce(
    (sum, label) => sum + (addOnEstimates.find((a) => a.label === label)?.amount ?? 0),
    0
  );
  const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const estimateLabel = addOns.length ? `${fmtINR(addOnTotal)}+` : "";
  const addAddOn = (label: string) => { if (label && !addOns.includes(label)) setAddOns((p) => [...p, label]); };
  const removeAddOn = (label: string) => setAddOns((p) => p.filter((l) => l !== label));

  /* ── Authentication ──────────────────────────────────────── */
  const auth = useClientAuth();

  /* ── Account dashboard data (payments + tickets) ─────────── */
  const [payments, setPayments] = useState<ClientPayment[]>([]);
  const [myTickets, setMyTickets] = useState<ClientTicketRow[]>([]);
  const [dashLoading, setDashLoading] = useState(false);

  const loadDash = useCallback(async () => {
    if (!auth.token) return;
    setDashLoading(true);
    try {
      const [pay, tks] = await Promise.all([
        api.getMyPayments(auth.token),
        api.getMyTickets(auth.token)
      ]);
      setPayments(pay);
      setMyTickets(tks);
    } catch {
      /* non-critical — the portal still works without the dashboard */
    } finally {
      setDashLoading(false);
    }
  }, [auth.token]);

  useEffect(() => {
    if (auth.account && auth.token) void loadDash();
  }, [auth.account, auth.token, loadDash]);

  const totalPaid = payments
    .filter((p) => p.status === "PAID")
    .reduce((sum, p) => sum + p.amount, 0);
  const [authMode, setAuthMode]   = useState<"register" | "login">("register");
  const [authStatus, setAuthStatus] = useState<"idle" | "working">("idle");
  const [authError, setAuthError]   = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [genPassword, setGenPassword]   = useState("");   // one-time generated password
  const [pwCopied, setPwCopied]         = useState(false);

  const [reg, setReg] = useState({ name: "", email: "", company: "", domain: "", mobile: "", dob: "" });
  const [login, setLogin] = useState({ identifier: "", password: "" });

  // Forgot password (OTP) flow
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<"request" | "verify" | "done">("request");
  const [forgot, setForgot] = useState({ email: "", domain: "", dob: "", otp: "" });
  const [forgotPw, setForgotPw] = useState("");
  const [forgotBusy, setForgotBusy] = useState(false);
  const [forgotMsg, setForgotMsg] = useState("");
  const setForgotField = (f: keyof typeof forgot, v: string) => setForgot((p) => ({ ...p, [f]: v }));

  const onForgotRequest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setForgotBusy(true); setForgotMsg("");
    try {
      await api.forgotRequest({ email: forgot.email, domain: forgot.domain, dob: forgot.dob });
      setForgotStep("verify");
      setForgotMsg("If your details match, a 6-digit code has been emailed to you.");
    } catch (err) { setForgotMsg(err instanceof Error ? err.message : "Unable to send code."); }
    finally { setForgotBusy(false); }
  };

  const onForgotVerify = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setForgotBusy(true); setForgotMsg("");
    try {
      const pw = await api.forgotVerify({ email: forgot.email, otp: forgot.otp });
      setForgotPw(pw); setForgotStep("done");
    } catch (err) { setForgotMsg(err instanceof Error ? err.message : "Invalid code."); }
    finally { setForgotBusy(false); }
  };

  const setRegField   = (f: keyof typeof reg, v: string)   => setReg((p) => ({ ...p, [f]: v }));
  const setLoginField = (f: keyof typeof login, v: string) => setLogin((p) => ({ ...p, [f]: v }));

  // Live preview of the password rule so the client understands how it's derived.
  const passwordPreview = (() => {
    const host = reg.domain.trim().toLowerCase()
      .replace(/^[a-z]+:\/\//, "").replace(/^www\./, "").replace(/[/?#].*$/, "");
    const letters = (host.match(/[a-z0-9]/g) ?? []).join("");
    if (!letters && !reg.dob) return "";
    const stub = (letters.slice(0, 4) || "····").padEnd(4, "·");
    const capped = stub.charAt(0).toUpperCase() + stub.slice(1);
    const [y, m, d] = reg.dob ? reg.dob.split("-") : ["", "", ""];
    const dobPart = reg.dob ? `${d}${m}${y}` : "DDMMYYYY";
    return `${capped}${dobPart}`;
  })();

  const onRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthStatus("working");
    setAuthError("");
    try {
      const password = await auth.register(reg);
      if (password) setGenPassword(password);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Unable to create your account.");
    } finally {
      setAuthStatus("idle");
    }
  };

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthStatus("working");
    setAuthError("");
    try {
      await auth.login(login);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setAuthStatus("idle");
    }
  };

  const copyPassword = () => {
    void navigator.clipboard.writeText(genPassword);
    setPwCopied(true);
    setTimeout(() => setPwCopied(false), 2200);
  };

  // Prefill the ticket form from the signed-in account so clients don't retype it.
  useEffect(() => {
    if (!auth.account) return;
    setForm((prev) => ({
      ...prev,
      clientName: prev.clientName || auth.account!.name,
      email:      prev.email      || auth.account!.email,
      company:    prev.company    || auth.account!.company,
      projectRef: prev.projectRef || auth.account!.domain
    }));
  }, [auth.account]);

  const handleLogout = () => {
    auth.logout();
    setGenPassword("");
    setLogin({ identifier: "", password: "" });
    setReg({ name: "", email: "", company: "", domain: "", mobile: "", dob: "" });
    setAuthMode("login");
  };

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
    if (!auth.token) {
      setStatus("error");
      setErrorMsg("Your session has expired. Please sign in again.");
      return;
    }
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await api.submitTicket(
        { ...form, addOns, estimate: estimateLabel || undefined },
        auth.token
      );
      setTicketNumber(res.data.ticketNumber);
      setStatus("success");
      void loadDash();

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

            {/* ══════════════════════════════════════════════════ */}
            {/* AUTH GATE — register / login before raising tickets */}
            {/* ══════════════════════════════════════════════════ */}
            {!auth.account ? (
              <div className="cp-auth">
                <div className="cp-auth__head">
                  <div className="cp-auth__icon"><KeyRound size={22} /></div>
                  <div>
                    <h2 className="cp-auth__title">Client portal access</h2>
                    <p className="cp-auth__sub">
                      Sign in with your registered email or domain and the portal password we shared with you.
                    </p>
                  </div>
                </div>

                {/* ── LOGIN ──────────────────────────────────── */}
                <form className="cp-auth__form" onSubmit={onLogin}>
                  <div className="cp-field">
                    <label htmlFor="lg-id"><AtSign size={13} /> Email or Domain <span className="required-mark">*</span></label>
                    <input id="lg-id" required value={login.identifier} onChange={(e) => setLoginField("identifier", e.target.value)} placeholder="you@company.com or yourbrand.com" />
                  </div>
                  <div className="cp-field">
                    <label htmlFor="lg-pw"><KeyRound size={13} /> Portal Password <span className="required-mark">*</span></label>
                    <div className="cp-pw-input">
                      <input id="lg-pw" required type={showPassword ? "text" : "password"} value={login.password} onChange={(e) => setLoginField("password", e.target.value)} placeholder="The password we shared with you" />
                      <button type="button" className="cp-pw-input__toggle" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {authError && <p className="cp-form-error"><AlertCircle size={15} /> {authError}</p>}

                  <button className="button button--primary cp-auth__submit" type="submit" disabled={authStatus === "working"}>
                    {authStatus === "working" ? (<><RefreshCw size={17} className="spin" /> Signing in…</>) : (<>Sign in <LogIn size={16} /></>)}
                  </button>
                  <p className="cp-auth__switch">
                    <button type="button" onClick={() => { setForgotOpen((v) => !v); setForgotStep("request"); setForgotMsg(""); }}>
                      Forgot password?
                    </button>
                    {" · "}Don't have access yet? <Link to="/contact">Contact us</Link>.
                  </p>
                </form>

                {forgotOpen && (
                  <div className="cp-pw-rule" style={{ marginTop: 8 }}>
                    {forgotStep === "request" && (
                      <form className="cp-auth__form" onSubmit={onForgotRequest}>
                        <div className="cp-pw-rule__top"><KeyRound size={15} /><span>Reset your password</span></div>
                        <div className="cp-field">
                          <label htmlFor="fg-email"><Mail size={13} /> Email</label>
                          <input id="fg-email" required type="email" value={forgot.email} onChange={(e) => setForgotField("email", e.target.value)} placeholder="you@company.com" />
                        </div>
                        <div className="cp-field">
                          <label htmlFor="fg-domain"><Globe size={13} /> Domain</label>
                          <input id="fg-domain" required value={forgot.domain} onChange={(e) => setForgotField("domain", e.target.value)} placeholder="yourbrand.com" />
                        </div>
                        <div className="cp-field">
                          <label htmlFor="fg-dob"><Calendar size={13} /> Date of Birth</label>
                          <input id="fg-dob" required type="date" value={forgot.dob} onChange={(e) => setForgotField("dob", e.target.value)} />
                        </div>
                        {forgotMsg && <p className="cp-field__hint">{forgotMsg}</p>}
                        <button className="button button--primary cp-auth__submit" type="submit" disabled={forgotBusy}>
                          {forgotBusy ? <><RefreshCw size={16} className="spin" /> Sending…</> : <>Send code</>}
                        </button>
                      </form>
                    )}
                    {forgotStep === "verify" && (
                      <form className="cp-auth__form" onSubmit={onForgotVerify}>
                        <div className="cp-pw-rule__top"><KeyRound size={15} /><span>Enter the 6-digit code</span></div>
                        {forgotMsg && <p className="cp-field__hint">{forgotMsg}</p>}
                        <div className="cp-field">
                          <label htmlFor="fg-otp">Verification code</label>
                          <input id="fg-otp" required maxLength={6} value={forgot.otp} onChange={(e) => setForgotField("otp", e.target.value)} placeholder="123456" />
                        </div>
                        <button className="button button--primary cp-auth__submit" type="submit" disabled={forgotBusy}>
                          {forgotBusy ? <><RefreshCw size={16} className="spin" /> Verifying…</> : <>Verify &amp; get password</>}
                        </button>
                      </form>
                    )}
                    {forgotStep === "done" && (
                      <div className="cp-pw-rule__preview">
                        <span className="cp-pw-rule__label">Your password (also emailed to you)</span>
                        <code className="cp-pw-rule__value">{forgotPw}</code>
                      </div>
                    )}
                  </div>
                )}

                <p className="cp-auth__note"><Lock size={12} /> Credentials are encrypted. Passwords are stored hashed — never in plain text.</p>
              </div>
            ) : (
            <>
            {/* One-time generated-password reveal (after registration) */}
            {genPassword && (
              <div className="cp-cred-reveal">
                <div className="cp-cred-reveal__icon"><CheckCircle2 size={26} /></div>
                <div className="cp-cred-reveal__body">
                  <strong>Your portal password</strong>
                  <p>Save this now — you'll use it (with your email or domain) for every future login.</p>
                  <div className="cp-cred-reveal__value">
                    <code>{genPassword}</code>
                    <button type="button" className="cp-copy-btn" onClick={copyPassword} aria-label="Copy password">
                      {pwCopied ? <CheckCircle2 size={15} /> : <Copy size={15} />}
                      {pwCopied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <button type="button" className="cp-cred-reveal__dismiss" onClick={() => setGenPassword("")}>
                    I've saved it — continue <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* Signed-in account bar */}
            <div className="cp-account-bar">
              <div className="cp-account-bar__who">
                <div className="cp-account-bar__avatar"><ShieldCheck size={18} /></div>
                <div>
                  <strong>{auth.account.name}</strong>
                  <span>{auth.account.domain} · {auth.account.email}</span>
                </div>
              </div>
              <button type="button" className="cp-account-bar__logout" onClick={handleLogout}>
                <LogOut size={15} /> Sign out
              </button>
            </div>

            {/* ── Account dashboard (details · payments · tickets) ── */}
            <div className="cp-dash">
              {/* Account details */}
              <section className="cp-dash-card">
                <div className="cp-dash-card__head"><Users size={16} /><h3>Your account details</h3></div>
                <div className="cp-table-wrap">
                  <table className="cp-table">
                    <tbody>
                      <tr><th>Name</th><td>{auth.account.name}</td></tr>
                      <tr><th>Email</th><td>{auth.account.email}</td></tr>
                      <tr><th>Company / Brand</th><td>{auth.account.company}</td></tr>
                      <tr><th>Domain</th><td>{auth.account.domain}</td></tr>
                      <tr><th>Mobile</th><td>{auth.account.mobile}</td></tr>
                      <tr><th>Date of birth</th><td>{fmtDate(auth.account.dob)}</td></tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Payments */}
              <section className="cp-dash-card">
                <div className="cp-dash-card__head">
                  <CreditCard size={16} /><h3>Your payments</h3>
                  {payments.length > 0 && <span className="cp-dash-card__total">Total paid: {fmtINR(totalPaid)}</span>}
                </div>
                {dashLoading ? <p className="cp-dash-empty">Loading…</p>
                  : payments.length === 0 ? <p className="cp-dash-empty">No payments recorded yet.</p> : (
                  <div className="cp-table-wrap">
                    <table className="cp-table cp-table--data">
                      <thead><tr><th>Date</th><th>Description</th><th>Invoice</th><th>Method</th><th>Amount</th><th>Status</th></tr></thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id}>
                            <td>{fmtDate(p.paidAt)}</td>
                            <td>{p.description}</td>
                            <td>{p.invoiceNo ?? "—"}</td>
                            <td>{p.method ?? "—"}</td>
                            <td className="cp-table__amount">{fmtINR(p.amount)}</td>
                            <td><span className="cp-pill" data-st={p.status}>{p.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>

              {/* Tickets */}
              <section className="cp-dash-card">
                <div className="cp-dash-card__head"><Ticket size={16} /><h3>Your tickets</h3></div>
                {dashLoading ? <p className="cp-dash-empty">Loading…</p>
                  : myTickets.length === 0 ? <p className="cp-dash-empty">No tickets yet — raise your first request below.</p> : (
                  <div className="cp-table-wrap">
                    <table className="cp-table cp-table--data">
                      <thead><tr><th>Ticket</th><th>Title</th><th>Service</th><th>Priority</th><th>Raised</th><th>Status</th></tr></thead>
                      <tbody>
                        {myTickets.map((tk) => (
                          <tr key={tk.id}>
                            <td className="cp-table__mono">{tk.ticketNumber}</td>
                            <td>{tk.title || tk.requestType}</td>
                            <td>{tk.serviceType}</td>
                            <td>{tk.priority}</td>
                            <td>{fmtDate(tk.createdAt)}</td>
                            <td><span className="cp-pill" data-st={tk.status}>{tk.status.replace(/_/g, " ")}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </div>

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
                  <label htmlFor="cp-title">Request Title</label>
                  <input id="cp-title" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="One clear sentence — what do you need?" />
                </div>

                <div className="cp-field">
                  <label htmlFor="cp-desc">
                    Description
                  </label>
                  <textarea
                    id="cp-desc"
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

              {/* ── Build your add-on estimate ───────────────── */}
              <div className="cp-estimate">
                <div className="cp-estimate__head">
                  <div className="cp-estimate__icon"><IndianRupee size={18} /></div>
                  <div>
                    <span className="cp-estimate__title">Add services to your request</span>
                    <p className="cp-estimate__hint">Pick the add-ons you need — we'll total a quick estimate for you.</p>
                  </div>
                </div>

                {/* Dropdown to add a service */}
                <div className="cp-field">
                  <select
                    className="cp-addon-select"
                    value=""
                    onChange={(e) => { addAddOn(e.target.value); e.target.value = ""; }}
                  >
                    <option value="">+ Add a service…</option>
                    {addOnEstimates
                      .filter((a) => !addOns.includes(a.label))
                      .map((a) => (
                        <option key={a.label} value={a.label}>{a.label} — {a.price} ({a.unit})</option>
                      ))}
                  </select>
                </div>

                {/* Selected add-ons */}
                {addOns.length > 0 && (
                  <ul className="cp-estimate__list">
                    {addOns.map((label) => {
                      const item = addOnEstimates.find((a) => a.label === label);
                      if (!item) return null;
                      return (
                        <li key={label} className="cp-estimate__row">
                          <div className="cp-estimate__label">
                            <span>{item.label}</span>
                            {item.note && <small>{item.note}</small>}
                          </div>
                          <div className="cp-estimate__price">
                            <strong>{item.price}</strong>
                            <span>{item.unit}</span>
                          </div>
                          <button type="button" className="cp-addon-remove" onClick={() => removeAddOn(label)} aria-label={`Remove ${item.label}`}>×</button>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {/* Running total */}
                <div className="cp-estimate__total">
                  <span>Estimated total</span>
                  <strong>{addOns.length ? `${fmtINR(addOnTotal)}+` : "—"}</strong>
                </div>

                <p className="cp-estimate__note">
                  <Info size={13} /> Final price may vary — this is a short estimate. Hosting is free for the first 3 years on new builds; final pricing depends on scope and platform costs.
                </p>
              </div>

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
            </>
            )}
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
