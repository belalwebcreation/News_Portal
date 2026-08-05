import axios from "axios";

/**
 * প্রজেক্টের সব API কল এই instance দিয়ে করবে।
 * সাজেস্টেড লোকেশন: src/utils/axiosInstance.js
 *
 * .env এ যোগ করো:
 *   VITE_API_BASE_URL=http://localhost:5000
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  withCredentials: true, // backend cookie/session ব্যবহার করলে true রাখো
});

// প্রতিটা রিকোয়েস্টের সাথে auth token পাঠানো (JWT ব্যবহার করলে)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// এরর মেসেজকে সব জায়গায় একই shape এ নিয়ে আসা,
// যাতে প্রতিটা কম্পোনেন্টে আলাদা করে error.response.data.message লিখতে না হয়
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করো।";
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
