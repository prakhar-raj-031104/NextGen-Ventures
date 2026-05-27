import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { env } from "../../config/env.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";

const startTime = Date.now();

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  let dbStatus: "ok" | "error" = "ok";
  let dbLatencyMs: number | null = null;

  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - t0;
  } catch {
    dbStatus = "error";
  }

  const status = dbStatus === "ok" ? "ok" : "degraded";

  sendSuccess(res, {
    status,
    service: "nextgen-ventures-api",
    environment: env.NODE_ENV,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus,
      ...(dbLatencyMs !== null && { latencyMs: dbLatencyMs })
    }
  });
});
