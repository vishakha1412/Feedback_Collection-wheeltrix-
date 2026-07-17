import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState("");

  const handleLogout = () => {
    logout();
    setShowConfirm(false);
    setIsOpen(false);
    setToast("You have logged out successfully.");
    setTimeout(() => {
      setToast("");
      navigate("/login");
    }, 2000);
  };

  const linkClass =
    "block px-4 py-2  text-white font-serif  font-bold hover:text-teal-600 transition-colors duration-300";

  return (
    <>
    
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gradient-to-r from-teal-400 via-teal-600 to-teal-400 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-md"
      >
        <Link
          to="/"
          className="font-display text-2xl font-extrabold text-white tracking-wide hover:text-yellow-200 transition-colors"
        >
          Feedback System
        </Link>

        <button
          className="text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
        </button>
      </motion.nav>

      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="fixed top-0 right-0 h-full w-64 bg-gradient-to-r from-teal-400   to-teal-400 shadow-lg z-50 flex flex-col p-6   font-serif"
            >
              <h3 className="text-lg font-bold text-teal-100 mb-4">Menu</h3>
              {userInfo ? (
                <>
                  <Link to="/submit-feedback" className={linkClass} onClick={() => setIsOpen(false)}>
                    Submit Feedback
                  </Link>
                  <Link to="/my-feedbacks" className={linkClass} onClick={() => setIsOpen(false)}>
                    My Feedbacks
                  </Link>
                  {userInfo.role === "admin" && (
                    <Link to="/admin" className={linkClass} onClick={() => setIsOpen(false)}>
                      Admin Dashboard
                    </Link>
                  )}
                  {userInfo.role === "admin" && (
                    <Link to="/admin/users" className={linkClass} onClick={() => setIsOpen(false)}>
                      Manage Users
                    </Link>
                  )}
                  <Link to="/profile" className={linkClass} onClick={() => setIsOpen(false)}>
                    Profile
                  </Link>

                  <span className="italic text-blue-600 text-sm mt-4">
                    Hi, {userInfo.name} ({userInfo.college?.name})
                  </span>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowConfirm(true)}
                    className="mt-4 text-red-600  hover:text-red-700 transition-colors duration-300  border-y-2 shadow-lg rounded-full bg-teal-200 font-bold"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <Link to="/login" className={linkClass} onClick={() => setIsOpen(false)}>
                    Login
                  </Link>
                  <Link to="/register" className={linkClass} onClick={() => setIsOpen(false)}>
                    Register
                  </Link>
                </>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    
      <AnimatePresence>
        {showConfirm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-50"
              onClick={() => setShowConfirm(false)}
            />
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Confirm Logout</h2>
                <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  >
                    Yes, Logout
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

 
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
