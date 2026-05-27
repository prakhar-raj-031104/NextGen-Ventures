import type { Request, Response } from "express";

export const notFound = (req: Request, res: Response): void => {
  const requestId = res.locals["requestId"] as string | undefined;
  res.status(404).json({
    error: {
      message: `${req.method} ${req.path} — route not found`,
      requestId
    }
  });
};
