import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Camera, User, Mail, Calendar, Film, Heart, Edit2 } from "lucide-react";
import { userAPI, postAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import PostCard from "../components/posts/PostCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, checkAuth } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ name: "" });
  const [profilePic, setProfilePic] = useState(null);
  const [stats, setStats] = useState({ posts: 0, likes: 0 });

  useEffect(() => {
    if (user) {
      fetchUserPosts();
      setProfileData({ name: user.username || "" });
      // console.log(user);
    }
  }, [page]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const response = await postAPI.getUserPosts(user._id, { page, limit: 9 });
      setUserPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setStats((prev) => ({ ...prev, posts: response.data.posts.length }));
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const formData = { name: profileData.name };

    if (profilePic) {
      formData.profilePic = profilePic;
    }

    try {
      await userAPI.updateProfile(formData);
      await checkAuth();
      setIsEditingProfile(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePic(file);
    }
  };

  const handleRemoveProfilePic = async () => {
    if (
      window.confirm("Are you sure you want to remove your profile picture?")
    ) {
      try {
        await userAPI.deleteProfilePic();
        await checkAuth();
        toast.success("Profile picture removed");
      } catch (error) {
        toast.error("Failed to remove profile picture");
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading && !user) return <LoadingSpinner />;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Profile Picture */}
            <div className="relative">
              {user?.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gradient-to-r from-yoga-purple to-yoga-pink rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              )}
              {isEditingProfile && (
                <>
                  <label
                    htmlFor="profile-pic"
                    className="absolute bottom-0 right-0 bg-yoga-purple text-white p-2 rounded-full cursor-pointer hover:bg-yoga-pink transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </label>
                  <input
                    id="profile-pic"
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePicChange}
                    className="hidden"
                  />
                </>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate}>
                  {/* <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    placeholder="Your name"
                    className="text-2xl font-bold mb-2 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yoga-purple focus:border-transparent"
                  /> */}
                  <div className="flex gap-2 mt-4">
                    <button
                      type="submit"
                      className="btn-primary px-4 py-2 text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    {user?.profilePic && (
                      <button
                        type="button"
                        onClick={handleRemoveProfilePic}
                        className="px-4 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50 transition-colors"
                      >
                        Remove Picture
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <>
                  <h1 className="text-3xl font-bold mb-2">
                    {user?.name || user?.username}
                  </h1>
                  <p className="text-gray-600 mb-4">@{user?.username}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user?.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {formatDate(user?.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="btn-primary px-6 py-2 flex items-center gap-2 mx-auto sm:mx-0"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="flex gap-6 sm:gap-8">
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Film className="w-5 h-5" />
                  <span className="text-sm">Posts</span>
                </div>
                <p className="text-2xl font-bold">{stats.posts}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 text-gray-600 mb-1">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">Likes</span>
                </div>
                <p className="text-2xl font-bold">{stats.likes}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Posts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-6">My Posts</h2>

          {loading ? (
            <LoadingSpinner />
          ) : userPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <Film className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg">
                You haven't created any posts yet
              </p>
              <Link to="/create-post" className="btn-primary inline-block mt-4">
                Create Your First Post
              </Link>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post, index) => (
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
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;
