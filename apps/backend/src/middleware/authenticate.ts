import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/http-error.js";
import { verifyToken, type TokenPayload } from "../modules/auth/token.js";

// Make the authenticated account available to downstream handlers.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      account?: TokenPayload;
    }
  }
}

const extractToken = (req: Request): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  const [scheme, value] = header.split(" ");
  if (scheme !== "Bearer" || !value) return null;
  return value.trim();
};

/** Rejects the request with 401 unless a valid bearer token is present. */
export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const token = extractToken(req);
  if (!token) throw new HttpError(401, "Authentication required. Please sign in to your client portal.");

  const payload = verifyToken(token);
  if (!payload) throw new HttpError(401, "Your session has expired or is invalid. Please sign in again.");

  req.account = payload;
  next();
};
