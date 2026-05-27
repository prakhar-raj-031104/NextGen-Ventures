import { Router } from "express";
import { internshipRateLimiter } from "../../middleware/rate-limiter.js";
import { resumeUpload } from "../../middleware/upload.js";
import { validateBody } from "../../middleware/validate.js";
import { createInternshipSchema } from "./internships.schema.js";
import { createInternshipApplication } from "./internships.controller.js";

export const internshipsRouter = Router();

// multer must run before validateBody so req.body is populated from multipart
internshipsRouter.post(
  "/",
  internshipRateLimiter,
  resumeUpload.single("resume"),
  validateBody(createInternshipSchema),
  createInternshipApplication
);
