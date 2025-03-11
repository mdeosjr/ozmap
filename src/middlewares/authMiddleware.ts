import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { AppError, STATUS_CODE } from "../errors/AppError";

export class AuthMiddleware {
  public static validate(
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError("JWT token is missing", STATUS_CODE.UNAUTHORIZED);
    }

    const [, token] = authHeader.split(" ");

    try {
      const decoded = verify(token, process.env.JWT_SECRET || "default-secret");

      res.locals.user = decoded;

      return next();
    } catch {
      throw new AppError("Invalid JWT token", STATUS_CODE.UNAUTHORIZED);
    }
  }
}
