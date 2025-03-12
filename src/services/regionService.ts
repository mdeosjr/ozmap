import { GeoJSONPoint, Region } from "../models/regionModel";
import { RegionRepository } from "../repositories/regionRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { CreateRegionInput, UpdateRegionInput } from "../types/regionTypes";

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
    const existingRegion = await RegionRepository.findByCoordinates(
      regionData.geometry,
    );

    if (existingRegion) {
      throw new AppError("Region already exists", STATUS_CODE.CONFLICT);
    }

    return await RegionRepository.create(regionData);
  }

  static async findAll(
    page: number,
    limit: number,
  ): Promise<{ regions: Region[]; total: number }> {
    const offset = (page - 1) * limit;
    const result = await RegionRepository.findAll(offset, limit);

    if (result.total === 0) {
      throw new AppError("No regions found", STATUS_CODE.NOT_FOUND);
    }

    return result;
  }

  static async findById(id: string): Promise<Region> {
    const region = await RegionRepository.findById(id);
    if (!region) {
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    return region;
  }

  static async findByPoint(point: string): Promise<Region[]> {
    const geoJsonPoint = this.makeGeoJsonPoint(point);

    const regions = await RegionRepository.findByPoint(geoJsonPoint);
    if (regions.length === 0) {
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
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    if (existingRegion.user.toString() !== userId) {
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
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    if (region.user.toString() !== userId) {
      throw new AppError("Not authorized", STATUS_CODE.UNAUTHORIZED);
    }

    await RegionRepository.delete(id);
  }
}
