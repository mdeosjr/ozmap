import { User } from "../models/userModel";

export type LoginInput = Pick<User, "email" | "password">;
