import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import api from "../api/axios";
import StarRating from "../components/StarRating";
import PageWrapper from "../components/PageWrapper";
import { useAuth } from "../context/AuthContext";

const STATUS_COLORS = { Pending: "#f59e0b", Reviewed: "#3b82f6", Resolved: "#10b981" };
const CATEGORY_COLORS = ["#6366f1", "#ec4899", "#14b8a6", "#f97316", "#a855f7"];

const statsContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const statItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const AdminDashboard = () => {
  const { userInfo } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [stats, setStats] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.append("status", statusFilter);
      if (searchTerm) params.append("search", searchTerm);
      const { data } = await api.get(`/feedback?${params.toString()}`);
      setFeedbacks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/feedback/stats");
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchFeedbacks(), 300);
    return () => clearTimeout(timeout);
     
  }, [statusFilter, searchTerm]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/feedback/${id}/status`, { status: newStatus });
      fetchFeedbacks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      fetchFeedbacks();
      fetchStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/feedback/export", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "feedback_export.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error(err);
    }
  };

  const statusChartData = stats
    ? [
        { name: "Pending", count: stats.pending },
        { name: "Reviewed", count: stats.reviewed },
        { name: "Resolved", count: stats.resolved },
      ]
    : [];

  const categoryChartData = stats
    ? stats.categoryCounts.map((c) => ({ name: c._id || "Uncategorized", value: c.count }))
    : [];

  return (
    <PageWrapper className='p-8 '>
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <p className="text-sm text-gray-500 mb-6">
        Managing feedback for <strong className="text-gray-700">{userInfo?.college?.name}</strong>
      </p>

      {stats && (
        <>
          <motion.div variants={statsContainer} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
            {[
              { label: "Total Feedback", value: stats.total },
              { label: "Pending", value: stats.pending },
              { label: "Reviewed", value: stats.reviewed },
              { label: "Resolved", value: stats.resolved },
              { label: "Avg Rating", value: stats.avgRating },
            ].map((s) => (
              <motion.div variants={statItem} key={s.label} className="card text-center py-5">
                <h3 className="text-2xl font-bold">{s.value}</h3>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5 mb-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card">
              <h4 className="text-center font-semibold mb-2">Feedback by Status</h4>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusChartData.map((entry, index) => (
                      <Cell key={index} fill={STATUS_COLORS[entry.name]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="card">
              <h4 className="text-center font-semibold mb-2">Feedback by Category</h4>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={categoryChartData} dataKey="value" nameKey="name" outerRadius={80} label>
                    {categoryChartData.map((entry, index) => (
                      <Cell key={index} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <input
          type="text"
          className="input-field flex-1 min-w-[200px]"
          placeholder="Search by name, subject or message..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select className="input-field w-auto" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Resolved">Resolved</option>
        </select>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={handleExport} className="btn-primary">
          Export as CSV
        </motion.button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 mt-10">Loading...</p>
      ) : (
        <div className="card overflow-x-auto p-0">
          <table className="w-full min-w-[800px] text-sm">
            <thead>
              <tr className="text-left border-b border-gray-200 bg-gray-50">
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Subject</th>
                <th className="p-3">Message</th>
                <th className="p-3">Rating</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((fb, i) => (
                <motion.tr
                  key={fb._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(i * 0.03, 0.3) }}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-3">{fb.name}<br /><small className="text-gray-400">{fb.email}</small></td>
                  <td className="p-3">{fb.category}</td>
                  <td className="p-3">{fb.subject}</td>
                  <td className="p-3 max-w-[220px]">{fb.message}</td>
                  <td className="p-3"><StarRating value={fb.rating} readOnly size="text-sm" /></td>
                  <td className="p-3">
                    <select className="input-field py-1.5" value={fb.status} onChange={(e) => handleStatusChange(fb._id, e.target.value)}>
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </td>
                  <td className="p-3">{new Date(fb.createdAt).toLocaleDateString()}</td>
                  <td className="p-3">
                    <button className="btn-danger" onClick={() => handleDelete(fb._id)}>Delete</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {feedbacks.length === 0 && <p className="text-center text-gray-500 py-6">No feedback found.</p>}
        </div>
      )}
    </PageWrapper>
  );
};

export default AdminDashboard;
