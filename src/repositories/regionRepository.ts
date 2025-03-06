import { Region, RegionModel } from "../models/regionModel";

export class RegionRepository {
  static async create(regionData: Partial<Region>): Promise<Region> {
    return await RegionModel.create(regionData);
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
