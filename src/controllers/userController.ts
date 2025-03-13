import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { STATUS_CODE } from "../errors/AppError";

export class UserController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.create(req.body);
      res.status(STATUS_CODE.CREATED).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
      next(error);
    }
  }

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = res.locals.user;
      const user = await UserService.findById(id);
      res.status(STATUS_CODE.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = res.locals.user;
      const user = await UserService.update(id, req.body);
      res.status(STATUS_CODE.OK).json(user);
    } catch (error) {
      next(error);
    }
  }

  static async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = res.locals.user;
      await UserService.delete(id);
      res.sendStatus(STATUS_CODE.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}
