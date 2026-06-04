import { Router } from "express";
import { ticketRateLimiter } from "../../middleware/rate-limiter.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { createTicketSchema } from "./tickets.schema.js";
import { createTicket } from "./tickets.controller.js";

export const ticketsRouter = Router();

// Tickets can only be raised by authenticated (signed-in) clients.
ticketsRouter.post("/", authenticate, ticketRateLimiter, validateBody(createTicketSchema), createTicket);
