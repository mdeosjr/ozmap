import {
  pre,
  getModelForClass,
  Prop,
  Ref,
} from "@typegoose/typegoose";
import lib from "../lib";
import { Base } from "./models";
import { Region } from "./regionModel";

@pre<User>("save", async function (next) {
  const region = this as Omit<any, keyof User> & User;

  if (region.isModified("coordinates")) {
    region.address = await lib.getAddressFromCoordinates(region.coordinates);
  } else if (region.isModified("address")) {
    const { lat, lng } = await lib.getCoordinatesFromAddress(region.address);

    region.coordinates = [lng, lat];
  }

  next();
})

export class User extends Base {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true, type: () => [Number] })
  coordinates: [number, number];

  @Prop({ required: true, default: [], ref: () => Region, type: () => String })
  regions: Ref<Region>[];
}

export const UserModel = getModelForClass(User);