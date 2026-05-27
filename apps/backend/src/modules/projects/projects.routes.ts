import { Router } from "express";
import { getAllProjects, getProjectBySlug } from "./projects.controller.js";

export const projectsRouter = Router();

projectsRouter.get("/", getAllProjects);
projectsRouter.get("/:slug", getProjectBySlug);
