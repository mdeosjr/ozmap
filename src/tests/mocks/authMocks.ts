import jwt from "jsonwebtoken";
import { User } from "../../models/userModel";

export const generateAuthToken = (user: User): string => {
  return jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY || "default-secret",
    { expiresIn: "1h" },
  );
};

export const generateInvalidToken = (): string => {
  return "invalid-token";
};

export const generateAuthHeader = (token: string): string => {
  return `Bearer ${token}`;
};
