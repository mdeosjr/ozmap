import "reflect-metadata";
import mongoose from "mongoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { Prop } from "@typegoose/typegoose";
import ObjectId = mongoose.Types.ObjectId;

export class Base extends TimeStamps {
  @Prop({ default: () => new ObjectId().toString() })
  _id: string;
}
