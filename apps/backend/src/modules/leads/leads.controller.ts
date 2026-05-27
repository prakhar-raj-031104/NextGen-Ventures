import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import type { CreateLeadInput } from "./leads.schema.js";

export const createLead = asyncHandler(async (req: Request, res: Response) => {
  const input = req.body as CreateLeadInput;

  const lead = await prisma.lead.create({
    data: {
      name: input.name,
      email: input.email,
      company: input.company,
      phone: input.phone || null,
      serviceInterest: input.serviceInterest || null,
      budget: input.budget || null,
      timeline: input.timeline || null,
      businessType: input.businessType || null,
      message: input.message
    },
    select: {
      id: true,
      status: true,
      createdAt: true
    }
  });

  console.info(
    `[lead] New lead created — id=${lead.id} service="${input.serviceInterest ?? "none"}" company="${input.company}"`
  );

  sendSuccess(res, lead, {
    message: "Thank you for reaching out. The NextGen Ventures team will contact you within 24 hours.",
    status: 201
  });
});
