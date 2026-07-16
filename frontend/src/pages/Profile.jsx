import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

const Message = ({ type, children }) => (
  <AnimatePresence>
    {children && (
      <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={`text-sm rounded-lg px-4 py-2 mb-4 shadow-sm ${
          type === "error"
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-emerald-100 text-emerald-700 border border-emerald-300"
        }`}
      >
        {children}
      </motion.p>
    )}
  </AnimatePresence>
);

const Profile = () => {
  const { userInfo, updateUser } = useAuth();
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const [profileData, setProfileData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) =>
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handlePasswordChange = (e) =>
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setProfileLoading(true);
    try {
      const { data } = await api.put("/auth/profile", profileData);
      updateUser(data);
      setProfileMsg("Profile updated successfully 🎉");
    } catch (err) {
      setProfileError(err.response?.data?.message || "Could not update profile");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    setPasswordLoading(true);
    try {
      await api.put("/auth/change-password", passwordData);
      setPasswordMsg("Password changed successfully 🔑");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Could not change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    
    <PageWrapper className="max-w-2xl mx-auto flex flex-col gap-8 mt-8 px-4 ">
     
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card bg-white shadow-lg rounded-xl p-6"
      >
        <h3 className="text-2xl font-bold mb-2 text-gray-800">Profile Details</h3>
        <p className="text-sm text-gray-500 mb-4">
          College:{" "}
          <strong className="text-gray-700">{userInfo?.college?.name}</strong>{" "}
          <span className="italic text-gray-400">(cannot be changed here)</span>
        </p>

        <Message type="success">{profileMsg}</Message>
        <Message type="error">{profileError}</Message>

        <form onSubmit={handleProfileSubmit} className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="input-field w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="input-field w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={profileLoading}
            className="btn-primary w-full py-2 rounded-lg bg-gray-800 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
          >
            {profileLoading ? "Saving..." : "Save Changes"}
          </motion.button>
        </form>
      </motion.div>

    
      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="px-6 py-2 rounded-lg font-semibold shadow-md bg-gray-800 text-white hover:bg-indigo-700 transition"
        >
          {showPasswordForm ? "Hide Password Form" : "Change Password"}
        </motion.button>
      </div>

    
      <AnimatePresence>
        {showPasswordForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="card bg-white shadow-lg rounded-xl p-6  mb-5"
          >
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Change Password
            </h3>

            <Message type="success">{passwordMsg}</Message>
            <Message type="error">{passwordError}</Message>

            <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="input-field w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="input-field w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-indigo-500 transition"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  minLength="6"
                  required
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={passwordLoading}
                className="btn-primary w-full py-2 rounded-lg bg-gray-800 text-white font-semibold shadow-md hover:bg-indigo-700 transition"
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
     
  );
};

export default Profile;
