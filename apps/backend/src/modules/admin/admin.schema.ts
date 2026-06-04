import { z } from "zod";

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required").max(200)
});

export const ticketStatusSchema = z.object({
  status: z.enum(["OPEN", "IN_REVIEW", "IN_PROGRESS", "RESOLVED", "CLOSED"])
});

export const leadStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "CLOSED"])
});

export const internshipStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "SHORTLISTED", "OFFERED", "REJECTED"])
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "REVIEWING", "QUOTED", "CLOSED"])
});

const domainField = z
  .string()
  .trim()
  .min(3)
  .max(253)
  .regex(/^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/.*)?$/i, "Enter a valid domain, e.g. yourbrand.com");

export const createClientSchema = z.object({
  name:    z.string().trim().min(2).max(120),
  email:   z.string().trim().email().max(180).toLowerCase(),
  company: z.string().trim().min(2).max(160),
  domain:  domainField,
  mobile:  z.string().trim().min(8).max(20).regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid mobile number"),
  dob:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date of birth must be YYYY-MM-DD")
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type CreateClientInput = z.infer<typeof createClientSchema>;
