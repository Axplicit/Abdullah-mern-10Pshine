import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import logger from "../utils/logger.js";


// REGISTER

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    logger.info({ email }, "Register attempt");

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      logger.warn({ email }, "Registration failed: user already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    logger.info(
      { userId: user.id, email: user.email },
      "User registered successfully"
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    logger.error(
      { err: error, body: req.body },
      "Register error"
    );
    res.status(500).json({ message: "Server error" });
  }
};


// LOGIN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info({ email }, "Login attempt");

    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn({ email }, "Login failed: user not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn({ userId: user.id }, "Login failed: invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    logger.info(
      { userId: user.id },
      "User logged in successfully"
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error(
      { err: error, email: req.body?.email },
      "Login error"
    );
    res.status(500).json({ message: "Server error" });
  }
};
