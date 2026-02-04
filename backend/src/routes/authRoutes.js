import express from "express";
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);

// Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile (protected)
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);

export default router;
