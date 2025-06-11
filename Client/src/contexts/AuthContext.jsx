import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
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
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        // Explicitly set user to null if no user data is returned
        setUser(null);
      }
    } catch (error) {
      // If getProfile fails (e.g., 401 Unauthorized), set user to null
      // This is crucial: the backend error means no active session
      setUser(null);
      // Optional: Log the error if it's not a 401 to help debugging
      if (error.response?.status !== 401) {
        console.error("Error during checkAuth:", error);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // This useEffect should only run ONCE on component mount to perform the initial auth check
  useEffect(() => {
    setTimeout(() => checkAuth(), 1000);
  }, [checkAuth]); // checkAuth is stable due to useCallback

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
      await authAPI.logout(); // Call backend logout to clear cookie
      setUser(null); // Explicitly set user to null on the frontend
      toast.success("Logged out successfully");
      // Optional: Redirect to login page after logout if needed
      // window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
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
