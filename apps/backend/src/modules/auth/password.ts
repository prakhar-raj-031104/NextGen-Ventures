import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

/**
 * Normalise a raw domain into a clean, comparable host.
 * Strips protocol, "www.", any path/query, and lowercases.
 *   "https://www.AcmeCorp.com/app" -> "acmecorp.com"
 */
export const normaliseDomain = (raw: string): string =>
  raw
    .trim()
    .toLowerCase()
    .replace(/^[a-z]+:\/\//, "") // protocol
    .replace(/^www\./, "")
    .replace(/[/?#].*$/, "") // path/query/hash
    .trim();

/**
 * Deterministically derive a client's initial password from their domain and
 * date of birth.
 *
 * Rule (documented & shown to the client on registration):
 *   first 4 letters of the domain (capitalised first letter)
 *   + date of birth as DDMMYYYY
 *
 *   domain "acmecorp.com", DOB 1995-08-14  ->  "Acme14081995"
 *
 * The DOB must be an ISO date string (YYYY-MM-DD).
 */
export const deriveClientPassword = (domain: string, dobISO: string): string => {
  const host = normaliseDomain(domain);
  const letters = (host.match(/[a-z0-9]/g) ?? []).join("");
  const stub = letters.slice(0, 4).padEnd(4, "x");
  const capped = stub.charAt(0).toUpperCase() + stub.slice(1);

  const [year, month, day] = dobISO.split("-");
  const dobDigits = `${day}${month}${year}`;

  return `${capped}${dobDigits}`;
};

/** Hash a password with a per-password random salt. Stored as "salt:hash" (hex). */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
};

/** Constant-time verification of a password against a stored "salt:hash" value. */
export const verifyPassword = async (password: string, stored: string): Promise<boolean> => {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const derived = (await scryptAsync(password, salt, KEY_LENGTH)) as Buffer;
  const hashBuffer = Buffer.from(hash, "hex");
  if (hashBuffer.length !== derived.length) return false;
  return timingSafeEqual(hashBuffer, derived);
};
