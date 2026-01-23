import logger from "../utils/logger.js";

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
        userId: req.user?.id || null,
      },
      "HTTP request completed"
    );
  });

  next();
};

export default loggerMiddleware;
