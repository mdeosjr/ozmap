import mongoose from "mongoose";
import { User, UserModel } from "../models/userModel";
import { CreateUserInput } from "../types/userTypes";

export class UserRepository {
  static async create(userData: CreateUserInput): Promise<User> {
    const user = await UserModel.create(userData);

    return UserModel.findById(user._id, "-password");
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id, "-password");
  }

  static async findAll(
    offset: number,
    limit: number,
  ): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      UserModel.find({}, "-password").lean().skip(offset).limit(limit),
      UserModel.count(),
    ]);

    return { users, total };
  }

  static async update(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(id, updateData);

    return user;
  }

  static async delete(
    id: string,
    session?: mongoose.ClientSession,
  ): Promise<void> {
    await UserModel.findByIdAndDelete(id, { session });
  }

  static async deleteRegionFromUser(
    userId: string,
    regionId: string,
    session: mongoose.ClientSession,
  ): Promise<void> {
    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { regions: regionId } },
      { session },
    );
  }
}
