import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react"; // Import useCallback
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

  // Memoize checkAuth to prevent unnecessary re-creation
  const checkAuth = useCallback(async () => {
    try {
      const response = await userAPI.getProfile();
      // Only set user if there's actual data.
      // This is crucial: if the backend responds with a user, we set it.
      // Otherwise, keep it null (as handled by the catch block).
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        setUser(null); // Ensure user is null if getProfile returns no user
      }
    } catch (error) {
      // If getProfile fails (e.g., 401 Unauthorized), set user to null
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []); // checkAuth only needs to be created once

  // This useEffect should only run ONCE on component mount to perform the initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]); // Add checkAuth to dependencies because it's defined inside the component,
  // but use useCallback to ensure it's stable.

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.user); // Set user upon successful login
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
      setUser(response.data.user); // Set user upon successful registration
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
      setUser(null); // Set user to null after logout
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
    checkAuth, // Keep checkAuth in value so other components can manually trigger it
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
