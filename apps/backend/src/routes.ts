import { Router } from "express";
import { healthRouter } from "./modules/health/health.routes.js";
import { leadsRouter } from "./modules/leads/leads.routes.js";
import { projectsRouter } from "./modules/projects/projects.routes.js";
import { servicesRouter } from "./modules/services/services.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/leads", leadsRouter);
