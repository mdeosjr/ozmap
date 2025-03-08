import { connectDB } from "./database";
import express, { json } from "express";
import cors from "cors";
import routes from "./routes";

const PORT = process.env.PORT || 3003;

const server = express();

server.use(json());
server.use(cors());
server.use(routes);

const init = async (): Promise<void> => {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error initializing the server:", error);
    process.exit(1);
  }
};

init();
