import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";

// FORGOT PASSWORD
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    logger.info({ email }, "Forgot password request");

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn({ email }, "Forgot password requested for non-existent user");
      throw new ApiError(404, "User not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; 

    await user.save();

    logger.info({ userId: user.id }, "Password reset token generated");

    res.status(200).json({
      status: "success",
      message: "Password reset token generated",
      resetToken, 
    });
  } catch (error) {
    logger.error({ err: error }, "Forgot password failed");
    next(error);
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    logger.info("Reset password attempt");

    if (!password) {
      throw new ApiError(400, "Password is required");
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      logger.warn("Invalid or expired reset token used");
      throw new ApiError(400, "Token is invalid or expired");
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    logger.info({ userId: user.id }, "Password reset successful");

    res.json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    logger.error({ err: error }, "Reset password failed");
    next(error);
  }
};
