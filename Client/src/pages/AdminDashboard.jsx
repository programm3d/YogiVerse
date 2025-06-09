import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Users,
  FileText,
  Shield,
  Search,
  Ban,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { userAPI, reportAPI } from "../services/api";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    } else {
      fetchReports();
    }
  }, [activeTab, page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllUsers({
        page,
        limit: 10,
        search: searchQuery,
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await reportAPI.getReports({ page, limit: 10 });
      setReports(response.data.reports);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        await userAPI.blockUser(userId);
        toast.success("User blocked successfully");
        fetchUsers();
      } catch (error) {
        toast.error("Failed to block user");
      }
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await reportAPI.deleteReport(reportId);
        toast.success("Report deleted");
        fetchReports();
      } catch (error) {
        toast.error("Failed to delete report");
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const tabs = [
    { id: "users", label: "Users", icon: Users },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-yoga-purple" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">Manage users and content reports</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setPage(1);
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-yoga-purple to-yoga-pink text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          {activeTab === "users" ? (
            <>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent"
                  />
                </div>
              </form>

              {/* Users Table */}
              {loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            User
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Email
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Role
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user._id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                {user.profilePic ? (
                                  <img
                                    src={user.profilePic}
                                    alt={user.username}
                                    className="w-10 h-10 rounded-full"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                    <Users className="w-5 h-5 text-gray-600" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-medium">{user.username}</p>
                                  <p className="text-sm text-gray-500">
                                    {user.name || "No name"}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {user.email}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`flex items-center gap-1 text-sm ${
                                  user.status === "blocked"
                                    ? "text-red-600"
                                    : "text-green-600"
                                }`}
                              >
                                {user.status === "blocked" ? (
                                  <XCircle className="w-4 h-4" />
                                ) : (
                                  <CheckCircle className="w-4 h-4" />
                                )}
                                {user.status || "active"}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {user.role !== "admin" && (
                                <button
                                  onClick={() => handleBlockUser(user._id)}
                                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                    user.status === "blocked"
                                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                >
                                  {user.status === "blocked"
                                    ? "Unblock"
                                    : "Block"}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              {/* Reports List */}
              {loading ? (
                <LoadingSpinner />
              ) : reports.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">No reports found</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <motion.div
                        key={report._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-4 mb-2">
                              <div>
                                <p className="font-medium">
                                  Reported by:{" "}
                                  {report.userId?.username || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(
                                    report.createdAt
                                  ).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="border-l pl-4">
                                <p className="text-sm text-gray-600">
                                  Post by:{" "}
                                  {report.postUserId?.username || "Unknown"}
                                </p>
                              </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-3 mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">
                                Reason:
                              </p>
                              <p className="text-gray-600">
                                {report.description}
                              </p>
                            </div>

                            <div className="flex items-center gap-4">
                              <a
                                href={`/post/${report.postId?._id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-sm text-yoga-purple hover:text-yoga-pink transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                View Post
                              </a>
                              {report.postId?.contentLink && (
                                <a
                                  href={report.postId.contentLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                  View Video
                                </a>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => handleDeleteReport(report._id)}
                            className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      <span className="px-4 py-2 text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
