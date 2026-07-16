 

import express from 'express'
import User from '../models/User.js';
import { protect,adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();
 
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find({ college: req.user.college._id })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id/role", protect, adminOnly, async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
 
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot change your own role" });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    if (user.college.toString() !== req.user.college._id.toString()) {
      return res.status(403).json({ message: "You can only manage users from your own college" });
    }

    user.role = role;
    await user.save();

    res.json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router
