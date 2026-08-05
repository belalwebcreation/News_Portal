import axios from "axios";
import { baseUrl } from "../../../config/Config";

export const apiClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// Request Interceptor
// =========================
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// Response Interceptor
// =========================
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network Error:", error.message);
      return Promise.reject(error);
    }

    switch (error.response.status) {
      case 401:
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        break;

      case 403:
        console.error("Permission denied");
        break;

      case 500:
        console.error("Internal server error");
        break;

      default:
        break;
    }

    return Promise.reject(error);
  }
);