import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { HttpError } from "../../utils/http-error.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";

// Cache for 1 hour — service data changes infrequently
const CACHE_TTL = 60 * 60;

export const getAllServices = asyncHandler(async (_req: Request, res: Response) => {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" }
  });

  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}, stale-while-revalidate=300`);
  sendSuccess(res, services, {
    meta: { count: services.length }
  });
});

export const getServiceBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = req.params as { slug: string };

  const service = await prisma.service.findUnique({
    where: { slug }
  });

  if (!service) {
    throw new HttpError(404, `Service "${slug}" not found`);
  }

  res.setHeader("Cache-Control", `public, max-age=${CACHE_TTL}, stale-while-revalidate=300`);
  sendSuccess(res, service);
});
