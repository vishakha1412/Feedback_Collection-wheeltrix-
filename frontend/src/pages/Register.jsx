import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", collegeName: "" });
  const [existingColleges, setExistingColleges] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const { data } = await api.get("/colleges");
        setExistingColleges(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchColleges();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", formData);
      login(data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const isNewCollege =
    formData.collegeName.trim() !== "" &&
    !existingColleges.some((c) => c.name.toLowerCase() === formData.collegeName.trim().toLowerCase());

  return (
    <PageWrapper className="min-h-screen flex flex-col md:flex-row items-center justify-center px-6 py-10 ">
     
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full md:w-1/2 max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-3xl font-bold text-teal-700 mb-5 text-center">Create an Account</h2>

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
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="input-field"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              className="input-field"
              value={formData.password}
              onChange={handleChange}
              minLength="6"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">College Name</label>
            <input
              type="text"
              name="collegeName"
              list="college-suggestions"
              className="input-field"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="e.g. Green Valley College"
              required
            />
            <datalist id="college-suggestions">
              {existingColleges.map((c) => (
                <option key={c._id} value={c.name} />
              ))}
            </datalist>

            <AnimatePresence>
              {isNewCollege && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-blue-50 text-blue-700 text-xs rounded-lg px-3 py-2 mt-2"
                >
                  This college doesn't exist yet — you'll become its Admin automatically.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="btn-primary mt-2 bg-teal-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Please wait..." : "Register"}
          </motion.button>
        </form>

        <p className="text-sm text-gray-600 mt-5 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-teal-400 font-medium hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>

       
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
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </PageWrapper>
  );
};

export default Register;
