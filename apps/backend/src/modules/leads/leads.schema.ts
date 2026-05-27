import { z } from "zod";

export const createLeadSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  company: z.string().trim().min(2).max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  serviceInterest: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  timeline: z.string().trim().max(80).optional().or(z.literal("")),
  businessType: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(2000)
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
