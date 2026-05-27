import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { DragEvent, FormEvent } from "react";
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  Code2,
  FileText,
  Globe,
  Linkedin,
  Mail,
  Megaphone,
  Monitor,
  Package,
  RefreshCw,
  Send,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  Users,
  X,
  Zap
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { api } from "../lib/api";
import type { InternshipPayload } from "../types";

gsap.registerPlugin(ScrollTrigger);

const ROLES = [
  { Icon: Code2, title: "Frontend Developer", type: "Technical", duration: "3–6 months", skills: ["React / Next.js", "TypeScript", "GSAP / CSS"], spots: 2, color: "#ff6a1a", desc: "Build premium, high-performance interfaces for live client products." },
  { Icon: Monitor, title: "Backend Developer", type: "Technical", duration: "3–6 months", skills: ["Node.js / Express", "PostgreSQL", "REST APIs"], spots: 2, color: "#ff9d42", desc: "Develop scalable APIs and backend services powering real products." },
  { Icon: Sparkles, title: "UI / UX Designer", type: "Design", duration: "3–6 months", skills: ["Figma", "User Research", "Interaction Design"], spots: 1, color: "#a78bfa", desc: "Design interfaces that are both beautiful and conversion-optimised." },
  { Icon: Megaphone, title: "Digital Marketing", type: "Marketing", duration: "3–6 months", skills: ["SEO / SEM", "Meta & Google Ads", "Content Strategy"], spots: 2, color: "#36f5a2", desc: "Plan and run digital campaigns for marketplace and B2B clients." },
  { Icon: ShoppingBag, title: "Marketplace Ops", type: "Commerce", duration: "3–6 months", skills: ["Amazon Seller Central", "Flipkart Partner", "Catalog Mgmt"], spots: 2, color: "#60a5fa", desc: "Manage listings and account health for D2C brands on platforms." },
  { Icon: FileText, title: "Content Writing", type: "Creative", duration: "3–6 months", skills: ["Brand Copywriting", "SEO Writing", "Product Descriptions"], spots: 1, color: "#f472b6", desc: "Write compelling copy for product pages, campaigns, and brands." }
];

const STATS = [
  { value: "6", label: "Open Roles" },
  { value: "₹8K–15K", label: "Monthly Stipend" },
  { value: "5 Days", label: "Response Time" }
];

const FLOATING_ROLES = ["Frontend", "Backend", "Design", "Marketing", "Commerce", "Content"];

const PERKS = [
  { Icon: TrendingUp, title: "Real-world projects", body: "Live client products from day one — not dummy tasks." },
  { Icon: Users, title: "Mentorship included", body: "Paired with a senior who reviews your work weekly." },
  { Icon: Star, title: "Stipend-based", body: "Performance-linked monthly stipend, not just a certificate." },
  { Icon: Briefcase, title: "Pre-placement potential", body: "Exceptional interns considered for full-time roles." },
  { Icon: Globe, title: "Flexible & hybrid", body: "Work from Bengaluru or remotely — output over desk time." },
  { Icon: BookOpen, title: "Certification", body: "Detailed recommendation letter covering your contributions." }
];

const PROCESS = [
  { num: "01", label: "Apply online", body: "Fill the form below. We review every submission within 5 business days." },
  { num: "02", label: "Initial screen", body: "A short 20-minute call or async task to assess fundamentals." },
  { num: "03", label: "Interview", body: "Role-specific conversation with the team lead to discuss fit." },
  { num: "04", label: "Offer & onboard", body: "Official offer with start date, stipend, and first-week schedule." }
];

const FAQ = [
  { q: "Is this internship paid?", a: "Yes. All roles at NextGen Ventures carry a performance-linked monthly stipend. The amount varies by role and is discussed during the interview stage." },
  { q: "Do I need to be in Bengaluru?", a: "No. We're hybrid — most work is remote-friendly. Some roles may have occasional in-person sessions." },
  { q: "What is the minimum duration?", a: "3 months minimum so both sides can do meaningful work. Most interns stay 4–6 months." },
  { q: "Can I intern part-time while in college?", a: "Yes, for most roles. We're flexible as long as you commit 20+ hours per week consistently." },
  { q: "Will I get a letter of recommendation?", a: "Every intern who completes the program receives a detailed recommendation letter covering their role and contributions." },
  { q: "When does the next cohort start?", a: "We hire on a rolling basis — no fixed cohort. Apply now and we'll match your start to the next available slot." }
];

