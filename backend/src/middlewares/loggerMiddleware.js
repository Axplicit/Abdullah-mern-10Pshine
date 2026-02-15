import logger from "../utils/logger.js";

const loggerMiddleware = (req, res, next) => {
  // 🚫 Disable logging during tests
  if (process.env.NODE_ENV === "test") {
    return next();
  }

  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;

    logger.info(
      {
        method: req.method,
        url: req.originalUrl,
        status: res.statusCode,
        duration,
      },
      "HTTP request completed"
    );
  });

  next();
};

export default loggerMiddleware;
