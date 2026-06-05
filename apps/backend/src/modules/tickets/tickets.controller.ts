import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import type { CreateTicketInput } from "./tickets.schema.js";

const generateTicketNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `NGV-${year}${month}-${random}`;
};

export const createTicket = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateTicketInput;

  let ticketNumber = generateTicketNumber();
  let attempts = 0;
  while (attempts < 5) {
    const existing = await prisma.clientTicket.findUnique({ where: { ticketNumber } });
    if (!existing) break;
    ticketNumber = generateTicketNumber();
    attempts++;
  }

  const ticket = await prisma.clientTicket.create({
    data: {
      ticketNumber,
      clientName:  body.clientName,
      email:       body.email,
      company:     body.company,
      projectRef:  body.projectRef,
      serviceType: body.serviceType,
      requestType: body.requestType,
      priority:    body.priority ?? "NORMAL",
      title:       body.title,
      description: body.description,
      timeline:    body.timeline || null,
      addOns:      body.addOns ?? [],
      estimate:    body.estimate || null,
      accountId:   req.account?.sub ?? null
    }
  });

  console.log(`[ticket] ${ticket.ticketNumber} opened by ${ticket.email} — "${ticket.title}"`);

  sendSuccess(res, { ticketNumber: ticket.ticketNumber, id: ticket.id }, {
    message: `Ticket ${ticket.ticketNumber} created. We'll review and respond within 4–24 hours depending on priority.`,
    status: 201
  });
});
