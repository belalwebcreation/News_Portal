import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/auth",
  headers: {
    "Content-Type": "application/json",
  },
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