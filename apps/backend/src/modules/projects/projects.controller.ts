import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Cache for 1 hour — project data changes infrequently
const CACHE_TTL = 60 * 60;

export const getAllProjects = asyncHandler(async (_req: Request, res: Response) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ year: "desc" }, { createdAt: "asc" }]
  });

  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}, stale-while-revalidate=300`);
  sendSuccess(res, projects, {
    meta: { count: projects.length }
  });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const project = await prisma.project.findUnique({
    where: { slug }
  });

  if (!project) {
    throw new HttpError(404, `Project "${slug}" not found`);
  }

  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}, stale-while-revalidate=300`);
  sendSuccess(res, project);
});
