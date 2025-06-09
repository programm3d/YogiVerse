import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Heart,
  MessageCircle,
  Flag,
  Share2,
  Edit,
  Trash2,
  User,
  Clock,
} from "lucide-react";
import { postAPI, commentAPI, reportAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import LoadingSpinner from "../components/common/LoadingSpinner";
import CommentSection from "../components/posts/CommentSection";
import toast from "react-hot-toast";

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await postAPI.getPost(id);
      setPost(response.data.post);
      checkIfLiked(response.data.post);
      fetchLikeCount();
    } catch (error) {
      toast.error("Failed to load post");
      navigate("/feed");
    } finally {
      setLoading(false);
    }
  };

  const fetchLikeCount = async () => {
    try {
      const response = await postAPI.getLikeCount(id);
      if (response.data.likeCount && response.data.likeCount.length > 0) {
        setLikes(response.data.likeCount[0].likesCount);
      }
    } catch (error) {
      console.error("Failed to fetch like count");
    }
  };

  const checkIfLiked = (postData) => {
    if (user && postData.likedBy && postData.likedBy.includes(user._id)) {
      setIsLiked(true);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like posts");
      navigate("/login");
      return;
    }

    try {
      const response = await postAPI.likePost(id);
      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      toast.error("Failed to like post");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await postAPI.deletePost(id);
        toast.success("Post deleted successfully");
        navigate("/feed");
      } catch (error) {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting");
      return;
    }

    try {
      await reportAPI.createReport({
        postId: id,
        description: reportReason,
      });
      toast.success("Post reported successfully");
      setShowReportModal(false);
      setReportReason("");
    } catch (error) {
      toast.error("Failed to report post");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) return <LoadingSpinner />;
  if (!post) return null;

  const isOwner = user && post.userId._id === user._id;
  const canDelete = isOwner || isAdmin;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-3 gap-8"
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Video Player */}
              <div className="aspect-video bg-black">
                <video
                  src={post.contentLink}
                  controls
                  className="w-full h-full"
                  controlsList="nodownload"
                />
              </div>

              {/* Post Info */}
              <div className="p-6">
                <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                  {post.title}
                </h1>

                {/* User Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    {post.userId.profilePic ? (
                      <img
                        src={post.userId.profilePic}
                        alt={post.userId.username}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">{post.userId.username}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isOwner && (
                      <button
                        onClick={() => navigate(`/edit-post/${id}`)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={handleDelete}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                    {user && !isOwner && (
                      <button
                        onClick={() => setShowReportModal(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Flag className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {post.description && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {post.description}
                    </p>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Difficulty Level */}
                {post.difficultyLevel && (
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Difficulty Level</h3>
                    <span className="px-4 py-2 bg-gradient-to-r from-yoga-purple to-yoga-pink text-white rounded-lg text-sm font-medium">
                      {post.difficultyLevel}
                    </span>
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center gap-6 pt-6 border-t">
                  <button
                    onClick={handleLike}
                    className={`flex items-center gap-2 transition-colors ${
                      isLiked
                        ? "text-red-500"
                        : "text-gray-600 hover:text-red-500"
                    }`}
                  >
                    <Heart
                      className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span className="font-medium">{likes} Likes</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-600 hover:text-yoga-purple transition-colors">
                    <Share2 className="w-6 h-6" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <CommentSection postId={id} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-20">
              <h3 className="font-semibold mb-4">Related Posts</h3>
              <p className="text-gray-500 text-sm">Coming soon...</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-semibold mb-4">Report Post</h3>
            <textarea
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please describe why you're reporting this post..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-yoga-purple focus:border-transparent"
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowReportModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReport}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Report
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
