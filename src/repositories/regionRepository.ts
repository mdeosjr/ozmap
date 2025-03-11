import { GeoJSONPoint, Region, RegionModel } from "../models/regionModel";
import { RegionInput } from "../schemas/RegionInput";

export class RegionRepository {
  static async create(regionData: RegionInput): Promise<Region> {
    const region = await RegionModel.create(regionData);

    return await RegionModel.findById(region._id);
  }

  static async findByCoordinates(
    coordinates: RegionInput["geometry"],
  ): Promise<Region | null> {
    return await RegionModel.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: coordinates,
        },
      },
    });
  }

  static async findByPoint(point: GeoJSONPoint): Promise<Region[] | null> {
    return await RegionModel.find({
      geometry: {
        $geoIntersects: {
          $geometry: point,
        },
      },
    });
  }

  static async findById(id: string): Promise<Region | null> {
    return await RegionModel.findById(id);
  }

  static async findByDistance(
    point: GeoJSONPoint,
    maxDistance: number,
    userId?: string,
  ): Promise<Region[]> {
    type QueryType = {
      geometry: {
        $near: {
          $geometry: GeoJSONPoint;
          $maxDistance: number;
        };
      };
      user?: {
        $ne: string;
      };
    };

    const query: QueryType = {
      geometry: {
        $near: {
          $geometry: point,
          $maxDistance: maxDistance,
        },
      },
    };

    if (userId) {
      query.user = { $ne: userId };
    }

    return await RegionModel.find(query);
  }

  static async findAll(
    offset: number,
    limit: number,
  ): Promise<{ regions: Region[]; total: number }> {
    const [regions, total] = await Promise.all([
      RegionModel.find().lean().skip(offset).limit(limit),
      RegionModel.count(),
    ]);

    return { regions, total };
  }

  static async findByIdAndUpdate(
    id: string,
    updateData: RegionInput,
  ): Promise<Region | null> {
    return await RegionModel.findByIdAndUpdate(id, updateData);
  }

  static async delete(id: string): Promise<void> {
    await RegionModel.findByIdAndDelete(id);
  }
}
