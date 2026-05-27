import { fallbackProjects, fallbackServices } from "../data/fallback";
import type { InternshipPayload, LeadPayload, Project, Service, TicketPayload } from "../types";

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
      const services = await fetchJson<Service[]>("/services");
      return services.map(normalizeService);
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

  async submitTicket(payload: TicketPayload) {
    const response = await fetch(`${API_URL}/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const body = (await response.json()) as ApiResponse<{ ticketNumber: string; id: string }>;
    if (!response.ok) throw new Error(body.message ?? "Unable to submit your request");
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
