import pino from "pino";

const isTest = process.env.NODE_ENV === "test";

const logger = isTest
  ? {
      info: () => {},
      error: () => {},
      warn: () => {},
      debug: () => {},
    }
  : pino({
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    });

export default logger;
