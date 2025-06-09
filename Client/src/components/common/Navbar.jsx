import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../contexts/AuthContext";
import {
  Menu,
  X,
  Home,
  User,
  LogOut,
  PlusCircle,
  Shield,
  Activity,
} from "lucide-react";

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 bg-gradient-to-r from-yoga-purple to-yoga-pink rounded-full flex items-center justify-center"
            >
              <Activity className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yoga-purple to-yoga-pink bg-clip-text text-transparent">
              YogiVerse
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/feed"
              className="flex items-center space-x-2 text-gray-700 hover:text-yoga-purple transition-colors"
            >
              <Home className="w-5 h-5" />
              <span>Feed</span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="flex items-center space-x-2 text-gray-700 hover:text-yoga-purple transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  <span>Create</span>
                </Link>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-700 hover:text-yoga-purple transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-2 text-gray-700 hover:text-yoga-purple transition-colors"
                  >
                    <Shield className="w-5 h-5" />
                    <span>Admin</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>

                <div className="flex items-center space-x-2">
                  {user.profilePic && (
                    <img
                      src={user.profilePic}
                      alt={user.username}
                      className="w-8 h-8 rounded-full border-2 border-yoga-purple"
                    />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {user.username}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-yoga-purple transition-colors"
                >
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            <Link
              to="/feed"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Feed
            </Link>
            {user ? (
              <>
                <Link
                  to="/create-post"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Post
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
