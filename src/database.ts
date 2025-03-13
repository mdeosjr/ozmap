import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

const env = process.env.NODE_ENV || "development";
const envFile = env === "test" ? ".env.test" : ".env";

dotenv.config({
  path: path.resolve(__dirname, "..", envFile),
});

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async function (): Promise<void> {
  try {
    if (env === "test") {
      console.log("Test environment detected, using in-memory database");
      return;
    }

    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

export const disconnectDB = async function (): Promise<void> {
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
};
