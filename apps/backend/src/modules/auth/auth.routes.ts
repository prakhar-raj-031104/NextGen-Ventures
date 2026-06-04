import { Router } from "express";
import { authRateLimiter } from "../../middleware/rate-limiter.js";
import { authenticate } from "../../middleware/authenticate.js";
import { validateBody } from "../../middleware/validate.js";
import { forgotRequestSchema, forgotVerifySchema, loginSchema, registerSchema } from "./auth.schema.js";
import { forgotRequest, forgotVerify, login, me, register } from "./auth.controller.js";

export const authRouter = Router();

authRouter.post("/register", authRateLimiter, validateBody(registerSchema), register);
authRouter.post("/login", authRateLimiter, validateBody(loginSchema), login);
authRouter.post("/forgot", authRateLimiter, validateBody(forgotRequestSchema), forgotRequest);
authRouter.post("/forgot/verify", authRateLimiter, validateBody(forgotVerifySchema), forgotVerify);
authRouter.get("/me", authenticate, me);
