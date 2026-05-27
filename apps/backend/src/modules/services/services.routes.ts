import { Router } from "express";
import { getAllServices, getServiceBySlug } from "./services.controller.js";

export const servicesRouter = Router();

servicesRouter.get("/", getAllServices);
servicesRouter.get("/:slug", getServiceBySlug);
