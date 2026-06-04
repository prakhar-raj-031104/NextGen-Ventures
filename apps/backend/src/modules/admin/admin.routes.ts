import { Router } from "express";
import { authRateLimiter } from "../../middleware/rate-limiter.js";
import { authenticateAdmin } from "../../middleware/authenticate-admin.js";
import { validateBody } from "../../middleware/validate.js";
import {
  adminLoginSchema,
  createClientSchema,
  inquiryStatusSchema,
  internshipStatusSchema,
  leadStatusSchema,
  ticketStatusSchema
} from "./admin.schema.js";
import {
  adminLogin,
  createClient,
  listClients,
  listInquiries,
  listInternships,
  listLeads,
  listTickets,
  overview,
  updateInquiryStatus,
  updateInternshipStatus,
  updateLeadStatus,
  updateTicketStatus
} from "./admin.controller.js";

export const adminRouter = Router();

// Public: owner login (throttled against brute force)
adminRouter.post("/login", authRateLimiter, validateBody(adminLoginSchema), adminLogin);

// Everything below requires a valid admin token
adminRouter.use(authenticateAdmin);

adminRouter.get("/overview", overview);

adminRouter.get("/tickets", listTickets);
adminRouter.patch("/tickets/:id", validateBody(ticketStatusSchema), updateTicketStatus);

adminRouter.get("/leads", listLeads);
adminRouter.patch("/leads/:id", validateBody(leadStatusSchema), updateLeadStatus);

adminRouter.get("/internships", listInternships);
adminRouter.patch("/internships/:id", validateBody(internshipStatusSchema), updateInternshipStatus);

adminRouter.get("/clients", listClients);
adminRouter.post("/clients", validateBody(createClientSchema), createClient);

adminRouter.get("/inquiries", listInquiries);
adminRouter.patch("/inquiries/:id", validateBody(inquiryStatusSchema), updateInquiryStatus);
