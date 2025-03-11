import { Request, Response } from "express";
import { RegionService } from "../services/regionService";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { Region } from "../models/regionModel";

export class RegionController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { user } = res.locals;
      const regionData = {
        ...req.body,
        user: user.id,
      };

      const region = await RegionService.create(regionData);
      res.status(STATUS_CODE.CREATED).json(region);
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

  static async find(req: Request, res: Response): Promise<void> {
    try {
      const { containsPoint, nearPoint, maxDistance } = req.query;

      let regions: Region[] | { regions: Region[]; total: number };
      if (containsPoint) {
        regions = await RegionService.findByPoint(String(containsPoint));
      } else if (nearPoint && maxDistance) {
        regions = await RegionService.findByDistance(
          String(nearPoint),
          Number(maxDistance),
        );
      } else regions = await RegionService.findAll();

      res.status(STATUS_CODE.OK).json(regions);
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
      const { id } = req.params;
      const region = await RegionService.findById(id);
      res.status(STATUS_CODE.OK).json(region);
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
      const { id } = req.params;
      await RegionService.delete(id);
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

export default RegionController;
