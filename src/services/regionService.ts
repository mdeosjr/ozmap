import { GeoJSONPoint, Region } from "../models/regionModel";
import { RegionRepository } from "../repositories/regionRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";

export class RegionService {
  static async create(regionData: Partial<Region>): Promise<Region> {
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
    const [lat, lng] = point.split(",");

    const geoJson: GeoJSONPoint = {
      type: "Point",
      coordinates: [Number(lat), Number(lng)],
    };

    const regions = await RegionRepository.findByPoint(geoJson);
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
