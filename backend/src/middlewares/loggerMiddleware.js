import pinoHttp from "pino-http";
import logger from "../utils/logger.js";

const loggerMiddleware = pinoHttp({
  logger,
});

export default loggerMiddleware;
