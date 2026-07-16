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
    <PageWrapper className="max-w-md mx-auto mt-10 p-7">
      <div className="card">
        <h2 className="text-2xl font-bold mb-5">Login</h2>

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
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" name="email" className="input-field" value={formData.email} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input type="password" name="password" className="input-field" value={formData.password} onChange={handleChange} required />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary mt-2"
          >
            {loading ? "Please wait..." : "Login"}
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="text-emerald-700 font-medium hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
};

export default Login;
