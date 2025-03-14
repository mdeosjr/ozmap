import chai from "chai";
import sinonChai from "sinon-chai";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

chai.use(sinonChai);

let mongoServer: MongoMemoryServer;

before(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    process.env.MONGO_URI = mongoUri;
    process.env.JWT_SECRET_KEY = "test-secret";
    process.env.NODE_ENV = "test";

    await mongoose.connect(mongoUri);
    console.log("Connected to in-memory database");
  } catch (error) {
    console.error("Error setting up test database:", error);
    throw error;
  }
});

beforeEach(async () => {
  try {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  } catch (error) {
    console.error("Error cleaning database:", error);
    throw error;
  }
});

after(async () => {
  try {
    await mongoose.disconnect();
    await mongoServer.stop();
    console.log("Cleaned up test database");
  } catch (error) {
    console.error("Error cleaning up test database:", error);
    throw error;
  }
});
