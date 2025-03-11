import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { AppError, STATUS_CODE } from "../errors/AppError";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await AuthService.login({ email, password });
      res.status(STATUS_CODE.OK).json({ token });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else {
        res
          .status(STATUS_CODE.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  }
}
