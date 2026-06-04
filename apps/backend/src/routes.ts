import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { healthRouter } from "./modules/health/health.routes.js";
import { leadsRouter } from "./modules/leads/leads.routes.js";
import { projectsRouter } from "./modules/projects/projects.routes.js";
import { servicesRouter } from "./modules/services/services.routes.js";
import { ticketsRouter } from "./modules/tickets/tickets.routes.js";
import { internshipsRouter } from "./modules/internships/internships.routes.js";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/services", servicesRouter);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/leads", leadsRouter);
apiRouter.use("/tickets", ticketsRouter);
apiRouter.use("/internships", internshipsRouter);
