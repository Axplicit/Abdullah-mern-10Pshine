import crypto from "crypto";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import User from "../models/User.js";
import logger from "../utils/logger.js";


// FORGOT PASSWORD

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      logger.warn("Forgot password requested without email");
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ where: { email } });

    if (!user) {
      logger.warn({ email }, "Forgot password requested for non-existent user");
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

    await user.save();

    logger.info(
      { userId: user.id },
      "Password reset token generated"
    );

    res.status(200).json({
      message: "Password reset token generated",
      resetToken // ⚠️ dev-only, NEVER in production
    });
  } catch (error) {
    logger.error(
      { err: error },
      "Forgot password flow failed"
    );
    res.status(500).json({ message: "Server error" });
  }
};


// RESET PASSWORD

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      logger.warn("Reset password attempted without new password");
      return res.status(400).json({ message: "Password is required" });
    }

    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { [Op.gt]: Date.now() }
      }
    });

    if (!user) {
      logger.warn("Invalid or expired password reset token used");
      return res.status(400).json({ message: "Token is invalid or expired" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();

    logger.info(
      { userId: user.id },
      "Password reset successful"
    );

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    logger.error(
      { err: error },
      "Reset password flow failed"
    );
    res.status(500).json({ message: "Server error" });
  }
};
