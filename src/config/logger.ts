import pino from "pino";

const transport = pino.transport({
  target: "pino-pretty",
  options: {
    colorize: true,
    translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
    ignore: "pid,hostname",
  },
});

const logger = pino(
  {
    level: process.env.NODE_ENV === "development" ? "debug" : "info",
    base: undefined,
  },
  transport,
);

export default logger;
