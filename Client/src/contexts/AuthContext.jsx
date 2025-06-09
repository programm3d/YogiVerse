import React, { createContext, useState, useContext, useEffect } from "react";
import { authAPI, userAPI } from "../services/api";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await userAPI.getProfile();
      setUser(response.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      toast.success("Welcome back!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authAPI.register(data);
      setUser(response.data.user);
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
