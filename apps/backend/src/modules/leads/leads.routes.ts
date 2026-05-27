import { Router } from "express";
import { validateBody } from "../../middleware/validate.js";
import { leadRateLimiter } from "../../middleware/rate-limiter.js";
import { createLeadSchema } from "./leads.schema.js";
import { createLead } from "./leads.controller.js";

export const leadsRouter = Router();

leadsRouter.post("/", leadRateLimiter, validateBody(createLeadSchema), createLead);
