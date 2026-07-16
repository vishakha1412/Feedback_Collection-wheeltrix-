import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";
import { CircleAnimation } from "../Animation/CircleAnimation";

const Home = () => {
  const { userInfo } = useAuth();

  return (
    <PageWrapper className="relative min-h-screen w-full flex items-center justify-center  overflow-hidden">
      <CircleAnimation/>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.2),transparent)]"
      />
     <CircleAnimation/>

      <div className="text-center w-full px-4 sm:px-6 md:px-8 lg:px-12 z-10">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: 'easeOut' }}
          className="text-4xl md:text-6xl font-display font-extrabold text-gray-900 mb-6 leading-tight"
        >
          Feedback Collection System
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          className="max-w-3xl mx-auto text-lg md:text-xl text-gray-700 mb-10"
        >
          A modern MERN stack application to collect, track, and manage feedback
          across colleges with secure login, real-time submission, and an admin dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
        >
          <Link to={userInfo ? "/submit-feedback" : "/register"}>
            <motion.button
              whileHover={{ scale: 1.08, boxShadow: "0px 8px 20px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 md:px-8 md:py-4 rounded-lg bg-gradient-to-r from-green-300   to-blue-300   font-semibold text-lg shadow-md transition-all duration-300"
            >
              {userInfo ? "Submit Feedback" : "Get Started"}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Home;
