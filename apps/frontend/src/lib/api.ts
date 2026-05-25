import { fallbackProjects, fallbackServices } from "../data/fallback";
import type { LeadPayload, Project, Service } from "../types";

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

export const api = {
  async getServices(): Promise<Service[]> {
    try {
      return await fetchJson<Service[]>("/services");
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
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const body = (await response.json()) as ApiResponse<{ id: string }>;

    if (!response.ok) {
      throw new Error(body.message ?? "Unable to send your message");
    }

    return body;
  }
};
