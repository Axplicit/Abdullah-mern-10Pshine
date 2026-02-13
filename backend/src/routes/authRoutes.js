import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import {
  forgotPassword,
  resetPassword,
} from "../controllers/passwordController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// ==============================
// AUTH
// ==============================
router.post("/register", register);
router.post("/login", login);

// ==============================
// PASSWORD RESET (OTP BASED)
// ==============================
router.post("/forgot-password", forgotPassword);

// 🔥 CHANGED — no :token anymore
router.post("/reset-password", resetPassword);

// ==============================
// PROFILE (Protected)
// ==============================
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
