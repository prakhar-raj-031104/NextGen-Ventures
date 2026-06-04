import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import type { CreateServiceInquiryInput } from "./service-inquiries.schema.js";

export const createServiceInquiry = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateServiceInquiryInput;

  const inquiry = await prisma.serviceInquiry.create({
    data: {
      name:        body.name,
      email:       body.email,
      phone:       body.phone || null,
      company:     body.company || null,
      serviceSlug: body.serviceSlug,
      serviceName: body.serviceName,
      selections:  body.selections,
      estimate:    body.estimate || null,
      message:     body.message || null
    }
  });

  console.log(`[inquiry] ${inquiry.serviceName} request from ${inquiry.email} (${inquiry.estimate ?? "custom"})`);

  sendSuccess(res, { id: inquiry.id }, {
    message: "Request received — our team will get back to you with a tailored proposal shortly.",
    status: 201
  });
});
