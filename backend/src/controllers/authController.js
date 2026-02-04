import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";

// REGISTER
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ where: { email } });
    if (exists) throw new ApiError(400, "User already exists");

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash });

    res.status(201).json({ message: "User registered" });
  } catch (err) {
    next(err);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) throw new ApiError(400, "Invalid credentials");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError(400, "Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

// GET PROFILE
export const getProfile = async (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    createdAt: req.user.createdAt,
  });
};

// UPDATE PROFILE
export const updateProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) throw new ApiError(400, "Name required");

    req.user.name = name;
    await req.user.save();

    res.json({ message: "Profile updated" });
  } catch (err) {
    next(err);
  }
};

// CHANGE PASSWORD
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const match = await bcrypt.compare(
      currentPassword,
      req.user.password
    );
    if (!match) throw new ApiError(400, "Wrong password");

    req.user.password = await bcrypt.hash(newPassword, 10);
    await req.user.save();

    res.json({ message: "Password changed" });
  } catch (err) {
    next(err);
  }
};
