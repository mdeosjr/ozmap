import { User, UserModel } from "../models/userModel";

export class UserService {
  static async create() {}

  static async findAll(): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      UserModel.find().lean(),
      UserModel.count(),
    ]);

    return {
      users,
      total,
    };
  }

  static async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async update(id: string, updateData): Promise<User | null> {
    return await UserModel.findByIdAndUpdate(id, { $set: updateData });
  }

  static async delete() {}
}
