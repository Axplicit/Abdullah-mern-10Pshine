import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn(
        { path: req.originalUrl },
        "Authorization header missing or malformed"
      );
      return res.status(401).json({ message: "No token provided" });
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
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await User.findByPk(decoded.id);

    if (!user) {
      logger.warn(
        { userId: decoded.id },
        "Authenticated user not found"
      );
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    logger.info(
      { userId: user.id, path: req.originalUrl },
      "User authenticated successfully"
    );

    next();
  } catch (error) {
    logger.error(
      { err: error },
      "Auth middleware failure"
    );
    return res.status(401).json({ message: "Authentication failed" });
  }
};

export default authMiddleware;
