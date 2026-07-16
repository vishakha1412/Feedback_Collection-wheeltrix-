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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (star) => {
    setFormData({ ...formData, rating: star });
  };

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
    <PageWrapper className="max-w-md mx-auto mt-6   p-8 ">
      <div className="card">
        <h2 className="text-2xl font-bold mb-5">Submit Feedback</h2>

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
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" className="input-field" value={formData.category} onChange={handleChange}>
              <option>General</option>
              <option>Bug Report</option>
              <option>Suggestion</option>
              <option>Complaint</option>
              <option>Compliment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Subject</label>
            <input type="text" name="subject" className="input-field" value={formData.subject} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea name="message" rows="5" className="input-field" value={formData.message} onChange={handleChange} required></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <StarRating value={formData.rating} onChange={handleRatingChange} />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </motion.button>
        </form>
      </div>
    </PageWrapper>
  );
};

export default FeedbackForm;
