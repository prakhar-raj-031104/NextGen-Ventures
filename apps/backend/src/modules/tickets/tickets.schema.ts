import { z } from "zod";

export const createTicketSchema = z.object({
  clientName:  z.string().trim().min(2).max(120),
  email:       z.string().trim().email().max(180),
  company:     z.string().trim().min(2).max(160),
  projectRef:  z.string().trim().min(3).max(200),
  serviceType: z.string().trim().min(2).max(100),
  requestType: z.string().trim().min(2).max(100),
  priority:    z.enum(["NORMAL", "HIGH", "URGENT"]).default("NORMAL"),
  title:       z.string().trim().max(200).optional().default(""),
  description: z.string().trim().max(4000).optional().default(""),
  timeline:    z.string().trim().max(100).optional().or(z.literal("")),
  addOns:      z.array(z.string().trim().max(120)).max(30).optional(),
  estimate:    z.string().trim().max(60).optional().or(z.literal(""))
});

export type CreateTicketInput = z.infer<typeof createTicketSchema>;
