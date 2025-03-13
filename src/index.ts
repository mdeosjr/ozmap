import { connectDB } from "./database";
import express, { json } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

const PORT = process.env.PORT || 3003;

const server = express();

server.use(json());
server.use(cors());
server.use(routes);
server.use(errorMiddleware);

const init = async (): Promise<void> => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "test") {
      server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Error initializing the server:", error);
    process.exit(1);
  }
};

init();