const ALLOWED_TYPES = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];

const initialForm: InternshipPayload = { name: "", email: "", phone: "", role: "", education: "", skills: "", portfolio: "", linkedin: "", coverNote: "" };

export default function Internship() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<InternshipPayload>(initialForm);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [fileError, setFileError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof InternshipPayload, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleRoleSelect = (roleTitle: string) => {
    setSelectedRole(roleTitle);
    set("role", roleTitle);
  };

  const validateFile = (file: File): boolean => {
    setFileError("");
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Only PDF, DOC, or DOCX files accepted.");
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File must be under 5 MB.");
      return false;
    }
    return true;
  };

  const handleFileDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) setResumeFile(file);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) setResumeFile(file);
  };

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      // Hero left words
      gsap.fromTo(".intern-hero__word", { y: "115%", opacity: 0 }, {
        y: "0%", opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.08
      });
      gsap.fromTo(".intern-hero__sub", { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.9, ease: "expo.out", delay: 0.6
      });
      gsap.fromTo(".intern-hero__btn", { opacity: 0, y: 18 }, {
        opacity: 1, y: 0, duration: 0.7, ease: "expo.out", delay: 0.8, stagger: 0.12
      });

      // Hero right panel
      gsap.fromTo(".intern-hero__panel", { opacity: 0, x: 40 }, {
        opacity: 1, x: 0, duration: 1, ease: "expo.out", delay: 0.35
      });
      gsap.fromTo(".intern-stat-card", { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.1, delay: 0.6
      });

      // Floating badge wobble
      gsap.utils.toArray<HTMLElement>(".intern-float-badge").forEach((badge, i) => {
        gsap.to(badge, {
          y: `${-8 + (i % 2 === 0 ? -4 : 4)}px`,
          duration: 2.4 + i * 0.3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.22
        });
      });

      // Roles
      gsap.fromTo(".intern-role-card", { y: 44, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.65, ease: "expo.out", stagger: 0.09,
        scrollTrigger: { trigger: ".intern-roles-grid", start: "top 82%" }
      });

      // Perks
      gsap.fromTo(".intern-perk-card", { y: 30, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.08,
        scrollTrigger: { trigger: ".intern-perks-grid", start: "top 82%" }
      });

      // Process
      gsap.fromTo(".intern-process-step", { x: -32, opacity: 0 }, {
        x: 0, opacity: 1, duration: 0.65, ease: "expo.out", stagger: 0.13,
        scrollTrigger: { trigger: ".intern-process-rail", start: "top 80%" }
      });

      // Form sections
      gsap.fromTo(".intern-form-section", { y: 32, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.7, ease: "expo.out", stagger: 0.1,
        scrollTrigger: { trigger: ".intern-form", start: "top 85%" }
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.role) { setErrorMsg("Please select a role before submitting."); setStatus("error"); return; }
    setStatus("sending");
    setErrorMsg("");
    try {
      await api.submitInternship(form, resumeFile ?? undefined);
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unable to submit. Please try again.");
    }
  };

  return (
    <div ref={pageRef} className="internship-page">
      <Helmet>
        <title>Internships — NextGen Ventures | Join the Team</title>
        <meta name="description" content="Intern at NextGen Ventures — Bengaluru's focused digital studio. Work on real client projects in frontend, backend, design, marketing, and more." />
        <meta property="og:title" content="Internships at NextGen Ventures" />
        <meta property="og:description" content="Real projects. Real mentorship. Real stipend. Apply for an internship at NextGen Ventures." />
      </Helmet>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="intern-hero">
        <div className="intern-hero__noise" aria-hidden="true" />
        <div className="intern-hero__glow" aria-hidden="true" />

        <div className="section-shell intern-hero__layout">
          {/* Left */}
          <div className="intern-hero__left">
            <span className="eyebrow intern-hero__eyebrow">
              <Zap size={13} aria-hidden="true" />
              We're hiring interns — Bengaluru &amp; Remote
            </span>
            <h1 className="intern-hero__headline" aria-label="Build something real. With us.">
              {["Build", "something", "real.", "With", "us."].map((word, i) => (
                <span key={i} className="intern-hero__word-wrap" aria-hidden="true">
                  <span className="intern-hero__word">{word}</span>
                </span>
              ))}
            </h1>
            <p className="intern-hero__sub">
              NextGen Ventures is a focused digital studio working on marketplace growth,
              premium UI/UX, full-stack products, and performance marketing for brands across India.
              We're looking for curious people who want to do real work — not busy work.
            </p>
            <div className="intern-hero__actions">
              <a className="button button--primary intern-hero__btn" href="#apply">
                Apply Now <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a className="button button--outline intern-hero__btn" href="#open-roles">
                See Open Roles
              </a>
            </div>
          </div>

          {/* Right panel */}
          <div className="intern-hero__panel">
            {/* Stat cards */}
            <div className="intern-stats-row">
              {STATS.map(({ value, label }) => (
                <div key={label} className="intern-stat-card">
                  <strong className="intern-stat-card__value">{value}</strong>
                  <span className="intern-stat-card__label">{label}</span>
                </div>
              ))}
            </div>

            {/* Floating role badges */}
            <div className="intern-float-cloud">
              {FLOATING_ROLES.map((role, i) => (
                <span key={role} className="intern-float-badge" style={{ "--delay": `${i * 0.22}s` } as React.CSSProperties}>
                  {role}
                </span>
              ))}
            </div>

            {/* Location footer */}
            <div className="intern-panel-footer">
              <Globe size={14} aria-hidden="true" />
              Bengaluru, India &nbsp;·&nbsp; Remote-friendly
            </div>
          </div>
        </div>
      </section>

      {/* ── Open Roles ───────────────────────────────────────── */}
      <section className="section-shell intern-roles-section" id="open-roles">
        <div className="intern-section-header" data-reveal>
          <div>
            <p className="eyebrow">Open Positions</p>
            <h2>Six roles. One team.</h2>
          </div>
          <p className="intern-section-sub">
            We're not looking for generalists — we want specialists who are serious about one craft
            and excited to develop it in a real commercial environment.
          </p>
        </div>

        <div className="intern-roles-grid">
          {ROLES.map(({ Icon, title, type, duration, skills, desc, spots, color }) => (
            <article
              key={title}
              className="intern-role-card"
              style={{ "--role-color": color } as React.CSSProperties}
              data-card-interactive
            >
              <div className="intern-role-card__top">
                <div className="intern-role-card__icon">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <div className="intern-role-card__meta">
                  <span className="intern-role-card__type">{type}</span>
                  <span className="intern-role-card__spots">{spots} spot{spots !== 1 ? "s" : ""}</span>
                </div>
              </div>
              <h3 className="intern-role-card__title">{title}</h3>
              <p className="intern-role-card__desc">{desc}</p>
              <div className="intern-role-card__skills">
                {skills.map((s) => <span key={s} className="intern-role-card__skill">{s}</span>)}
              </div>
              <div className="intern-role-card__footer">
                <span className="intern-role-card__duration">
                  <CheckCircle2 size={13} aria-hidden="true" />
                  {duration}
                </span>
                <a href="#apply" className="intern-role-card__apply" onClick={() => handleRoleSelect(title)}>
                  Apply <ArrowRight size={13} aria-hidden="true" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Perks ────────────────────────────────────────────── */}
      <section className="section-shell intern-perks-section">
        <div className="intern-perks-header" data-reveal="left">
          <p className="eyebrow">Why NextGen Ventures</p>
          <h2>An internship that actually<br />moves your career forward.</h2>
        </div>
        <div className="intern-perks-grid">
          {PERKS.map(({ Icon, title, body }) => (
            <div key={title} className="intern-perk-card" data-card-interactive>
              <div className="intern-perk-card__icon"><Icon size={20} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Hiring Process ───────────────────────────────────── */}
      <section className="section-shell intern-process-section">
        <div className="intern-section-header" data-reveal>
          <div>
            <p className="eyebrow">How We Hire</p>
            <h2>Simple, fast, fair.</h2>
          </div>
          <p className="intern-section-sub">
            No multi-round marathons. We move quickly and treat your time with respect.
          </p>
        </div>
        <div className="intern-process-rail">
          {PROCESS.map(({ num, label, body }) => (
            <div key={num} className="intern-process-step">
              <div className="intern-process-step__num">{num}</div>
              <div className="intern-process-step__content">
                <h3>{label}</h3>
                <p>{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Application Form ─────────────────────────────────── */}
      <section className="section-shell intern-form-section" id="apply">
        <div className="intern-form-header" data-reveal>
          <p className="eyebrow">Apply Now</p>
          <h2>Ready to build something real?</h2>
          <p className="intern-section-sub">
            Applications are reviewed on a rolling basis. We respond within 5 business days.
          </p>
        </div>

        {status === "success" ? (
          <div className="intern-success">
            <div className="intern-success__icon"><CheckCircle2 size={44} /></div>
            <h2>Application received.</h2>
            <p>Thank you for applying. We'll review your profile and reach out within 5 business days on your registered email.</p>
            <a className="button button--outline" href="/internship">Back to internships</a>
          </div>
        ) : (
          <form className="intern-form" onSubmit={onSubmit} encType="multipart/form-data">

            {/* 01 — Personal Details */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">01</span> Personal Details
              </div>
              <div className="intern-form__grid-3">
                <label>
                  Full Name <span className="required-mark">*</span>
                  <input required minLength={2} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Your full name" />
                </label>
                <label>
                  Email <span className="required-mark">*</span>
                  <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@email.com" />
                </label>
                <label>
                  Phone <span className="form-optional">(optional)</span>
                  <input value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} placeholder="+91 98765 43210" />
                </label>
              </div>
            </div>

            {/* 02 — Role Selection */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">02</span> Which role are you applying for?
                <span className="required-mark" style={{ marginLeft: 4 }}>*</span>
              </div>
              <div className="intern-role-selector">
                {ROLES.map(({ Icon, title, color }) => (
                  <button
                    key={title}
                    type="button"
                    className={`intern-role-chip ${selectedRole === title ? "intern-role-chip--active" : ""}`}
                    style={{ "--chip-color": color } as React.CSSProperties}
                    onClick={() => handleRoleSelect(title)}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {title}
                    {selectedRole === title && <CheckCircle2 size={14} className="intern-role-chip__check" />}
                  </button>
                ))}
              </div>
              {selectedRole && (
                <p className="intern-selected-role">
                  <CheckCircle2 size={14} aria-hidden="true" />
                  Selected: <strong>{selectedRole}</strong>
                </p>
              )}
            </div>

            {/* 03 — Background */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">03</span> Your Background
              </div>
              <label>
                Education <span className="required-mark">*</span>
                <input required minLength={5} value={form.education} onChange={(e) => set("education", e.target.value)} placeholder="e.g. B.Tech CSE, Year 3 — RV College, Bengaluru" />
              </label>
              <label>
                Skills &amp; Tools <span className="required-mark">*</span>
                <input required minLength={5} value={form.skills} onChange={(e) => set("skills", e.target.value)} placeholder="e.g. React, Figma, Python, Meta Ads — list everything relevant" />
              </label>
            </div>

            {/* 04 — Portfolio Links */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">04</span> Your Work <span className="form-optional">(optional but recommended)</span>
              </div>
              <div className="intern-form__grid-2">
                <label>
                  <Package size={14} aria-hidden="true" /> Portfolio / GitHub
                  <input type="url" value={form.portfolio ?? ""} onChange={(e) => set("portfolio", e.target.value)} placeholder="https://yourportfolio.com or github.com/you" />
                </label>
                <label>
                  <Linkedin size={14} aria-hidden="true" /> LinkedIn Profile
                  <input type="url" value={form.linkedin ?? ""} onChange={(e) => set("linkedin", e.target.value)} placeholder="https://linkedin.com/in/yourname" />
                </label>
              </div>
            </div>

            {/* 05 — Cover Note */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">05</span> Why NextGen Ventures?
                <span className="required-mark" style={{ marginLeft: 4 }}>*</span>
              </div>
              <label>
                <textarea
                  required
                  minLength={50}
                  maxLength={3000}
                  rows={6}
                  value={form.coverNote}
                  onChange={(e) => set("coverNote", e.target.value)}
                  placeholder="Tell us why you want to intern here, what you're hoping to learn, and something about yourself that your resume doesn't show. Be honest — not polished."
                />
                <span className="intern-char-count">
                  {form.coverNote.length} / 3000 characters
                  {form.coverNote.length >= 50 && <CheckCircle2 size={13} className="intern-char-check" />}
                </span>
              </label>
            </div>

            {/* 06 — CV Upload */}
            <div className="intern-form-section">
              <div className="intern-form-section__label">
                <span className="intern-form-num">06</span> Upload Your CV / Resume
                <span className="form-optional" style={{ marginLeft: 8 }}>(optional — PDF, DOC, DOCX · max 5 MB)</span>
              </div>
              <div
                className={`intern-upload-zone ${dragOver ? "intern-upload-zone--drag" : ""} ${resumeFile ? "intern-upload-zone--has-file" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !resumeFile && fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload resume — click or drag a file here"
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click(); }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="intern-upload-input"
                  onChange={handleFileInput}
                  aria-hidden="true"
                />
                {resumeFile ? (
                  <div className="intern-upload-file">
                    <div className="intern-upload-file__icon"><FileText size={28} /></div>
                    <div className="intern-upload-file__info">
                      <strong>{resumeFile.name}</strong>
                      <span>{(resumeFile.size / 1024).toFixed(0)} KB · {resumeFile.type.includes("pdf") ? "PDF" : "Word Document"}</span>
                    </div>
                    <button
                      type="button"
                      className="intern-upload-remove"
                      onClick={(e) => { e.stopPropagation(); setResumeFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                      aria-label="Remove file"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="intern-upload-prompt">
                    <div className="intern-upload-prompt__icon"><Upload size={28} /></div>
                    <strong>Drag &amp; drop your CV here</strong>
                    <span>or click to browse files</span>
                    <span className="intern-upload-prompt__formats">PDF · DOC · DOCX · Max 5 MB</span>
                  </div>
                )}
              </div>
              {fileError && <p className="intern-upload-error">{fileError}</p>}
            </div>

            {/* Submit */}
            <div className="intern-form-section intern-form-section--submit">
              <button className="button button--primary intern-submit-btn" type="submit" disabled={status === "sending"}>
                {status === "sending" ? (
                  <><RefreshCw size={17} className="spin" aria-hidden="true" /> Submitting…</>
                ) : (
                  <>Submit Application <Send size={17} aria-hidden="true" /></>
                )}
              </button>
              {status === "error" && (
                <p className="cp-form-error">{errorMsg}</p>
              )}
            </div>
          </form>
        )}
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="section-shell intern-faq-section" data-reveal>
        <p className="eyebrow">FAQ</p>
        <h2>Common questions.</h2>
        <div className="faq-list intern-faq-list">
          {FAQ.map(({ q, a }, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "faq-item--open" : ""}`}>
              <button type="button" className="faq-trigger" onClick={() => setOpenFaq(openFaq === i ? null : i)} aria-expanded={openFaq === i}>
                {q}
                <ChevronDown size={18} className="faq-chevron" aria-hidden="true" />
              </button>
              <div className="faq-answer"><p>{a}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Strip ────────────────────────────────────────── */}
      <section className="section-shell intern-cta-strip" data-reveal>
        <div className="intern-cta-inner" data-card-interactive>
          <div>
            <h2>Questions before you apply?</h2>
            <p>Reach out directly — we respond within one business day.</p>
          </div>
          <a className="button button--primary" href="mailto:hello@nextgenventures.in">
            <Mail size={16} aria-hidden="true" />
            hello@nextgenventures.in
          </a>
        </div>
      </section>
    </div>
  );
}
