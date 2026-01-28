import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { forgotPassword, resetPassword } from "../controllers/passwordController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Profile
router.get("/me", authMiddleware, getMe);

export default router;
