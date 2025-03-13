import mongoose from "mongoose";
import dotenv from "dotenv";
import { MongoMemoryServer } from "mongodb-memory-server";

dotenv.config();

let mongoServer: MongoMemoryServer;

before(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri);
});

after(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});
