import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  DocumentType,
  modelOptions,
} from "@typegoose/typegoose";
import lib from "../libs/geoLib";
import { Base } from "./models";
import { Region } from "./regionModel";

@pre<User>("save", async function (this: DocumentType<User>, next) {
  if (this.isModified("coordinates")) {
    this.address = await lib.getAddressFromCoordinates(this.coordinates);
  } else if (this.isModified("address")) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(this.address);
    this.coordinates = [lng, lat];
  }

  next();
})
@modelOptions({ schemaOptions: { validateBeforeSave: true } })
export class User extends Base {
  @Prop({ required: true })
  public name!: string;

  @Prop({ required: true, unique: true })
  public email!: string;

  @Prop()
  public address: string;

  @Prop({ type: () => [Number] })
  public coordinates: [number, number];

  @Prop({ default: [], ref: () => Region, type: () => Region })
  public regions: Ref<Region>[];

  @Prop({ required: true })
  public password!: string;
}

export const UserModel = getModelForClass(User);
