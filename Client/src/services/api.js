import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "https://yogiverse.onrender.com/api";
// const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (no change needed here)
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is a 401 and the request was NOT to the login endpoint itself
    // This prevents the infinite redirect loop
    // if (
    //   error.response?.status === 401 &&
    //   !error.config.url.includes("/auth/login") && // Prevent redirect if current page is login
    //   !window.location.pathname.includes("/login") // Prevent redirect if already on login page
    // ) {
    //   // Only redirect if not already on the login page
    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

// ... (rest of your API exports remain the same)
export const authAPI = {
  requestOTP: (data) => api.post("/auth/request-otp", data),
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  logout: () => api.get("/auth/logout"),
  requestResetOTP: (data) => api.post("/auth/request-reset-otp", data),
  resetPassword: (data) => api.post("/auth/reset-password", data),
};

export const userAPI = {
  getProfile: () => api.get("/user/profile"),
  updateProfile: (data) => {
    const formData = new FormData();
    if (data.profilePic) formData.append("profilePic", data.profilePic);
    if (data.name) formData.append("name", data.name);
    return api.patch("/user/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteProfilePic: () => api.delete("/user/profile/pic"),
  getAllUsers: (params) =>
    api.get("/user/all", {
      params,
    }),
  blockUser: (id) => api.patch(`/user/block/${id}`),
};

export const postAPI = {
  createPost: (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    if (data.description) formData.append("description", data.description);
    if (data.tags) formData.append("tags", data.tags);
    if (data.difficultyLevel)
      formData.append("difficultyLevel", data.difficultyLevel);
    if (data.video) formData.append("video", data.video);
    return api.post("/post/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updatePost: (id, data) => api.put(`/post/${id}`, data),
  deletePost: (id) => api.delete(`/post/${id}`),
  getPost: (id) => api.get(`/post/${id}`),
  getUserPosts: (userId, params) =>
    api.get(`/post/user/${userId}`, {
      params,
    }),
  getFeed: (params) =>
    api.get("/post/feed/all", {
      params,
    }),
  likePost: (id) => api.post(`/post/${id}/like`),
  searchPosts: (params) =>
    api.get("/post/search/all", {
      params,
    }),
  getLikeCount: (id) => api.get(`/post/likeCount/${id}`),
};

export const commentAPI = {
  createComment: (data) => api.post("/comment/", data),
  getPostComments: (postId, params) =>
    api.get(`/comment/post/${postId}`, {
      params,
    }),
  deleteComment: (id) => api.delete(`/comment/${id}`),
};

export const reportAPI = {
  createReport: (data) => api.post("/report", data),
  getReports: (params) =>
    api.get("/report", {
      params,
    }),
  deleteReport: (id) => api.delete(`/report/${id}`),
};

export default api;
