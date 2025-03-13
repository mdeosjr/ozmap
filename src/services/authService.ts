import { sign } from "jsonwebtoken";
import { compareSync } from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { LoginInput } from "../types/authTypes";
import logger from "../config/logger";

export class AuthService {
  static async login({ email, password }: LoginInput): Promise<string> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      logger.warn({ email }, "Login attempt with invalid email");
      throw new AppError("Invalid credentials", STATUS_CODE.UNAUTHORIZED);
    }

    const passwordMatch = compareSync(password, user.password);
    if (!passwordMatch) {
      logger.warn({ email }, "Login attempt with invalid password");
      throw new AppError("Invalid credentials", STATUS_CODE.UNAUTHORIZED);
    }

    const token = sign(
      {
        id: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY || "default-secret",
      {
        expiresIn: "1d",
      },
    );

    logger.info({ userId: user._id }, "User logged in successfully");
    return token;
  }
}
