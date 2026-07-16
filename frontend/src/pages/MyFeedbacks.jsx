import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import StarRating from "../components/StarRating";
import PageWrapper from "../components/PageWrapper";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const MyFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyFeedbacks = async () => {
      try {
        const { data } = await api.get("/feedback/my");
        setFeedbacks(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyFeedbacks();
  }, []);

  const statusClass = (status) => {
    if (status === "Pending") return "badge badge-pending";
    if (status === "Reviewed") return "badge badge-reviewed";
    return "badge badge-resolved";
  };

  const filteredFeedbacks = feedbacks.filter((fb) => {
    const term = searchTerm.toLowerCase();
    return (
      fb.subject.toLowerCase().includes(term) ||
      fb.message.toLowerCase().includes(term) ||
      fb.category.toLowerCase().includes(term)
    );
  });

  if (loading) return <p className="text-center text-gray-500 mt-10">Loading...</p>;

  return (
    <PageWrapper className='p-8'>
      <h2 className="text-2xl font-bold mb-4">My Submitted Feedback</h2>

      <input
        type="text"
        className="input-field max-w-md mb-6"
        placeholder="Search your feedback by subject, message or category..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredFeedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback found.</p>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-4">
          <AnimatePresence>
            {filteredFeedbacks.map((fb) => (
              <motion.div variants={item} exit={{ opacity: 0 }} key={fb._id} className="card">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <h3 className="font-semibold text-lg">{fb.subject}</h3>
                  <span className={statusClass(fb.status)}>{fb.status}</span>
                </div>
                <p className="text-gray-600 mt-1">{fb.message}</p>
                <div className="flex justify-between items-center flex-wrap gap-2 mt-3">
                  <StarRating value={fb.rating} readOnly size="text-base" />
                  <p className="text-sm text-gray-500">
                    {fb.category} &middot; {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </PageWrapper>
  );
};

export default MyFeedbacks;
