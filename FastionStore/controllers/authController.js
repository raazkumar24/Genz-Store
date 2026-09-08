import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'genz-store-dev-jwt-secret-2026';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required!" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: "Is email se account already exist karta hai!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: 'customer'
    });

    await newUser.save();
    return res.status(201).json({ message: "Account successfully ban gaya! Ab login karo." });
  } catch (error) {
    console.error("Register error:", error);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Is email se account already exist karta hai!" });
    }
    res.status(500).json({ message: "Server error during registration!", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email aur password dono required hain!" });
    }

    // Find user in MongoDB
    const dbUser = await User.findOne({ email: email.toLowerCase().trim() });

    if (!dbUser) {
      return res.status(401).json({ message: "Yeh email registered nahi hai. Pehle account banao." });
    }

    // Verify password
    const isPasswordMatch = await bcrypt.compare(password, dbUser.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Galat password hai. Dobara try karo." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: dbUser._id, role: dbUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: "Login ho gaya! 🔓",
      token,
      user: {
        id: dbUser._id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server Error, thodi der baad try karo.", error: error.message });
  }
};
