import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import { env } from "../config/env.js";

const rateLimitResponse = (retryAfter: number) => ({
  error: {
    message: "Too many requests — please slow down and try again later.",
    retryAfter
  }
});

export const apiRateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  handler(req, res) {
    const retryAfter = Math.ceil(env.RATE_LIMIT_WINDOW_MS / 1000);
    res.status(429).json(rateLimitResponse(retryAfter));
  }
});

export const leadRateLimiter = rateLimit({
  windowMs: env.LEAD_RATE_LIMIT_WINDOW_MS,
  max: env.LEAD_RATE_LIMIT_MAX,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  handler(req, res) {
    const retryAfter = Math.ceil(env.LEAD_RATE_LIMIT_WINDOW_MS / 1000);
    res.status(429).json(rateLimitResponse(retryAfter));
  }
});

// 15 tickets per IP per hour
export const ticketRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 15,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  handler(_req, res) {
    res.status(429).json(rateLimitResponse(3600));
  }
});

// 20 auth attempts (register/login) per IP per 15 minutes — throttles brute force
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  handler(_req, res) {
    res.status(429).json(rateLimitResponse(900));
  }
});

// 5 internship applications per IP per day
export const internshipRateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip ?? "unknown"),
  handler(_req, res) {
    res.status(429).json(rateLimitResponse(86400));
  }
});
