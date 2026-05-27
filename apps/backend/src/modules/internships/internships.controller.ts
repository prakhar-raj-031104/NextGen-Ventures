import path from "path";
import type { Request, Response } from "express";
import { prisma } from "../../lib/prisma.js";
import { sendSuccess } from "../../utils/send.js";
import { asyncHandler } from "../../utils/async-handler.js";
import type { CreateInternshipInput } from "./internships.schema.js";

export const createInternshipApplication = asyncHandler(async (req: Request, res: Response) => {
  const body = req.body as CreateInternshipInput;

  // multer puts the uploaded file in req.file
  const resumeUrl = req.file
    ? `/uploads/resumes/${path.basename(req.file.path)}`
    : null;

  const application = await prisma.internshipApplication.create({
    data: {
      name:      body.name,
      email:     body.email,
      phone:     body.phone || null,
      role:      body.role,
      education: body.education,
      skills:    body.skills,
      portfolio: body.portfolio || null,
      linkedin:  body.linkedin || null,
      coverNote: body.coverNote,
      resumeUrl
    }
  });

  console.log(
    `[internship] Application from ${application.email} — role: "${application.role}"` +
    (resumeUrl ? ` | resume: ${resumeUrl}` : " | no resume")
  );

  sendSuccess(res, { id: application.id }, {
    message: "Application received. We'll review your profile and reach out within 5–7 business days.",
    status: 201
  });
});
