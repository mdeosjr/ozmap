import { Request, Response } from "express";
import { UserService } from "../services/userService";
import { AppError, STATUS_CODE } from "../errors/AppError";

export class UserController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.create(req.body);
      res.status(STATUS_CODE.CREATED).json(user);
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

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { users, total } = await UserService.findAll(
        parseInt(String(page)),
        parseInt(String(limit)),
      );

      res.status(STATUS_CODE.OK).json({
        rows: users,
        page,
        limit,
        total,
      });
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

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = res.locals.user;
      const user = await UserService.findById(id);
      res.status(STATUS_CODE.OK).json(user);
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

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = res.locals.user;
      const user = await UserService.update(id, req.body);
      res.status(STATUS_CODE.OK).json(user);
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

  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = res.locals.user;
      await UserService.delete(id);
      res.sendStatus(STATUS_CODE.NO_CONTENT);
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
