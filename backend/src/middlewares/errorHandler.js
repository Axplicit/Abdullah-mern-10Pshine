import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

const errorHandler = (err, req, res, next) => {
  const isApiError = err instanceof ApiError;

  const statusCode = isApiError ? err.statusCode : 500;
  const message = isApiError ? err.message : "Internal Server Error";

  logger.error(
    {
      err,
      statusCode,
      path: req.originalUrl,
      method: req.method,
      userId: req.user?.id || null,
    },
    "Unhandled application error"
  );

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
    }),
  });
};

export default errorHandler;
