import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass =
    "text-gray-800 font-medium hover:text-emerald-700 transition-colors";

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-r from-emerald-200 via-teal-200 to-sky-300 border-b-2 border-gray-300
                 px-6 py-4 flex flex-wrap justify-between items-center gap-3 sticky top-0 z-50"
    >
      <Link to="/" className="font-display text-xl font-bold text-gray-900 tracking-wide">
        Feedback System
      </Link>

      <div className="flex flex-wrap items-center gap-5">
        {userInfo ? (
          <>
            <Link to="/submit-feedback" className={linkClass}>Submit Feedback</Link>
            <Link to="/my-feedbacks" className={linkClass}>My Feedbacks</Link>
            {userInfo.role === "admin" && <Link to="/admin" className={linkClass}>Admin Dashboard</Link>}
            {userInfo.role === "admin" && <Link to="/admin/users" className={linkClass}>Manage Users</Link>}
            <Link to="/profile" className={linkClass}>Profile</Link>
            <span className="italic text-gray-700 text-sm">
              Hi, {userInfo.name} ({userInfo.college?.name})
            </span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="text-gray-800 font-medium underline hover:text-red-600 transition-colors"
            >
              Logout
            </motion.button>
          </>
        ) : (
          <>
            <Link to="/login" className={linkClass}>Login</Link>
            <Link to="/register" className={linkClass}>Register</Link>
          </>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
