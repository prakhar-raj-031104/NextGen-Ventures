import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { validateBody } from "../../middleware/validate.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { createLeadSchema, type CreateLeadInput } from "./leads.schema.js";

export const leadsRouter = Router();

leadsRouter.post(
  "/",
  validateBody(createLeadSchema),
  asyncHandler(async (req, res) => {
    const input = req.body as CreateLeadInput;

    const lead = await prisma.lead.create({
      data: {
        ...input,
        phone: input.phone || null,
        serviceInterest: input.serviceInterest || null
      },
      select: {
        id: true,
        status: true,
        createdAt: true
      }
    });

    res.status(201).json({
      data: lead,
      message: "Thanks. The NextGen SaaS team will contact you shortly."
    });
  })
);
