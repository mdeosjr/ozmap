import {
  pre,
  getModelForClass,
  Prop,
  Ref,
  DocumentType,
} from "@typegoose/typegoose";
import lib from "../lib";
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

export class User extends Base {
  @Prop({ required: true })
  public name!: string;

  @Prop({ required: true })
  public email!: string;

  @Prop()
  public address: string;

  @Prop({ type: () => [Number] })
  public coordinates: [number, number];

  @Prop({ default: [], ref: () => Region, type: () => Region })
  public regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);
