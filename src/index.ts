import { connectDB } from "./database";
import express, { json } from "express";
import cors from "cors";
import routes from "./routes";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";
import logger from "./config/logger";

const PORT = process.env.PORT || 3003;

const server = express();

server.use(json());
server.use(cors());
server.use(logMiddleware);
server.use(routes);
server.use(errorMiddleware);

const init = async (): Promise<void> => {
  try {
    await connectDB();
    if (process.env.NODE_ENV !== "test") {
      server.listen(PORT, () => {
        logger.info(
          `Server is running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
        );
      });
    }
  } catch (error) {
    logger.error(error, "Error initializing the server");
    process.exit(1);
  }
};

init();

export default server;
