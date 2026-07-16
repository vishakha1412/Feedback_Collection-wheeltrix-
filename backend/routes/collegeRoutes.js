import express from 'express'
import College from "../models/College.js";

const router = express.Router();
 
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find().select("name").sort({ name: 1 });
    res.json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 export default router