import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

/* =========================
   REGISTER
========================= */
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   LOGIN
========================= */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   GET PROFILE
========================= */
export const getProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
};

/* =========================
   UPDATE PROFILE (NAME)
========================= */
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === "") {
      throw new ApiError(400, "Name is required");
    }

    req.user.name = name.trim();
    await req.user.save();

    res.json({
      success: true,
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   CHANGE PASSWORD
========================= */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, "Current and new password are required");
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      req.user.password
    );

    if (!isMatch) {
      throw new ApiError(400, "Current password is incorrect");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    req.user.password = hashedPassword;
    await req.user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};
