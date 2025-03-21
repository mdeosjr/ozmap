import { GeoJSONPoint, Region } from "../models/regionModel";
import { RegionRepository } from "../repositories/regionRepository";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { CreateRegionInput, UpdateRegionInput } from "../types/regionTypes";
import logger from "../config/logger";
import mongoose from "mongoose";

export class RegionService {
  public static makeGeoJsonPoint(point: string) {
    const [lng, lat] = point.split(",");

    const geoJsonPoint: GeoJSONPoint = {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    };

    return geoJsonPoint;
  }

  static async create(regionData: CreateRegionInput): Promise<Region> {
    logger.debug(
      { name: regionData.name, userId: regionData.user },
      "Creating region",
    );

    const existingRegion = await RegionRepository.findByCoordinates(
      regionData.geometry,
    );

    if (existingRegion) {
      logger.warn(
        { name: regionData.name, geometry: regionData.geometry },
        "Attempted to create existing region",
      );
      throw new AppError("Region already exists", STATUS_CODE.CONFLICT);
    }

    const region = await RegionRepository.create(regionData);

    return region;
  }

  static async findAll(
    page: number,
    limit: number,
  ): Promise<{ regions: Region[]; total: number }> {
    const offset = (page - 1) * limit;
    const result = await RegionRepository.findAll(offset, limit);

    if (result.total === 0) {
      logger.warn("No regions found");
      throw new AppError("No regions found", STATUS_CODE.NOT_FOUND);
    }

    return result;
  }

  static async findById(id: string): Promise<Region> {
    const region = await RegionRepository.findById(id);
    if (!region) {
      logger.warn({ regionId: id }, "Region not found");
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    return region;
  }

  static async findByPoint(point: string): Promise<Region[]> {
    const geoJsonPoint = this.makeGeoJsonPoint(point);

    const regions = await RegionRepository.findByPoint(geoJsonPoint);
    if (!regions || regions.length === 0) {
      logger.info({ point }, "No regions found containing point");
      throw new AppError("Regions not found", STATUS_CODE.NOT_FOUND);
    }

    return regions;
  }

  static async findByDistance(
    point: string,
    maxDistance: number,
    userId?: string,
  ): Promise<Region[]> {
    const geoJsonPoint = this.makeGeoJsonPoint(point);

    const regions = await RegionRepository.findByDistance(
      geoJsonPoint,
      maxDistance,
      userId,
    );
    if (regions.length === 0) {
      logger.info({ point, maxDistance }, "No regions found within distance");
      throw new AppError("Regions not found", STATUS_CODE.NOT_FOUND);
    }

    return regions;
  }

  static async update(
    id: string,
    updatedRegionData: UpdateRegionInput,
    userId: string,
  ): Promise<Region> {
    const existingRegion = await RegionRepository.findById(id);
    if (!existingRegion) {
      logger.warn({ regionId: id }, "Attempted to update non-existent region");
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    if (existingRegion.user.toString() !== userId) {
      logger.warn(
        {
          regionId: id,
          requestUserId: userId,
          ownerUserId: existingRegion.user,
        },
        "Unauthorized region update attempt",
      );
      throw new AppError("Not authorized", STATUS_CODE.UNAUTHORIZED);
    }

    const updatedRegion = await RegionRepository.findByIdAndUpdate(
      id,
      updatedRegionData,
    );

    return updatedRegion;
  }

  static async delete(id: string, userId: string): Promise<void> {
    const region = await RegionRepository.findById(id);
    if (!region) {
      logger.warn({ regionId: id }, "Attempted to delete non-existent region");
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    if (region.user.toString() !== userId) {
      logger.warn(
        { regionId: id, requestUserId: userId, ownerUserId: region.user },
        "Unauthorized region deletion attempt",
      );
      throw new AppError("Not authorized", STATUS_CODE.UNAUTHORIZED);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await UserRepository.deleteRegionFromUser(
        region.user.toString(),
        id,
        session,
      );

      await RegionRepository.delete(id, session);

      await session.commitTransaction();
    } catch (err) {
      logger.error(
        { regionId: id, user: userId, error: err },
        "Error deleting region",
      );
      await session.abortTransaction();
      throw new AppError(
        "Failed to delete region",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }
}
