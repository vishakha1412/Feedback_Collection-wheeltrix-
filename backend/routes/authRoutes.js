import express from 'express'
import jwt from "jsonwebtoken"
import User from '../models/User.js';
import College from '../models/College.js';
import { protect } from '../middleware/authMiddleware.js';
import nodemailer from 'nodemailer'
 

const router = express.Router();

 
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

 
const buildAuthResponse = (user, college) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  college: { _id: college._id, name: college.name },
  token: generateToken(user._id),
});

 
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, collegeName } = req.body;

    if (!name || !email || !password || !collegeName) {
      return res.status(400).json({ message: "Please fill all fields, including your college name" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const slug = collegeName.trim().toLowerCase();
    let college = await College.findOne({ slug });
    let role = "user";

    if (!college) {
      
      college = await College.create({ name: collegeName.trim(), slug });
      role = "admin";
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      college: college._id,
    });

    res.status(201).json(buildAuthResponse(user, college));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("college", "name slug");
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json(buildAuthResponse(user, user.college));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});
 
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("college", "name slug");
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email } = req.body;

    if (email && email !== user.email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
    }

    if (name) user.name = name;

    await user.save();

    res.json(buildAuthResponse(user, user.college));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Please provide both current and new password" });
    }

    const user = await User.findById(req.user._id);
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    user.password = newPassword;  
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

 
   const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 min expiry
    await user.save();

 
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.resetPasswordOTP !== otp || Date.now() > user.resetPasswordExpires) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
export default router
