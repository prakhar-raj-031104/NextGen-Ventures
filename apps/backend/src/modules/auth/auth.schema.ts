import { z } from "zod";

// Accepts a bare domain or a full URL; we normalise it in the controller.
const domainField = z
  .string()
  .trim()
  .min(3, "Enter a valid domain")
  .max(253)
  .regex(/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i, "Enter a valid domain, e.g. yourbrand.com");

// E.164-ish: optional +, 8–15 digits, allows spaces/dashes which we strip.
const mobileField = z
  .string()
  .trim()
  .min(8, "Enter a valid mobile number")
  .max(20)
  .regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid mobile number");

export const registerSchema = z.object({
  name:    z.string().trim().min(2).max(120),
  email:   z.string().trim().email().max(180).toLowerCase(),
  company: z.string().trim().min(2).max(160),
  domain:  domainField,
  mobile:  mobileField,
  dob:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be in YYYY-MM-DD format")
});

export const loginSchema = z.object({
  // identifier may be the registered email or the registered domain
  identifier: z.string().trim().min(3).max(253),
  password:   z.string().min(4).max(100)
});

export const forgotRequestSchema = z.object({
  email:  z.string().trim().email().max(180).toLowerCase(),
  domain: domainField,
  dob:    z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD")
});

export const forgotVerifySchema = z.object({
  email: z.string().trim().email().max(180).toLowerCase(),
  otp:   z.string().trim().length(6)
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
