import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(1),
  address: z.string().optional(),
  coordinates: z
    .tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)])
    .optional(),
});

export const createUserSchema = userSchema.refine(
  (data) => {
    const hasAddress = data.address !== undefined;
    const hasCoordinates = data.coordinates !== undefined;
    return (hasAddress && !hasCoordinates) || (!hasAddress && hasCoordinates);
  },
  {
    message: "Provide only address or coordinates!",
  },
);

export type UserInput = z.infer<typeof createUserSchema>;
