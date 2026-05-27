import path from "path";
import cors from "cors";
import express from "express";
import type { Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { corsOrigins, env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { notFound } from "./middleware/not-found.js";
import { requestId } from "./middleware/request-id.js";
import { apiRateLimiter } from "./middleware/rate-limiter.js";
import { apiRouter } from "./routes.js";
import { HttpError } from "./utils/http-error.js";

export const createApp = () => {
  const app = express();

  // ── Security headers ──────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: "cross-origin" },
      contentSecurityPolicy: env.NODE_ENV === "production"
    })
  );

  // ── CORS ──────────────────────────────────────────────────────────────
  app.use(
    cors({
      origin(origin, callback) {
        // allow server-to-server or same-origin requests (no Origin header)
        if (!origin) return callback(null, true);
        if (corsOrigins.includes(origin)) return callback(null, true);
        callback(new HttpError(403, `CORS: origin "${origin}" is not allowed`));
      },
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "X-Request-Id"]
    })
  );

  // ── Request ID — must come before logger so ID is available in tokens ─
  app.use(requestId);

  // ── Body parsing ──────────────────────────────────────────────────────
  app.use(express.json({ limit: "1mb" }));

  // ── HTTP request logging ──────────────────────────────────────────────
  morgan.token("req-id", (_req, res) => (res as Response).locals["requestId"] as string ?? "-");
  app.use(
    morgan(
      env.NODE_ENV === "production"
        ? ':remote-addr :method :url :status :res[content-length] :response-time ms req-id=:req-id "'
        : "[:req-id] :method :url :status :response-time ms"
    )
  );

  // ── Global API rate limiter ───────────────────────────────────────────
  app.use("/api", apiRateLimiter);

  // ── Static uploads (resumes, etc.) ───────────────────────────────────
  app.use("/uploads", express.static(env.UPLOAD_DIR ?? path.join(process.cwd(), "uploads")));

  // ── Routes ────────────────────────────────────────────────────────────
  app.use("/api", apiRouter);

  // ── 404 and global error handler ─────────────────────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};
