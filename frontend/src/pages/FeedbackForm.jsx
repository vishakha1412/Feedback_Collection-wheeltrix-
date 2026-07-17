import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import StarRating from "../components/StarRating";
import PageWrapper from "../components/PageWrapper";

const FeedbackForm = () => {
  const { userInfo } = useAuth();
  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    category: "General",
    subject: "",
    message: "",
    rating: 5,
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRatingChange = (star) => setFormData({ ...formData, rating: star });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);
    try {
      await api.post("/feedback", formData);
      setSuccessMsg("Thank you! Your feedback was submitted successfully.");
      setFormData({ ...formData, subject: "", message: "", rating: 5, category: "General" });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-4">
      
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 justify-center items-center"
      >
        <motion.img
          src="/submitfeedback.png"  
          alt="Feedback Illustration"
          className="w-93 h-auto"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Right side: Feedback Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 max-w-lg bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-5 text-teal-700 text-center md:text-left">
          Submit Feedback
        </h2>

        <AnimatePresence>
          {successMsg && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-emerald-50 text-emerald-700 text-sm rounded-lg px-3 py-2 mb-4"
            >
              {successMsg}
            </motion.p>
          )}
          {error && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-50 text-red-600 text-sm rounded-lg px-3 py-2 mb-4"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-teal-700">Category</label>
            <select
              name="category"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.category}
              onChange={handleChange}
            >
              <option>General</option>
              <option>Bug Report</option>
              <option>Suggestion</option>
              <option>Complaint</option>
              <option>Compliment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-teal-700">Subject</label>
            <input
              type="text"
              name="subject"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-teal-700">Message</label>
            <textarea
              name="message"
              rows="5"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-teal-700">Rating</label>
            <StarRating value={formData.rating} onChange={handleRatingChange} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </motion.button>
        </form>
      </motion.div>
    </PageWrapper>
  );
};

export default FeedbackForm;
