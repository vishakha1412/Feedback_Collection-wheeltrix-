import express from 'express'
import Feedback from '../models/Feedback.js';
import { protect,adminOnly } from '../middleware/authMiddleware.js';
 

const router = express.Router();
 
router.post("/", protect, async (req, res) => {
  try {
    const { name, email, category, subject, message, rating } = req.body;

    if (!subject || !message || !rating) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const feedback = await Feedback.create({
      user: req.user._id,
      college: req.user.college._id,
      name: name || req.user.name,
      email: email || req.user.email,
      category,
      subject,
      message,
      rating,
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.get("/my", protect, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const filter = { college: req.user.college._id };
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    
    if (req.query.search) {
      const regex = new RegExp(req.query.search, "i");
      filter.$or = [{ name: regex }, { subject: regex }, { message: regex }];
    }

    const feedbacks = await Feedback.find(filter).sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const collegeFilter = { college: req.user.college._id };

    const total = await Feedback.countDocuments(collegeFilter);
    const pending = await Feedback.countDocuments({ ...collegeFilter, status: "Pending" });
    const reviewed = await Feedback.countDocuments({ ...collegeFilter, status: "Reviewed" });
    const resolved = await Feedback.countDocuments({ ...collegeFilter, status: "Resolved" });

    const avgRatingResult = await Feedback.aggregate([
      { $match: collegeFilter },
      { $group: { _id: null, avgRating: { $avg: "$rating" } } },
    ]);
    const avgRating = avgRatingResult.length > 0 ? avgRatingResult[0].avgRating.toFixed(1) : 0;

    const categoryCounts = await Feedback.aggregate([
      { $match: collegeFilter },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    res.json({ total, pending, reviewed, resolved, avgRating, categoryCounts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.get("/export", protect, adminOnly, async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ college: req.user.college._id }).sort({ createdAt: -1 });

    let csv = "Name,Email,Category,Subject,Message,Rating,Status,Date\n";
    feedbacks.forEach((fb) => {
      const row = [
        fb.name,
        fb.email,
        fb.category,
        fb.subject,
        fb.message.replace(/,/g, ";").replace(/\n/g, " "),
        fb.rating,
        fb.status,
        fb.createdAt.toISOString().split("T")[0],
      ].join(",");
      csv += row + "\n";
    });

    res.header("Content-Type", "text/csv");
    res.attachment("feedback_export.csv");
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
router.put("/:id/status", protect, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.college.toString() !== req.user.college._id.toString()) {
      return res.status(403).json({ message: "You can only manage feedback from your own college" });
    }

    feedback.status = status;
    await feedback.save();

    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    if (feedback.college.toString() !== req.user.college._id.toString()) {
      return res.status(403).json({ message: "You can only manage feedback from your own college" });
    }

    await feedback.deleteOne();
    res.json({ message: "Feedback removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router
