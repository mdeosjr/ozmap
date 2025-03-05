import { Request, Response } from "express";
import { STATUS } from "./statusCodes";
import { UserService } from "../services/userService";

export class UserController {
  static async create(req: Request, res: Response): Promise<void> {}

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit } = req.query;

      const { users, total } = await UserService.findAll();

      res.status(STATUS.OK).json({
        rows: users,
        page,
        limit,
        total,
      });
    } catch (error) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async findById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const user = await UserService.findById(id);

      if (!user) {
        res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
      }

      res.status(STATUS.OK).json(user);
    } catch (error) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { update } = req.body;

      const user = await UserService.update(id, update);

      if (!user) {
        res.status(STATUS.NOT_FOUND).json({ message: "User not found" });
      }

      res.sendStatus(STATUS.OK);
    } catch (error) {
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({ error: error.message });
    }
  }

  static async delete(req: Request, res: Response): Promise<void> {}
}
