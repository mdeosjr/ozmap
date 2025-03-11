import { Request, Response } from "express";
import { RegionService } from "../services/regionService";
import { AppError, STATUS_CODE } from "../errors/AppError";

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

  static async findAll(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { regions, total } = await RegionService.findAll(
        parseInt(String(page)),
        parseInt(String(limit)),
      );

      res.status(STATUS_CODE.OK).json({
        rows: regions,
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

  static async findByPoint(req: Request, res: Response): Promise<void> {
    try {
      const { point } = req.query;

      if (!point)
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ error: "Coordinates must be provided!" });

      const regions = await RegionService.findByPoint(String(point));

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

  static async findByDistance(req: Request, res: Response): Promise<void> {
    try {
      const { point, maxDistance, filterRegions } = req.query;
      const { user } = res.locals;

      if (!point || !maxDistance)
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ error: "Coordinates and distance must be provided!" });

      const userId = filterRegions === "true" ? user.id : undefined;
      const regions = await RegionService.findByDistance(
        String(point),
        Number(maxDistance),
        userId,
      );

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

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { user } = res.locals;
      const region = await RegionService.update(id, req.body, user.id);
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
      const { user } = res.locals;
      await RegionService.delete(id, user.id);
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
