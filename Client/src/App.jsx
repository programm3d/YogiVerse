import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";

// Import pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import CreatePostPage from "./pages/CreatePostPage";
import PostDetailPage from "./pages/PostDetailPage";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

// Import components
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./components/common/ProtectedRoute";
import LoadingSpinner from "./components/common/LoadingSpinner";

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
          <Navbar />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#333",
                color: "#fff",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-post"
              element={
                <ProtectedRoute>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
