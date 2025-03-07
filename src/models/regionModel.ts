import mongoose from "mongoose";
import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  modelOptions,
} from "@typegoose/typegoose";
import { Base } from "./models";
import ObjectId = mongoose.Types.ObjectId;
import { User, UserModel } from "./userModel";

@pre<Region>("save", async function (next) {
  if (!this._id) {
    this._id = new ObjectId().toString();
  }

  if (this.isNew) {
    const user = await UserModel.findOne({ _id: this.user });
    user.regions.push(this._id);
    await user.save({ session: this.$session() });
  }

  next(this.validateSync());
})

@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class Region extends Base {
  @Prop({ required: true })
  public name!: string;

  @Prop({required: true})
  public coordinates!: number[][][]

  @Prop({ ref: 'User', required: true, type: () => User })
  public user: Ref<User>;
}

export const RegionModel = getModelForClass(Region);
