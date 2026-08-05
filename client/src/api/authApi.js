import axios from "axios";

// Environment variables থেকে Dynamic Base URL গ্রহণ করা হচ্ছে
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const API = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // HTTP-Only Cookie পাঠাতে প্রয়োজন
});

// ==========================
// Register
// ==========================
export const registerApi = (userData) => {
  return API.post("/register", userData);
};

// ==========================
// Login
// ==========================
export const loginApi = (userData) => {
  return API.post("/login", userData);
};

// ==========================
// Get Current User
// ==========================
export const getMeApi = (token) => {
  return API.get("/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ==========================
// Logout
// ==========================
export const logoutApi = (token) => {
  return API.post(
    "/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ==========================
// Forgot Password
// ==========================
export const forgotPasswordApi = (email) => {
  return API.post("/forgot-password", {
    email,
  });
};

// ==========================
// Reset Password
// ==========================
export const resetPasswordApi = (token, password) => {
  return API.put(`/reset-password/${token}`, {
    password,
  });
};

// ==========================
// Verify Email
// ==========================
export const verifyEmailApi = (token) => {
  return API.get(`/verify-email/${token}`);
};

// ==========================
// Update Profile
// ==========================
export const updateProfileApi = (token, data) => {
  return API.put("/profile", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ==========================
// Change Password
// ==========================
export const changePasswordApi = (token, data) => {
  return API.put("/change-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default API;