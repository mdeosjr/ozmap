import { User } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { UserInput } from "../schemas/UserInput";
import bcrypt from "bcrypt";

export class UserService {
  static async create(userData: UserInput): Promise<User> {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User already exists", STATUS_CODE.CONFLICT);
    }

    const hashPassword = bcrypt.hashSync(userData.password, 8);

    userData.password = hashPassword;

    return await UserRepository.create(userData);
  }

  static async findAll(
    page: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const offset = (page - 1) * limit;
    const result = await UserRepository.findAll(offset, limit);
    if (result.total === 0) {
      throw new AppError("No users found", STATUS_CODE.NOT_FOUND);
    }

    return result;
  }

  static async findById(id: string): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    return user;
  }

  static async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    return await UserRepository.update(id, updateData);
  }

  static async delete(id: string): Promise<void> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    await UserRepository.delete(id);
  }
}
