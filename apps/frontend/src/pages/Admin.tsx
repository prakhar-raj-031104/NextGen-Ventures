import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import {
  AlertCircle,
  Briefcase,
  CheckCircle2,
  Copy,
  CreditCard,
  LayoutDashboard,
  LogOut,
  FileText,
  Mail,
  Plus,
  RefreshCw,
  Search,
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
  AdminPayment,
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
  PENDING: "#ff9d42", REVIEWING: "#60a5fa", SHORTLISTED: "#a78bfa", OFFERED: "#36f5a2", REJECTED: "#ff5c5c",
  PAID: "#36f5a2", REFUNDED: "#ff5c5c"
};

type Tab = "overview" | "tickets" | "leads" | "internships" | "clients" | "inquiries" | "payments";

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

const fmtINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;

/** Case-insensitive "does any of these fields contain the query" helper. */
const makeMatcher = (query: string) => {
  const q = query.trim().toLowerCase();
  return (...vals: (string | null | undefined)[]) =>
    !q || vals.some((v) => (v ?? "").toLowerCase().includes(q));
};

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
  const [query, setQuery] = useState("");

  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [interns, setInterns] = useState<AdminInternship[]>([]);
  const [clients, setClients] = useState<AdminClient[]>([]);
  const [inquiries, setInquiries] = useState<AdminServiceInquiry[]>([]);
  const [payments, setPayments] = useState<AdminPayment[]>([]);

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
      else if (which === "payments") setPayments(await adminApi.payments(t));
    } catch (err) {
      guard(err);
    } finally {
      setLoading(false);
    }
  }, [guard]);

  useEffect(() => {
    if (token) void load(tab, token);
  }, [tab, token, load]);

  // Reset the search box whenever the tab changes.
  useEffect(() => { setQuery(""); }, [tab]);

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
    { id: "clients",     label: "Clients",       Icon: Users },
    { id: "payments",    label: "Payments",      Icon: CreditCard }
  ];

  const searchable = tab !== "overview";

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
          <div className="adm-head__actions">
            {searchable && (
              <div className="adm-search">
                <Search size={15} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search phone, email, domain…"
                  aria-label="Search records"
                />
              </div>
            )}
            <button className="adm-refresh" onClick={() => void load(tab, t)} disabled={loading}>
              <RefreshCw size={15} className={loading ? "spin" : ""} /> Refresh
            </button>
          </div>
        </header>

        {error && <p className="adm-error"><AlertCircle size={15} /> {error}</p>}

        {tab === "overview" && <OverviewView data={overview} loading={loading} onJump={setTab} />}
        {tab === "tickets" && (
          <TicketsView
            rows={tickets}
            query={query}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setTicketStatus(t, id, status);
                setTickets((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "leads" && (
          <LeadsView
            rows={leads}
            query={query}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setLeadStatus(t, id, status);
                setLeads((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "internships" && (
          <InternshipsView
            rows={interns}
            query={query}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setInternshipStatus(t, id, status);
                setInterns((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "clients" && (
          <ClientsView rows={clients} query={query} token={t} onCreated={() => void load("clients", t)} />
        )}
        {tab === "inquiries" && (
          <QuotesView
            rows={inquiries}
            query={query}
            onStatus={async (id, status) => {
              try { const u = await adminApi.setInquiryStatus(t, id, status);
                setInquiries((p) => p.map((x) => (x.id === id ? u : x))); } catch (e) { guard(e); }
            }}
          />
        )}
        {tab === "payments" && (
          <PaymentsView rows={payments} clients={clients} query={query} token={t} onCreated={() => void load("payments", t)} />
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

/** Shared scrollable table shell with an empty / no-results state. */
function TableShell({ head, children, empty }: { head: React.ReactNode; children: React.ReactNode; empty: boolean }) {
  if (empty) return <p className="adm-empty">No matching records.</p>;
  return (
    <div className="adm-table-wrap">
      <table className="adm-table">
        <thead><tr>{head}</tr></thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

/* ── Tickets ──────────────────────────────────────────────── */
function TicketsView({ rows, query, onStatus }: { rows: AdminTicket[]; query: string; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No tickets yet.</p>;
  const match = makeMatcher(query);
  const filtered = rows.filter((r) => match(r.email, r.clientName, r.company, r.projectRef, r.ticketNumber, r.title));
  return (
    <TableShell empty={filtered.length === 0} head={<>
      <th>Ticket</th><th>Title</th><th>Client</th><th>Company</th><th>Email</th>
      <th>Service / Request</th><th>Priority</th><th>Estimate</th><th>Created</th><th>Status</th>
    </>}>
      {filtered.map((r) => (
        <tr key={r.id}>
          <td className="adm-td-mono">{r.ticketNumber}</td>
          <td className="adm-td-strong">{r.title}</td>
          <td>{r.clientName}</td>
          <td>{r.company}</td>
          <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
          <td>{r.serviceType}<span className="adm-td-sub">{r.requestType}</span></td>
          <td><span className="adm-card__pri" data-pri={r.priority}>{r.priority}</span></td>
          <td>{r.estimate ?? (r.addOns && r.addOns.length ? r.addOns.join(", ") : "—")}</td>
          <td className="adm-td-date">{fmtDate(r.createdAt)}</td>
          <td><StatusSelect value={r.status} options={TICKET_STATUSES} onChange={(s) => onStatus(r.id, s)} /></td>
        </tr>
      ))}
    </TableShell>
  );
}

/* ── Leads ────────────────────────────────────────────────── */
function LeadsView({ rows, query, onStatus }: { rows: AdminLead[]; query: string; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No enquiries yet.</p>;
  const match = makeMatcher(query);
  const filtered = rows.filter((r) => match(r.email, r.phone, r.name, r.company, r.businessType));
  return (
    <TableShell empty={filtered.length === 0} head={<>
      <th>Name</th><th>Company</th><th>Email</th><th>Phone</th><th>Interest</th>
      <th>Budget</th><th>Business Type</th><th>Message</th><th>Created</th><th>Status</th>
    </>}>
      {filtered.map((r) => (
        <tr key={r.id}>
          <td className="adm-td-strong">{r.name}</td>
          <td>{r.company}</td>
          <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
          <td>{r.phone ?? "—"}</td>
          <td>{r.serviceInterest ?? "—"}</td>
          <td>{r.budget ?? "—"}</td>
          <td>{r.businessType ?? "—"}</td>
          <td className="adm-td-clip" title={r.message}>{r.message}</td>
          <td className="adm-td-date">{fmtDate(r.createdAt)}</td>
          <td><StatusSelect value={r.status} options={LEAD_STATUSES} onChange={(s) => onStatus(r.id, s)} /></td>
        </tr>
      ))}
    </TableShell>
  );
}

/* ── Internships ──────────────────────────────────────────── */
function InternshipsView({ rows, query, onStatus }: { rows: AdminInternship[]; query: string; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No applications yet.</p>;
  const match = makeMatcher(query);
  const filtered = rows.filter((r) => match(r.email, r.phone, r.name, r.role, r.skills));
  return (
    <TableShell empty={filtered.length === 0} head={<>
      <th>Name</th><th>Role</th><th>Email</th><th>Phone</th><th>Education</th>
      <th>Skills</th><th>Links</th><th>Created</th><th>Status</th>
    </>}>
      {filtered.map((r) => (
        <tr key={r.id}>
          <td className="adm-td-strong">{r.name}</td>
          <td>{r.role}</td>
          <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
          <td>{r.phone ?? "—"}</td>
          <td>{r.education}</td>
          <td className="adm-td-clip" title={r.skills}>{r.skills}</td>
          <td className="adm-td-links">
            {r.portfolio && <a href={r.portfolio} target="_blank" rel="noreferrer">Portfolio</a>}
            {r.linkedin && <a href={r.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>}
            {r.resumeUrl && <a href={r.resumeUrl} target="_blank" rel="noreferrer">Resume</a>}
            {!r.portfolio && !r.linkedin && !r.resumeUrl && "—"}
          </td>
          <td className="adm-td-date">{fmtDate(r.createdAt)}</td>
          <td><StatusSelect value={r.status} options={INTERN_STATUSES} onChange={(s) => onStatus(r.id, s)} /></td>
        </tr>
      ))}
    </TableShell>
  );
}

/* ── Quote requests (service configurator) ───────────────── */
function QuotesView({ rows, query, onStatus }: { rows: AdminServiceInquiry[]; query: string; onStatus: (id: string, s: string) => void }) {
  if (rows.length === 0) return <p className="adm-empty">No quote requests yet.</p>;
  const match = makeMatcher(query);
  const filtered = rows.filter((r) => match(r.email, r.phone, r.name, r.company, r.serviceName));
  return (
    <TableShell empty={filtered.length === 0} head={<>
      <th>Service</th><th>Name</th><th>Company</th><th>Email</th><th>Phone</th>
      <th>Estimate</th><th>Selections</th><th>Created</th><th>Status</th>
    </>}>
      {filtered.map((r) => (
        <tr key={r.id}>
          <td className="adm-td-strong">{r.serviceName}</td>
          <td>{r.name}</td>
          <td>{r.company ?? "—"}</td>
          <td><a href={`mailto:${r.email}`}>{r.email}</a></td>
          <td>{r.phone ?? "—"}</td>
          <td className="adm-td-strong">{r.estimate ?? "—"}</td>
          <td className="adm-td-clip" title={r.selections.map((s) => `${s.question}: ${s.answers.join(", ")}`).join(" | ")}>
            {r.selections.map((s) => `${s.question}: ${s.answers.join(", ")}`).join(" · ") || "—"}
          </td>
          <td className="adm-td-date">{fmtDate(r.createdAt)}</td>
          <td><StatusSelect value={r.status} options={INQUIRY_STATUSES} onChange={(s) => onStatus(r.id, s)} /></td>
        </tr>
      ))}
    </TableShell>
  );
}

/* ── Clients ──────────────────────────────────────────────── */
function ClientsView({ rows, query, token, onCreated }: { rows: AdminClient[]; query: string; token: string; onCreated: () => void }) {
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

  const match = makeMatcher(query);
  const filtered = rows.filter((c) => match(c.email, c.mobile, c.domain, c.name, c.company));

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
        <TableShell empty={filtered.length === 0} head={<>
          <th>Company</th><th>Name</th><th>Email</th><th>Mobile</th><th>Domain</th>
          <th>Password</th><th>Tickets</th><th>Joined</th><th>Last login</th>
        </>}>
          {filtered.map((c) => (
            <tr key={c.id}>
              <td className="adm-td-strong">{c.company}</td>
              <td>{c.name}</td>
              <td><a href={`mailto:${c.email}`}>{c.email}</a></td>
              <td>{c.mobile}</td>
              <td>{c.domain}</td>
              <td>{c.password ? <code className="adm-pw">{c.password}</code> : "—"}</td>
              <td>{c._count?.tickets ?? 0}</td>
              <td className="adm-td-date">{fmtDate(c.createdAt)}</td>
              <td className="adm-td-date">{c.lastLoginAt ? fmtDate(c.lastLoginAt) : "—"}</td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}

/* ── Payments ─────────────────────────────────────────────── */
function PaymentsView({ rows, clients, query, token, onCreated }: {
  rows: AdminPayment[]; clients: AdminClient[]; query: string; token: string; onCreated: () => void;
}) {
  const empty = { accountId: "", amount: "", description: "", invoiceNo: "", method: "", paidAt: "" };
  const [form, setForm] = useState(empty);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const set = (k: keyof typeof empty, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true); setError(""); setOk("");
    try {
      await adminApi.createPayment(token, {
        accountId: form.accountId,
        amount: Number(form.amount),
        description: form.description,
        invoiceNo: form.invoiceNo || undefined,
        method: form.method || undefined,
        paidAt: form.paidAt || undefined
      });
      setOk("Payment recorded.");
      setForm(empty);
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not record payment");
    } finally {
      setBusy(false);
    }
  };

  const match = makeMatcher(query);
  const filtered = rows.filter((p) =>
    match(p.account?.email, p.account?.domain, p.account?.company, p.description, p.invoiceNo));

  return (
    <div className="adm-clients">
      {/* Record a payment */}
      <section className="adm-panel adm-create">
        <h3><CreditCard size={16} /> Record a client payment</h3>
        {clients.length === 0 ? (
          <p className="adm-create__hint">Open the Clients tab once to load client accounts, then record a payment here.</p>
        ) : (
          <form className="adm-create__form" onSubmit={submit}>
            <div className="adm-create__grid">
              <select required value={form.accountId} onChange={(e) => set("accountId", e.target.value)}>
                <option value="">Select client…</option>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.company} · {c.domain}</option>)}
              </select>
              <input placeholder="Amount (₹)" type="number" min={1} required value={form.amount} onChange={(e) => set("amount", e.target.value)} />
              <input placeholder="Description (e.g. Website build — phase 1)" required value={form.description} onChange={(e) => set("description", e.target.value)} />
              <input placeholder="Invoice no. (optional)" value={form.invoiceNo} onChange={(e) => set("invoiceNo", e.target.value)} />
              <input placeholder="Method (UPI / Bank / Card)" value={form.method} onChange={(e) => set("method", e.target.value)} />
              <input placeholder="Paid on" type="date" value={form.paidAt} onChange={(e) => set("paidAt", e.target.value)} />
            </div>
            {error && <p className="adm-error"><AlertCircle size={14} /> {error}</p>}
            {ok && <p className="adm-ok"><CheckCircle2 size={14} /> {ok}</p>}
            <button className="button button--primary" type="submit" disabled={busy}>
              {busy ? <><RefreshCw size={15} className="spin" /> Saving…</> : <><Plus size={15} /> Record payment</>}
            </button>
          </form>
        )}
      </section>

      {/* Payment list */}
      {rows.length === 0 ? <p className="adm-empty">No payments recorded yet.</p> : (
        <TableShell empty={filtered.length === 0} head={<>
          <th>Client</th><th>Domain</th><th>Amount</th><th>Description</th>
          <th>Invoice</th><th>Method</th><th>Paid on</th><th>Status</th>
        </>}>
          {filtered.map((p) => (
            <tr key={p.id}>
              <td className="adm-td-strong">{p.account?.company ?? "—"}</td>
              <td>{p.account?.domain ?? "—"}</td>
              <td className="adm-td-strong">{fmtINR(p.amount)}</td>
              <td className="adm-td-clip" title={p.description}>{p.description}</td>
              <td>{p.invoiceNo ?? "—"}</td>
              <td>{p.method ?? "—"}</td>
              <td className="adm-td-date">{fmtDate(p.paidAt)}</td>
              <td><StatusBadge status={p.status} /></td>
            </tr>
          ))}
        </TableShell>
      )}
    </div>
  );
}
