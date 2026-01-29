import express from "express";
import { getMyProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/me", authMiddleware, getMyProfile);

export default router;
