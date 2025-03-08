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

export class GeoJSONPolygon {
  @Prop({ required: true, enum: ["Polygon"] })
  public type!: "Polygon";

  @Prop({ required: true, type: () => [[[Number]]] })
  public coordinates!: number[][][];
}

@pre<Region>("save", async function (next) {
  if (!this._id) {
    this._id = new ObjectId().toString();
  }

  if (this.isNew) {
    const user = await UserModel.findById({ _id: this.user });
    user.regions.push(this._id);
    await user.save({ session: this.$session() });
  }

  next(this.validateSync());
})
@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class Region extends Base {
  @Prop({ required: true })
  public name!: string;

  @Prop({ type: () => GeoJSONPolygon, required: true })
  public geometry!: GeoJSONPolygon;

  @Prop({ ref: "User", required: true, type: () => String })
  public user!: Ref<User>;
}

export const RegionModel = getModelForClass(Region);

RegionModel.schema.index({ geometry: "2dsphere" });
