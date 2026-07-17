import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
      navigate("/reset-password");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div  style={{ backgroundImage: "url('/bg1.jpg')"}} className='bg-cover bg-center'>
    <div className="flex items-center justify-center min-h-screen  px-4"
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-8"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <FiLoader size={20} />
                </motion.div>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </motion.button>
        </form>

        {message && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 text-center text-sm font-medium text-gray-700"
          >
            {message}
          </motion.p>
        )}
      </motion.div>
    </div>
    </div>
  );
}
