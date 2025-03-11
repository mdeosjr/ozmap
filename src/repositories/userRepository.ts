import { User, UserModel } from "../models/userModel";
import { UserInput } from "../schemas/UserInput";

export class UserRepository {
  static async create(userData: UserInput): Promise<User> {
    const user = await UserModel.create(userData);

    return UserModel.findById(user._id, "-password");
  }

  static async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email });
  }

  static async findById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  static async findAll(): Promise<{ users: User[]; total: number }> {
    const [users, total] = await Promise.all([
      UserModel.find({}, "-password").lean(),
      UserModel.count(),
    ]);

    return { users, total };
  }

  static async update(
    id: string,
    updateData: Partial<User>,
  ): Promise<User | null> {
    const user = await UserModel.findById(id);

    Object.assign(user, updateData);
    return await user.save();
  }

  static async delete(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }
}
