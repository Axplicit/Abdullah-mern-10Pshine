import bcrypt from "bcryptjs";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import ApiError from "../utils/ApiError.js";
import nodemailer from "nodemailer";
import sendEmail from "../utils/sendEmail.js";


// 📧 Email transporter (Gmail example)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==============================
// FORGOT PASSWORD (SEND OTP)
// ==============================
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) throw new ApiError(400, "Email is required");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    // 🔐 Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await user.save();

    // 📧 Send email
    await transporter.sendMail({
      from: `"Memora Support" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <h2>Password Reset Request</h2>
        <p>Your OTP for password reset is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for 10 minutes.</p>
      `,
    });

    logger.info({ userId: user.id }, "OTP sent successfully");

    res.json({
      status: "success",
      message: "OTP sent to your email",
    });
  } catch (error) {
    logger.error({ err: error }, "Forgot password failed");
    next(error);
  }
};

// ==============================
// VERIFY OTP + RESET PASSWORD
// ==============================
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password)
      throw new ApiError(400, "All fields are required");

    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(404, "User not found");

    if (
      user.resetOtp !== otp ||
      !user.resetOtpExpires ||
      user.resetOtpExpires < new Date()
    ) {
      throw new ApiError(400, "Invalid or expired OTP");
    }

    // 🔐 Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // 🧹 Clear OTP
    user.resetOtp = null;
    user.resetOtpExpires = null;

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
