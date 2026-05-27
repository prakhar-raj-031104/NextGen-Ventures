import type { Response } from "express";

export interface ApiSuccess<T> {
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  options: { message?: string; meta?: Record<string, unknown>; status?: number } = {}
): Response => {
  const { message, meta, status = 200 } = options;
  const body: ApiSuccess<T> = { data };
  if (message) body.message = message;
  if (meta) body.meta = meta;
  return res.status(status).json(body);
};
