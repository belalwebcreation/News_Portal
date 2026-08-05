import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ===============================
// Request Interceptor
// ===============================

api.interceptors.request.use(
  (config) => {
    // Login-এর সময় token নামে save হয়েছে
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ===============================
// Response Interceptor
// ===============================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Unauthorized");

      // চাইলে এখানে logout করতে পারেন
      // localStorage.removeItem("token");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;