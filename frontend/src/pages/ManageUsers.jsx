import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import PageWrapper from "../components/PageWrapper";

const ManageUsers = () => {
  const { userInfo } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/users");
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    setError("");
    setSuccessMsg("");
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      setSuccessMsg(`Role updated to "${newRole}" successfully.`);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update role");
    }
  };

  return (
    <PageWrapper className='p-8'>
      <h2 className="text-2xl font-bold">Manage Users</h2>
      <p className="text-sm text-gray-500 mb-1">
        Users of <strong className="text-gray-700">{userInfo?.college?.name}</strong>
      </p>
      <p className="text-sm text-gray-500 mb-6">
        Promote a trusted user to Admin, or demote an Admin back to a regular user.
        You cannot change your own role here (to avoid accidentally locking yourself out).
      </p>

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

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 bg-gray-50">
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Joined</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => {
                const isSelf = u._id === userInfo._id;
                return (
                  <motion.tr
                    key={u._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.04, 0.3) }}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">
                      <span className={u.role === "admin" ? "badge badge-resolved" : "badge badge-reviewed"}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-3">
                      {isSelf ? (
                        <span className="text-gray-400 text-sm">(you)</span>
                      ) : u.role === "admin" ? (
                        <button className="btn-danger" onClick={() => handleRoleChange(u._id, "user")}>
                          Demote to User
                        </button>
                      ) : (
                        <button className="btn-success" onClick={() => handleRoleChange(u._id, "admin")}>
                          Promote to Admin
                        </button>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-500 py-6">No users found.</p>}
        </div>
      )}
    </PageWrapper>
  );
};

export default ManageUsers;
