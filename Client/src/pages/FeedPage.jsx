import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Clock, Users } from "lucide-react";
import { postAPI } from "../services/api";
import PostCard from "../components/posts/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getFeed({ page, limit: 12 });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      fetchPosts();
      return;
    }

    setLoading(true);
    try {
      const response = await postAPI.searchPosts({
        search: searchQuery,
        page: 1,
      });
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setPage(1);
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Explore the{" "}
            <span className="bg-gradient-to-r from-yoga-purple to-yoga-pink bg-clip-text text-transparent">
              YogiVerse
            </span>
          </h1>
          <p className="text-gray-600 text-lg">
            Discover amazing yoga content from our community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8"
        >
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts, tags, or users..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3">
              Search
            </button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Recent
            </button>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
              <Users className="w-4 h-4" />
              Following
            </button>
          </div>
        </motion.div>

        {/* Posts Grid */}
        {loading ? (
          <LoadingSpinner />
        ) : posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No posts found</p>
          </motion.div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <motion.div
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-600">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeedPage;
