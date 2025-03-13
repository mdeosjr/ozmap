import { User } from "../models/userModel";
import { UserRepository } from "../repositories/userRepository";
import { AppError, STATUS_CODE } from "../errors/AppError";
import { CreateUserInput } from "../types/userTypes";
import bcrypt from "bcrypt";
import logger from "../config/logger";
import mongoose from "mongoose";
import { RegionRepository } from "../repositories/regionRepository";

export class UserService {
  static async create(userData: CreateUserInput): Promise<User> {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      logger.warn(
        { email: userData.email },
        "Attempted to create user with existing email",
      );
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
      logger.warn("No users found in database");
      throw new AppError("No users found", STATUS_CODE.NOT_FOUND);
    }

    return result;
  }

  static async findById(id: string): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warn({ userId: id }, "User not found");
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    return user;
  }

  static async update(id: string, updateData: Partial<User>): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warn({ userId: id }, "Attempted to update non-existent user");
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    return await UserRepository.update(id, updateData);
  }

  static async delete(id: string): Promise<void> {
    const user = await UserRepository.findById(id);
    if (!user) {
      logger.warn({ userId: id }, "Attempted to delete non-existent user");
      throw new AppError("User not found", STATUS_CODE.NOT_FOUND);
    }

    if (user.regions.length === 0) {
      logger.info({ userId: id }, "User has no regions");
      return await UserRepository.delete(id);
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await RegionRepository.deleteMany(user._id, session);

      await UserRepository.delete(id, session);

      await session.commitTransaction();
    } catch (err) {
      logger.error({ user: user._id, error: err }, "Error deleting user");
      await session.abortTransaction();
      throw new AppError(
        "Failed to delete user",
        STATUS_CODE.INTERNAL_SERVER_ERROR,
      );
    } finally {
      session.endSession();
    }
  }
}
