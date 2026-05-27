import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { HttpError } from "../utils/http-error.js";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const requestId = res.locals["requestId"] as string | undefined;

  if (error instanceof ZodError) {
    res.status(422).json({
      error: {
        message: "Validation failed",
        details: error.flatten(),
        requestId
      }
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        ...(error.details !== undefined && { details: error.details }),
        requestId
      }
    });
    return;
  }

  if (env.NODE_ENV !== "production") {
    console.error(`[${requestId ?? "no-id"}] Unhandled error on ${req.method} ${req.path}:`, error);
  }

  res.status(500).json({
    error: {
      message:
        env.NODE_ENV === "production"
          ? "An unexpected error occurred. Please try again later."
          : error.message,
      ...(env.NODE_ENV !== "production" && { stack: error.stack }),
      requestId
    }
  });
};
