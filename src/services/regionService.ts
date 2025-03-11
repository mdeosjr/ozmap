import { GeoJSONPoint, Region } from "../models/regionModel";
import { RegionRepository } from "../repositories/regionRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { RegionInput } from "../schemas/RegionInput";

export class RegionService {
  public static makeGeoJsonPoint(point: string) {
    const [lng, lat] = point.split(",");

    const geoJsonPoint: GeoJSONPoint = {
      type: "Point",
      coordinates: [Number(lng), Number(lat)],
    };

    return geoJsonPoint;
  }

  static async create(regionData: RegionInput): Promise<Region> {
    const existingRegion = await RegionRepository.findByCoordinates(
      regionData.geometry,
    );

    if (existingRegion) {
      throw new AppError("Region already exists", STATUS_CODE.CONFLICT);
    }

    return await RegionRepository.create(regionData);
  }

  static async findAll(): Promise<{ regions: Region[]; total: number }> {
    const result = await RegionRepository.findAll();
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
  ): Promise<Region[]> {
    const geoJsonPoint = this.makeGeoJsonPoint(point);

    const regions = await RegionRepository.findByDistance(
      geoJsonPoint,
      maxDistance,
    );
    if (regions.length === 0) {
      throw new AppError("Regions not found", STATUS_CODE.NOT_FOUND);
    }

    return regions;
  }

  static async delete(id: string): Promise<void> {
    const region = await RegionRepository.findById(id);
    if (!region) {
      throw new AppError("Region not found", STATUS_CODE.NOT_FOUND);
    }

    await RegionRepository.delete(id);
  }
}
