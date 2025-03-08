import { User } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";

export class UserService {
  static async create(userData: Partial<User>): Promise<User> {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("User already exists", STATUS_CODE.CONFLICT);
    }

    if (userData.coordinates && userData.address) {
      throw new AppError(
        "Cannot provide both coordinates and address",
        STATUS_CODE.BAD_REQUEST,
      );
    } else if (!userData.coordinates && !userData.address) {
      throw new AppError(
        "Must provide either coordinates or address",
        STATUS_CODE.BAD_REQUEST,
      );
    }

    return await UserRepository.create(userData);
  }

  static async findAll(): Promise<{ users: User[]; total: number }> {
    const result = await UserRepository.findAll();
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
