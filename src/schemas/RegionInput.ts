import { z } from "zod";

const coordinatesSchema = z
  .array(
    z
      .array(
        z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
      )
      .nonempty(),
  )
  .nonempty();

const regionBaseSchema = z.object({
  name: z.string().min(1),
  geometry: z.object({
    type: z.literal("Polygon"),
    coordinates: coordinatesSchema,
  }),
});

export const createRegionSchema = regionBaseSchema;

export const updateRegionSchema = regionBaseSchema.partial();
