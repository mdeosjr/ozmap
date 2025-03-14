import { Region } from "../models/regionModel";

export type RegionBaseInput = Pick<Region, "name" | "geometry">;

export type CreateRegionInput = RegionBaseInput & Pick<Region, "user">;

export type UpdateRegionInput = Partial<RegionBaseInput>;
