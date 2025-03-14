import { z } from "zod";

const userBaseSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
  address: z.string().optional(),
  coordinates: z
    .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
    .optional(),
});

export const createUserSchema = userBaseSchema.refine(
  (data) => {
    const hasAddress = data.address !== undefined;
    const hasCoordinates = data.coordinates !== undefined;
    return (hasAddress && !hasCoordinates) || (!hasAddress && hasCoordinates);
  },
  {
    message: "Provide only address or coordinates!",
  },
);

export const updateUserSchema = userBaseSchema.partial().refine(
  (data) => {
    const hasAddress = data.address !== undefined;
    const hasCoordinates = data.coordinates !== undefined;
    return !(hasAddress && hasCoordinates);
  },
  {
    message: "Provide only address or coordinates, not both!",
  },
);
