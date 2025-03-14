import { User } from "../models/userModel";

export type UserBaseInput = Pick<User, "name" | "email" | "password">;

export type UserWithAddressInput = UserBaseInput & Pick<User, "address">;

export type UserWithCoordinatesInput = UserBaseInput &
  Pick<User, "coordinates">;

export type CreateUserInput = UserBaseInput &
  Partial<Pick<User, "address" | "coordinates">>;

export type UpdateUserInput = Partial<
  Pick<User, "name" | "email" | "password" | "address" | "coordinates">
>;
