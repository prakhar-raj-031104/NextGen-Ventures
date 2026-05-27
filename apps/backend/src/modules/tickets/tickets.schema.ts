import { z } from "zod";

export const createTicketSchema = z.object({
  clientName:  z.string().trim().min(2).max(120),
  email:       z.string().trim().email().max(180),
  company:     z.string().trim().min(2).max(160),
  projectRef:  z.string().trim().min(3).max(200),
  serviceType: z.string().trim().min(2).max(100),
  requestType: z.string().trim().min(2).max(100),
  priority:    z.enum(["NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  title:       z.string().trim().min(5).max(200),
  description: z.string().trim().min(20).max(4000),
  timeline:    z.string().trim().max(100).optional().or(z.literal(""))
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
