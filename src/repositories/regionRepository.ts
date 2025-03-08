import { GeoJSONPolygon, Region, RegionModel } from "../models/regionModel";

export class RegionRepository {
  static async create(regionData: Partial<Region>): Promise<Region> {
    const region = new RegionModel(regionData);

    return region.save();
  }

  static async findByCoordinates(polygon: GeoJSONPolygon): Promise<Region | null> {
    return await RegionModel.findOne({
      geometry: {
        $geoWithin: {
          $geometry: polygon
        }
      }
    });
  }

  static async findById(id: string): Promise<Region | null> {
    return await RegionModel.findById(id);
  }

  static async findAll(): Promise<{ regions: Region[]; total: number }> {
    const [regions, total] = await Promise.all([
      RegionModel.find().lean(),
      RegionModel.count(),
    ]);

    return { regions, total };
  }

  static async delete(id: string): Promise<void> {
    await RegionModel.findByIdAndDelete(id);
  }
}
