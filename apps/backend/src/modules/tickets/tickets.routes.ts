import { Router } from "express";
import { ticketRateLimiter } from "../../middleware/rate-limiter.js";
import { validateBody } from "../../middleware/validate.js";
import { createTicketSchema } from "./tickets.schema.js";
import { createTicket } from "./tickets.controller.js";

export const ticketsRouter = Router();

ticketsRouter.post("/", ticketRateLimiter, validateBody(createTicketSchema), createTicket);
