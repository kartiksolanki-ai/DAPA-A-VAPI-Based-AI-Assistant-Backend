import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { loginSchema, registerSchema } from "../lib/validations/auth.js";
import { z } from "zod";

export const register = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);

    if (!validatedData) {
      return res.status(411).json({ message: "Invalid inputs" });
    }
    const { name, email, password } = validatedData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    const savedUser = await newUser.save();

    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token);
    res.status(201).json({
      token,
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email,
        role: savedUser.role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    if (!validatedData) {
      return res.status(411).json({ message: "Invalid inputs" });
    }

    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    console.log(token);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((err) => ({
          field: err.path[0],
          message: err.message
        }))
      });
    }
    res.status(500).json({ message: error.message });
  }
};
