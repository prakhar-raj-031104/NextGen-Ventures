import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";
import { verifyAdminToken } from "../modules/auth/token.js";

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (scheme !== "Bearer" || !value) return null;
  return value.trim();
};

/** Guards control-panel routes — requires a valid admin bearer token. */
export const authenticateAdmin = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (!token) throw new HttpError(401, "Admin authentication required.");

  const payload = verifyAdminToken(token);
  if (!payload) throw new HttpError(401, "Your admin session has expired. Please sign in again.");

  next();
};
