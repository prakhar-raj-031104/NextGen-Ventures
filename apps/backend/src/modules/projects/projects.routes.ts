import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError } from "../../utils/http-error.js";

export const projectsRouter = Router();

projectsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const projects = await prisma.project.findMany({
      orderBy: [{ year: "desc" }, { createdAt: "asc" }]
    });

    res.json({ data: projects });
  })
);

projectsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const project = await prisma.project.findUnique({
      where: { slug: req.params.slug }
    });

    if (!project) {
      throw new HttpError(404, "Project not found");
    }

    res.json({ data: project });
  })
);
