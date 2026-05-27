import { z } from "zod";

export const createInternshipSchema = z.object({
  name:      z.string().trim().min(2).max(120),
  email:     z.string().trim().email().max(180),
  phone:     z.string().trim().max(40).optional().or(z.literal("")),
  role:      z.string().trim().min(2).max(120),
  education: z.string().trim().min(5).max(300),
  skills:    z.string().trim().min(10).max(1000),
  portfolio: z.string().trim().url().max(300).optional().or(z.literal("")),
  linkedin:  z.string().trim().max(300).optional().or(z.literal("")),
  coverNote: z.string().trim().min(50).max(3000)
});

export type CreateInternshipInput = z.infer<typeof createInternshipSchema>;
