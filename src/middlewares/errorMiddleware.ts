import { Request, Response, NextFunction } from "express";
import { AppError, STATUS_CODE } from "../errors/AppError";

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
    });
    return;
  }

  console.error("Unexpected error:", err);

  res.status(STATUS_CODE.INTERNAL_SERVER_ERROR).json({
    error: "Internal server error",
  });
}
