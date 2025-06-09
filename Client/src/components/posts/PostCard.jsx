import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Play, User, Clock } from "lucide-react";
import { postAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import toast from "react-hot-toast";

const PostCard = ({ post }) => {
  const { user } = useAuth();
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLikeCount();
    checkIfLiked();
  }, [post._id]);

  const fetchLikeCount = async () => {
    try {
      const response = await postAPI.getLikeCount(post._id);
      if (response.data.likeCount && response.data.likeCount.length > 0) {
        setLikes(response.data.likeCount[0].likesCount);
      }
    } catch (error) {
      console.error("Failed to fetch like count");
    }
  };

  const checkIfLiked = () => {
    if (user && post.likedBy && post.likedBy.includes(user._id)) {
      setIsLiked(true);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to like posts");
      return;
    }

    setIsLoading(true);
    try {
      const response = await postAPI.likePost(post._id);
      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      toast.error("Failed to like post");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return postDate.toLocaleDateString();
  };

  return (
    <Link to={`/post/${post._id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all overflow-hidden h-full"
      >
        {/* Video/Image Preview */}
        <div className="relative aspect-video bg-gray-100">
          {post.contentLink ? (
            <div className="relative w-full h-full group">
              <video
                src={post.contentLink}
                className="w-full h-full object-cover"
                muted
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <Play className="w-12 h-12 text-white opacity-80 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 bg-gradient-to-r from-yoga-purple to-yoga-pink rounded-full flex items-center justify-center">
                <Play className="w-10 h-10 text-white" />
              </div>
            </div>
          )}

          {/* Difficulty Badge */}
          {post.difficultyLevel && (
            <div className="absolute top-2 right-2 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-medium">
              {post.difficultyLevel}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-2">
            {post.title}
          </h3>

          {post.description && (
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {post.description}
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {post.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* User Info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-2">
              {post.userId?.profilePic ? (
                <img
                  src={post.userId.profilePic}
                  alt={post.userId.username}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
              <span>{post.userId?.username || "Anonymous"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-3 border-t">
            <button
              onClick={handleLike}
              disabled={isLoading}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likes}</span>
            </button>
            <div className="flex items-center gap-1 text-gray-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default PostCard;
