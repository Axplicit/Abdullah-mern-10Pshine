import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(
        { path: req.originalUrl },
        "Missing or malformed Authorization header"
      );
      throw new ApiError(401, "No token provided");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      logger.warn(
        { path: req.originalUrl },
        "Invalid or expired JWT"
      );
      throw new ApiError(401, "Invalid or expired token");
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      logger.warn(
        { path: req.originalUrl },
        "Authenticated user not found"
      );
      throw new ApiError(401, "User not found");
    }

    req.user = user;

    logger.info(
      { path: req.originalUrl },
      "User authenticated"
    );

    next();
  } catch (error) {
    logger.error(
      { err: error, path: req.originalUrl },
      "Auth middleware error"
    );
    next(error);
  }
};

export default authMiddleware;
