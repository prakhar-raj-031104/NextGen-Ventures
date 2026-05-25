import { Router } from "express";
import { prisma } from "../../lib/prisma.js";
import { asyncHandler } from "../../utils/async-handler.js";
import { HttpError } from "../../utils/http-error.js";

export const servicesRouter = Router();

servicesRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "asc" }
    });

    res.json({ data: services });
  })
);

servicesRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const service = await prisma.service.findUnique({
      where: { slug: req.params.slug }
    });

    if (!service) {
      throw new HttpError(404, "Service not found");
    }

    res.json({ data: service });
  })
);
