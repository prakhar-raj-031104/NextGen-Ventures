import { createHmac, timingSafeEqual } from "crypto";
import { env } from "../../config/env.js";

/**
 * Minimal, dependency-free signed token (compact JWS, HS256-style).
 * Format: base64url(header).base64url(payload).base64url(hmac)
 *
 * Avoids adding native/heavyweight crypto deps that complicate Render builds,
 * while still giving us tamper-proof, expiring bearer tokens.
 */

const base64url = (input: Buffer | string): string =>
  Buffer.from(input).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

const fromBase64url = (input: string): Buffer =>
  Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");

const sign = (data: string): string =>
  base64url(createHmac("sha256", env.AUTH_SECRET).update(data).digest());

export interface TokenPayload {
  sub: string; // account id
  email: string;
  domain: string;
  iat: number; // issued-at (seconds)
  exp: number; // expiry (seconds)
}

export const signToken = (payload: Omit<TokenPayload, "iat" | "exp">): string => {
  const now = Math.floor(Date.now() / 1000);
  const full: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + env.AUTH_TOKEN_TTL_HOURS * 60 * 60
  };
  const header = base64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const body = base64url(JSON.stringify(full));
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
};

/** Returns the payload if the token is well-formed, untampered, and unexpired; otherwise null. */
export const verifyToken = (token: string): TokenPayload | null => {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;

  const expected = sign(`${header}.${body}`);
  const sigBuf = fromBase64url(signature);
  const expBuf = fromBase64url(expected);
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const payload = JSON.parse(fromBase64url(body).toString("utf8")) as TokenPayload;
    if (typeof payload.exp !== "number" || payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};
