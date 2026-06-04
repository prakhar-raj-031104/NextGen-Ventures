import { fallbackProjects, fallbackServices } from "../data/fallback";
import type {
  AdminClient,
  AdminInternship,
  AdminLead,
  AdminOverview,
  AdminServiceInquiry,
  AdminTicket,
  AuthSession,
  ClientAccount,
  InternshipPayload,
  LeadPayload,
  LoginPayload,
  Project,
  RegisterPayload,
  Service,
  ServiceInquiryPayload,
  TicketPayload
} from "../types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

type ApiResponse<T> = {
  data: T;
  message?: string;
};

const fetchJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ApiResponse<T>;
  return payload.data;
};

const normalizeProject = (project: Project): Project => ({
  ...project,
  metrics: Array.isArray(project.metrics) ? project.metrics : []
});

// The DB schema stores core fields only; plans/faq/caseStudies live in fallback.
// Merge so the ServiceDetail page always has the full data shape.
const normalizeService = (service: Service): Service => {
  const fb = fallbackServices.find((f) => f.slug === service.slug);
  return {
    ...service,
    plans: service.plans ?? fb?.plans,
    faq: service.faq ?? fb?.faq,
    caseStudies: service.caseStudies ?? fb?.caseStudies,
    whyUs: service.whyUs && service.whyUs.length > 0 ? service.whyUs : fb?.whyUs,
  };
};

export const api = {
  async getServices(): Promise<Service[]> {
    try {
      const services = (await fetchJson<Service[]>("/services")).map(normalizeService);
      // Include services that only exist in local data (e.g. newly added lines
      // not yet seeded to the database) so the catalogue stays complete.
      const slugs = new Set(services.map((s) => s.slug));
      const extras = fallbackServices.filter((s) => !slugs.has(s.slug));
      return [...services, ...extras];
    } catch {
      return fallbackServices;
    }
  },

  async getProjects(): Promise<Project[]> {
    try {
      const projects = await fetchJson<Project[]>("/projects");
      return projects.map(normalizeProject);
    } catch {
      return fallbackProjects;
    }
  },

  async submitLead(payload: LeadPayload) {
    const response = await fetch(`${API_URL}/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<{ id: string }>;
    if (!response.ok) throw new Error(body.message ?? "Unable to send your message");
    return body;
  },

  async register(payload: RegisterPayload): Promise<ApiResponse<AuthSession>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<AuthSession> & { error?: { message: string } };
    if (!response.ok) throw new Error(body.error?.message ?? body.message ?? "Unable to create your account");
    return body;
  },

  async login(payload: LoginPayload): Promise<ApiResponse<AuthSession>> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<AuthSession> & { error?: { message: string } };
    if (!response.ok) throw new Error(body.error?.message ?? body.message ?? "Unable to sign in");
    return body;
  },

  async getMe(token: string): Promise<ClientAccount> {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Session expired");
    const body = (await response.json()) as ApiResponse<{ account: ClientAccount }>;
    return body.data.account;
  },

  async submitTicket(payload: TicketPayload, token: string) {
    const response = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<{ ticketNumber: string; id: string }> & {
      error?: { message: string };
    };
    if (!response.ok) throw new Error(body.error?.message ?? body.message ?? "Unable to submit your request");
    return body;
  },

  async submitServiceInquiry(payload: ServiceInquiryPayload) {
    const response = await fetch(`${API_URL}/service-inquiries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<{ id: string }> & { error?: { message: string } };
    if (!response.ok) throw new Error(body.error?.message ?? body.message ?? "Unable to send your request");
    return body;
  },

  async submitInternship(payload: InternshipPayload, resumeFile?: File) {
    const formData = new FormData();
    (Object.entries(payload) as [string, string | undefined][]).forEach(([key, val]) => {
      if (val !== undefined && val !== "") formData.append(key, val);
    });
    if (resumeFile) formData.append("resume", resumeFile);

    const response = await fetch(`${API_URL}/internships`, {
      method: "POST",
      body: formData
      // No Content-Type header — browser sets multipart/form-data with boundary automatically
    });
    const body = (await response.json()) as ApiResponse<{ id: string }>;
    if (!response.ok) throw new Error(body.message ?? "Unable to submit your application");
    return body;
  }
};

/* ── Admin control panel ─────────────────────────────────── */
const adminRequest = async <T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const response = await fetch(`${API_URL}/admin${path}`, {
    ...init,
    headers: {
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...(init.headers ?? {})
    }
  });
  const body = (await response.json()) as ApiResponse<T> & { error?: { message: string } };
  if (!response.ok) {
    const message = body.error?.message ?? body.message ?? "Request failed";
    const err = new Error(message) as Error & { status?: number };
    err.status = response.status;
    throw err;
  }
  return body;
};

export const adminApi = {
  async login(password: string): Promise<string> {
    const response = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const body = (await response.json()) as ApiResponse<{ token: string }> & { error?: { message: string } };
    if (!response.ok) throw new Error(body.error?.message ?? body.message ?? "Incorrect password");
    return body.data.token;
  },

  overview: (token: string) => adminRequest<AdminOverview>("/overview", token).then((r) => r.data),
  tickets:  (token: string) => adminRequest<AdminTicket[]>("/tickets", token).then((r) => r.data),
  leads:    (token: string) => adminRequest<AdminLead[]>("/leads", token).then((r) => r.data),
  internships: (token: string) => adminRequest<AdminInternship[]>("/internships", token).then((r) => r.data),
  clients:  (token: string) => adminRequest<AdminClient[]>("/clients", token).then((r) => r.data),
  inquiries: (token: string) => adminRequest<AdminServiceInquiry[]>("/inquiries", token).then((r) => r.data),

  setInquiryStatus: (token: string, id: string, status: string) =>
    adminRequest<AdminServiceInquiry>(`/inquiries/${id}`, token, { method: "PATCH", body: JSON.stringify({ status }) }).then((r) => r.data),

  setTicketStatus: (token: string, id: string, status: string) =>
    adminRequest<AdminTicket>(`/tickets/${id}`, token, { method: "PATCH", body: JSON.stringify({ status }) }).then((r) => r.data),
  setLeadStatus: (token: string, id: string, status: string) =>
    adminRequest<AdminLead>(`/leads/${id}`, token, { method: "PATCH", body: JSON.stringify({ status }) }).then((r) => r.data),
  setInternshipStatus: (token: string, id: string, status: string) =>
    adminRequest<AdminInternship>(`/internships/${id}`, token, { method: "PATCH", body: JSON.stringify({ status }) }).then((r) => r.data),

  createClient: (
    token: string,
    payload: { name: string; email: string; company: string; domain: string; mobile: string; dob: string }
  ) =>
    adminRequest<{ account: AdminClient; password: string }>("/clients", token, {
      method: "POST",
      body: JSON.stringify(payload)
    }).then((r) => r.data)
};
