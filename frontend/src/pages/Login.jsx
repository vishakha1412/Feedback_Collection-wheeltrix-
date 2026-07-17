import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-10">
      {/* Left: Login Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold mb-5 text-teal-700 text-center">Login</h2>

        <AnimatePresence>
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
            <label className="block text-sm font-medium mb-1 text-teal-700">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-teal-700">Password</label>
            <input
              type="password"
              name="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-teal-700 transition"
          >
            {loading ? "Please wait..." : "Login"}
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 mt-3 text-center">
          <Link to="/forgot-password" className="text-teal-700 font-medium hover:underline">
            Forgot Password?
          </Link>
        </p>

        <p className="text-sm text-gray-600 mt-5 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-teal-700 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </motion.div>

      {/* Right: Animated 3D Student */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex md:w-1/2 justify-center items-center"
      >
        <motion.img
          src="/student.png"
          alt="3D Smart Student"
          className="w-96 h-auto"
          animate={{ y: [0, -15, 0], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </PageWrapper>
  );
};

export default Login;
