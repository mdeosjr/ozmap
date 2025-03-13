import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import logger from "./config/logger";

const env = process.env.NODE_ENV || "development";
const envFile = env === "test" ? ".env.test" : ".env";

dotenv.config({
  path: path.resolve(__dirname, "..", envFile),
});

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async function (): Promise<void> {
  try {
    if (env === "test") {
      logger.info("Test environment detected, using in-memory database");
      return;
    }

    await mongoose.connect(MONGO_URI);
    logger.info("Connected to MongoDB successfully");
  } catch (error) {
    logger.error(error, "Error connecting to MongoDB");
    process.exit(1);
  }
};

export const disconnectDB = async function (): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected successfully");
  } catch (error) {
    logger.error(error, "Error disconnecting from MongoDB");
  }
};
