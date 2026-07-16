import express from 'express'
 
import authRoutes from './routes/authRoutes.js'
import feedbackRoutes from './routes/feedbackRoutes.js'
import userRoutes from './routes/userRoutes.js'
import collegeRoutes from  './routes/collegeRoutes.js'
import connectDB from "./config/db.js";
import dotenv from 'dotenv'
import cors from 'cors'

dotenv.config();
connectDB();

const app = express();

 
app.use(cors())
app.use(express.json());
 
app.use("/api/auth",authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/users", userRoutes);
app.use("/api/colleges", collegeRoutes);

 
app.get("/", (req, res) => {
  res.send("Feedback Collection System API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
