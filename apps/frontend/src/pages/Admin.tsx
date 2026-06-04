import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Copy,
  LayoutDashboard,
  LogOut,
  FileText,
  Mail,
  RefreshCw,
  ShieldCheck,
  Ticket,
  TrendingUp,
  UserPlus,
  Users
} from "lucide-react";
import { adminApi } from "../lib/api";
import type {
  AdminClient,
  AdminInternship,
  AdminLead,
  AdminOverview,
  AdminServiceInquiry,
  AdminTicket
} from "../types";

const TOKEN_KEY = "ngv_admin_token";

const TICKET_STATUSES = ["OPEN", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const LEAD_STATUSES = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED"];
const INTERN_STATUSES = ["PENDING", "REVIEWING", "SHORTLISTED", "OFFERED", "REJECTED"];
const INQUIRY_STATUSES = ["NEW", "REVIEWING", "QUOTED", "CLOSED"];

const STATUS_COLORS: Record<string, string> = {
  OPEN: "#ff9d42", IN_REVIEW: "#60a5fa", IN_PROGRESS: "#a78bfa", RESOLVED: "#36f5a2", CLOSED: "#8a8f98",
  NEW: "#ff9d42", CONTACTED: "#60a5fa", QUALIFIED: "#36f5a2", QUOTED: "#a78bfa",
  PENDING: "#ff9d42", REVIEWING: "#60a5fa", SHORTLISTED: "#a78bfa", OFFERED: "#36f5a2", REJECTED: "#ff5c5c"
};

type Tab = "overview" | "tickets" | "leads" | "internships" | "clients" | "inquiries";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="adm-status" style={{ "--s": STATUS_COLORS[status] ?? "#8a8f98" } as React.CSSProperties}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function StatusSelect({
  value, options, onChange
}: { value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <select
      className="adm-select"
      value={value}
      style={{ "--s": STATUS_COLORS[value] ?? "#8a8f98" } as React.CSSProperties}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
    </select>
  );
}

/* ── Login screen ─────────────────────────────────────────── */
function AdminLogin({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const token = await adminApi.login(password);
      localStorage.setItem(TOKEN_KEY, token);
      onAuthed(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-login">
      <form className="adm-login__card" onSubmit={submit}>
        <div className="adm-login__icon"><ShieldCheck size={26} /></div>
        <h1>Control Panel</h1>
        <p>Owner access only. Enter the admin password to continue.</p>
        <input
          type="password"
          autoFocus
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="adm-login__error"><AlertCircle size={14} /> {error}</p>}
        <button className="button button--primary" type="submit" disabled={busy}>
          {busy ? <><RefreshCw size={16} className="spin" /> Signing in…</> : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/* ── Control panel ────────────────────────────────────────── */
export default function Admin() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [tab, setTab] = useState<Tab>("overview");

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [interns, setInterns] = useState<AdminInternship[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [inquiries, setInquiries] = useState<AdminServiceInquiry[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const guard = useCallback((err: unknown) => {
    const status = (err as { status?: number })?.status;
    if (status === 401) logout();
    setError(err instanceof Error ? err.message : "Something went wrong");
  }, [logout]);

  const load = useCallback(async (which: Tab, t: string) => {
    setLoading(true);
    setError("");
    try {
      if (which === "overview") setOverview(await adminApi.overview(t));
      else if (which === "tickets") setTickets(await adminApi.tickets(t));
      else if (which === "leads") setLeads(await adminApi.leads(t));
      else if (which === "internships") setInterns(await adminApi.internships(t));
      else if (which === "clients") setClients(await adminApi.clients(t));
      else if (which === "inquiries") setInquiries(await adminApi.inquiries(t));
    } catch (err) {
      guard(err);
    } finally {
      setLoading(false);
    }
  }, [guard]);

  useEffect(() => {
    if (token) void load(tab, token);
  }, [tab, token, load]);

  if (!token) {
    return (
      <>
        <Helmet><title>Control Panel — NextGen Ventures</title><meta name="robots" content="noindex" /></Helmet>
        <AdminLogin onAuthed={setToken} />
      </>
    );
  }

  const t = token;
  const nav: { id: Tab; label: string; Icon: typeof Ticket }[] = [
    { id: "overview",    label: "Overview",      Icon: LayoutDashboard },
    { id: "inquiries",   label: "Quote Requests", Icon: FileText },
    { id: "tickets",     label: "Tickets",       Icon: Ticket },
    { id: "leads",       label: "Enquiries",     Icon: Mail },
    { id: "internships", label: "Internships",   Icon: Briefcase },
    { id: "clients",     label: "Clients",       Icon: Users }
  ];

  return (
    <div className="adm">
      <Helmet><title>Control Panel — NextGen Ventures</title><meta name="robots" content="noindex" /></Helmet>

      {/* Sidebar */}
      <aside className="adm-side">
        <div className="adm-side__brand"><ShieldCheck size={18} /> Control Panel</div>
        <nav className="adm-side__nav">
          {nav.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`adm-side__link ${tab === id ? "adm-side__link--active" : ""}`}
              onClick={() => setTab(id)}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </nav>
        <button className="adm-side__logout" onClick={logout}><LogOut size={16} /> Sign out</button>
      </aside>

      {/* Main */}
      <main className="adm-main">
        <header className="adm-head">
          <h1>{nav.find((n) => n.id === tab)?.label}</h1>
          <button className="adm-refresh" onClick={() => void load(tab, t)} disabled={loading}>
            <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
          </button>
        </header>

        {error && <p className="adm-error"><AlertCircle size={15} /> {error}</p>}

        {tab === "overview" && <OverviewView data={overview} loading={loading} onJump={setTab} />}
        {tab === "tickets" && (
          <TicketsView
            rows={tickets}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setTicketStatus(t, id, status);
                setTickets((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "leads" && (
          <LeadsView
            rows={leads}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setLeadStatus(t, id, status);
                setLeads((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "internships" && (
          <InternshipsView
            rows={interns}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setInternshipStatus(t, id, status);
                setInterns((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "clients" && (
          <ClientsView rows={clients} token={t} onCreated={() => void load("clients", t)} />
        )}
        {tab === "inquiries" && (
          <QuotesView
            rows={inquiries}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setInquiryStatus(t, id, status);
                setInquiries((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
      </main>
    </div>
  );
}

/* ── Overview ─────────────────────────────────────────────── */
function OverviewView({ data, loading, onJump }: { data: AdminOverview | null; loading: boolean; onJump: (t: Tab) => void }) {
  if (!data) return <p className="adm-empty">{loading ? "Loading…" : "No data yet."}</p>;
  const cards = [
    { label: "New Quote Requests", value: data.totals.newInquiries, sub: `${data.totals.inquiries} total`, Icon: FileText, tab: "inquiries" as Tab, color: "#22d3ee" },
    { label: "Open Tickets", value: data.totals.openTickets, sub: `${data.totals.tickets} total`, Icon: Ticket, tab: "tickets" as Tab, color: "#ff9d42" },
    { label: "New Enquiries", value: data.totals.newLeads, sub: `${data.totals.leads} total`, Icon: Mail, tab: "leads" as Tab, color: "#60a5fa" },
    { label: "Internships", value: data.totals.internships, sub: "applications", Icon: Briefcase, tab: "internships" as Tab, color: "#a78bfa" },
    { label: "Clients", value: data.totals.clients, sub: "accounts", Icon: Users, tab: "clients" as Tab, color: "#36f5a2" }
  ];
  return (
    <>
      <div className="adm-stat-grid">
        {cards.map((c) => (
          <button key={c.label} className="adm-stat" style={{ "--c": c.color } as React.CSSProperties} onClick={() => onJump(c.tab)}>
            <div className="adm-stat__icon"><c.Icon size={20} /></div>
            <strong className="adm-stat__value">{c.value}</strong>
            <span className="adm-stat__label">{c.label}</span>
            <span className="adm-stat__sub">{c.sub}</span>
          </button>
        ))}
      </div>

      <div className="adm-two-col">
        <section className="adm-panel">
          <h3><Ticket size={16} /> Latest tickets</h3>
          {data.recentTickets.length === 0 ? <p className="adm-empty">No tickets yet.</p> : (
            <ul className="adm-mini-list">
              {data.recentTickets.map((tk) => (
                <li key={tk.id}>
                  <div><strong>{tk.title}</strong><span>{tk.company} · {tk.ticketNumber}</span></div>
                  <StatusBadge status={tk.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="adm-panel">
          <h3><TrendingUp size={16} /> Latest enquiries</h3>
          {data.recentLeads.length === 0 ? <p className="adm-empty">No enquiries yet.</p> : (
            <ul className="adm-mini-list">
              {data.recentLeads.map((l) => (
                <li key={l.id}>
                  <div><strong>{l.name}</strong><span>{l.company} · {l.serviceInterest ?? "—"}</span></div>
                  <StatusBadge status={l.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

/* ── Tickets ──────────────────────────────────────────────── */
function TicketsView({ rows, onStatus }: { rows: AdminTicket[]; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No tickets yet.</p>;
  return (
    <div className="adm-cards">
      {rows.map((r) => (
        <article key={r.id} className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__ref">{r.ticketNumber}</span>
            <StatusSelect value={r.status} options={TICKET_STATUSES} onChange={(s) => onStatus(r.id, s)} />
          </div>
          <h3 className="adm-card__title">{r.title}</h3>
          <p className="adm-card__desc">{r.description}</p>
          <div className="adm-card__meta">
            <span><strong>{r.clientName}</strong> · {r.company}</span>
            <span>{r.email}</span>
            <span>{r.serviceType} · {r.requestType}</span>
            <span className="adm-card__pri" data-pri={r.priority}>{r.priority}{r.timeline ? ` · ${r.timeline}` : ""}</span>
            <span className="adm-card__date">{fmtDate(r.createdAt)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── Leads ────────────────────────────────────────────────── */
function LeadsView({ rows, onStatus }: { rows: AdminLead[]; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No enquiries yet.</p>;
  return (
    <div className="adm-cards">
      {rows.map((r) => (
        <article key={r.id} className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__ref">{r.name}</span>
            <StatusSelect value={r.status} options={LEAD_STATUSES} onChange={(s) => onStatus(r.id, s)} />
          </div>
          <p className="adm-card__desc">{r.message}</p>
          <div className="adm-card__meta">
            <span><strong>{r.company}</strong></span>
            <span><a href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}</span>
            <span>{[r.serviceInterest, r.budget, r.businessType].filter(Boolean).join(" · ") || "—"}</span>
            <span className="adm-card__date">{fmtDate(r.createdAt)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── Internships ──────────────────────────────────────────── */
function InternshipsView({ rows, onStatus }: { rows: AdminInternship[]; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No applications yet.</p>;
  return (
    <div className="adm-cards">
      {rows.map((r) => (
        <article key={r.id} className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__ref">{r.name} · {r.role}</span>
            <StatusSelect value={r.status} options={INTERN_STATUSES} onChange={(s) => onStatus(r.id, s)} />
          </div>
          <p className="adm-card__desc">{r.coverNote}</p>
          <div className="adm-card__meta">
            <span><a href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}</span>
            <span>{r.education} · {r.skills}</span>
            <span>
              {r.portfolio && <a href={r.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
              {r.linkedin && <> · <a href={r.linkedin} target="_blank" rel="noreferrer">LinkedIn</a></>}
              {r.resumeUrl && <> · <a href={r.resumeUrl} target="_blank" rel="noreferrer">Resume</a></>}
            </span>
            <span className="adm-card__date">{fmtDate(r.createdAt)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── Quote requests (service configurator) ───────────────── */
function QuotesView({ rows, onStatus }: { rows: AdminServiceInquiry[]; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No quote requests yet.</p>;
  return (
    <div className="adm-cards">
      {rows.map((r) => (
        <article key={r.id} className="adm-card">
          <div className="adm-card__top">
            <span className="adm-card__ref">{r.serviceName}</span>
            <StatusSelect value={r.status} options={INQUIRY_STATUSES} onChange={(s) => onStatus(r.id, s)} />
          </div>
          {r.estimate && <div className="adm-quote-estimate">Estimate: <strong>{r.estimate}</strong></div>}
          <ul className="adm-quote-selections">
            {r.selections.map((s) => (
              <li key={s.question}>
                <span className="adm-quote-q">{s.question}</span>
                <span className="adm-quote-a">{s.answers.join(", ")}</span>
              </li>
            ))}
          </ul>
          {r.message && <p className="adm-card__desc">"{r.message}"</p>}
          <div className="adm-card__meta">
            <span><strong>{r.name}</strong>{r.company ? ` · ${r.company}` : ""}</span>
            <span><a href={`mailto:${r.email}`}>{r.email}</a>{r.phone ? ` · ${r.phone}` : ""}</span>
            <span className="adm-card__date">{fmtDate(r.createdAt)}</span>
          </div>
        </article>
      ))}
    </div>
  );
}

/* ── Clients ──────────────────────────────────────────────── */
function ClientsView({ rows, token, onCreated }: { rows: AdminClient[]; token: string; onCreated: () => void }) {
  const empty = { name: "", email: "", company: "", domain: "", mobile: "", dob: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [generated, setGenerated] = useState<{ company: string; password: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const set = (k: keyof typeof empty, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await adminApi.createClient(token, form);
      setGenerated({ company: res.account.company, password: res.password });
      setForm(empty);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create client");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="adm-clients">
      {/* Create client */}
      <section className="adm-panel adm-create">
        <h3><UserPlus size={16} /> Create client &amp; generate password</h3>
        {generated ? (
          <div className="adm-genpass">
            <CheckCircle2 size={22} />
            <div>
              <strong>{generated.company} created</strong>
              <p>Share this password securely — it won't be shown again.</p>
              <div className="adm-genpass__value">
                <code>{generated.password}</code>
                <button type="button" onClick={() => {
                  void navigator.clipboard.writeText(generated.password);
                  setCopied(true); setTimeout(() => setCopied(false), 2000);
                }}>{copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy"}</button>
              </div>
              <button className="adm-genpass__again" onClick={() => setGenerated(null)}>Add another client</button>
            </div>
          </div>
        ) : (
          <form className="adm-create__form" onSubmit={submit}>
            <div className="adm-create__grid">
              <input placeholder="Full name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
              <input placeholder="Email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              <input placeholder="Company / brand" required value={form.company} onChange={(e) => set("company", e.target.value)} />
              <input placeholder="Domain (yourbrand.com)" required value={form.domain} onChange={(e) => set("domain", e.target.value)} />
              <input placeholder="Mobile" required value={form.mobile} onChange={(e) => set("mobile", e.target.value)} />
              <input placeholder="Date of birth" type="date" required value={form.dob} onChange={(e) => set("dob", e.target.value)} />
            </div>
            {error && <p className="adm-error"><AlertCircle size={14} /> {error}</p>}
            <button className="button button--primary" type="submit" disabled={busy}>
              {busy ? <><RefreshCw size={15} className="spin" /> Creating…</> : <>Create &amp; generate password</>}
            </button>
            <p className="adm-create__hint">Password = first 4 letters of domain + date of birth (DDMMYYYY).</p>
          </form>
        )}
      </section>

      {/* Client list */}
      {rows.length === 0 ? <p className="adm-empty">No client accounts yet.</p> : (
        <div className="adm-cards">
          {rows.map((c) => (
            <article key={c.id} className="adm-card">
              <div className="adm-card__top">
                <span className="adm-card__ref">{c.company}</span>
                <span className="adm-card__date">{c._count?.tickets ?? 0} tickets</span>
              </div>
              <div className="adm-card__meta">
                <span><strong>{c.name}</strong></span>
                <span><a href={`mailto:${c.email}`}>{c.email}</a> · {c.mobile}</span>
                <span>{c.domain}</span>
                {c.password && <span>Password: <code className="adm-pw">{c.password}</code></span>}
                <span className="adm-card__date">
                  Joined {fmtDate(c.createdAt)}{c.lastLoginAt ? ` · last login ${fmtDate(c.lastLoginAt)}` : ""}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
