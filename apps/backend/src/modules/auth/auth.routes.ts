import { Router } from "express";
import { authRateLimiter } from "../../middleware/rate-limiter.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { login, me, register } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, validateBody(registerSchema), register);
authRouter.post("/login", authRateLimiter, validateBody(loginSchema), login);
authRouter.get("/me", authenticate, me);
