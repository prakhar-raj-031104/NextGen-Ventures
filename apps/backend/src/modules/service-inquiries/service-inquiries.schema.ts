import { z } from "zod";

export const createServiceInquirySchema = z.object({
  name:        z.string().trim().min(2).max(120),
  email:       z.string().trim().email().max(180),
  phone:       z.string().trim().max(30).optional().or(z.literal("")),
  company:     z.string().trim().max(160).optional().or(z.literal("")),
  serviceSlug: z.string().trim().min(2).max(80),
  serviceName: z.string().trim().min(2).max(120),
  selections: z
    .array(
      z.object({
        question: z.string().trim().min(1).max(200),
        answers:  z.array(z.string().trim().min(1).max(200)).max(30)
      })
    )
    .max(30),
  estimate:    z.string().trim().max(120).optional().or(z.literal("")),
  message:     z.string().trim().max(3000).optional().or(z.literal(""))
});

export type CreateServiceInquiryInput = z.infer<typeof createServiceInquirySchema>;
