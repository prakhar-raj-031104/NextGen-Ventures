import { Router } from "express";
import { leadRateLimiter } from "../../middleware/rate-limiter.js";
import { validateBody } from "../../middleware/validate.js";
import { createServiceInquirySchema } from "./service-inquiries.schema.js";
import { createServiceInquiry } from "./service-inquiries.controller.js";

export const serviceInquiriesRouter = Router();

serviceInquiriesRouter.post(
  "/",
  leadRateLimiter,
  validateBody(createServiceInquirySchema),
  createServiceInquiry
);
