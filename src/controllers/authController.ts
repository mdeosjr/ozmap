import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/authService";
import { STATUS_CODE } from "../errors/AppError";

export class AuthController {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login({ email, password });
      res.status(STATUS_CODE.OK).json({ token });
    } catch (error) {
      next(error);
    }
  }
}
