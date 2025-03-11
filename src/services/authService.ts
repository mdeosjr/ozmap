import { sign } from "jsonwebtoken";
import { compare } from "bcrypt";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { LoginInput } from "../schemas/AuthInput";

export class AuthService {
  static async login({ email, password }: LoginInput): Promise<string> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new AppError("Invalid credentials", STATUS_CODE.UNAUTHORIZED);
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError("Invalid credentials", STATUS_CODE.UNAUTHORIZED);
    }

    const token = sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET || "default-secret",
      {
        expiresIn: "1d",
      },
    );

    return token;
  }
}
