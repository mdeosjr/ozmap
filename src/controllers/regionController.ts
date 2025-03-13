import { Request, Response, NextFunction } from "express";
import { RegionService } from "../services/regionService";
import { STATUS_CODE } from "../errors/AppError";

export class RegionController {
  static async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { user } = res.locals;
      const regionData = {
        ...req.body,
        user: user.id,
      };

      const region = await RegionService.create(regionData);
      res.status(STATUS_CODE.CREATED).json(region);
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
      next(error);
    }
  }

  static async findByPoint(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { point } = req.query;

      if (!point)
        res
          .status(STATUS_CODE.BAD_REQUEST)
          .json({ error: "Coordinates must be provided!" });

      const regions = await RegionService.findByPoint(String(point));

      res.status(STATUS_CODE.OK).json(regions);

      res.status(STATUS_CODE.OK).json(regions);
    } catch (error) {
      next(error);
    }
  }

  static async findByDistance(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
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
      next(error);
    }
  }

  static async findById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const region = await RegionService.findById(id);
      res.status(STATUS_CODE.OK).json(region);
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
      const { id } = req.params;
      const { user } = res.locals;
      const region = await RegionService.update(id, req.body, user.id);
      res.status(STATUS_CODE.OK).json(region);
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
      const { id } = req.params;
      const { user } = res.locals;
      await RegionService.delete(id, user.id);
      res.sendStatus(STATUS_CODE.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }
}

export default RegionController;
