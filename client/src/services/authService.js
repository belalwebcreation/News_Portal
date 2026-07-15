import {
  registerApi,
  loginApi,
  logoutApi,
  getMeApi,
  verifyEmailApi,
  forgotPasswordApi,
  resetPasswordApi,
  updateProfileApi,
  changePasswordApi,
} from "../api/authApi";

import {
  saveToken,
  getToken,
  removeToken,
} from "../utils/token";

// ===========================
// Register
// ===========================
export const register = async (userData) => {
  const res = await registerApi(userData);

  return res.data;
};

// ===========================
// Login
// ===========================
export const login = async (userData) => {
  const res = await loginApi(userData);

  saveToken(res.data.token);

  return res.data;
};

// ===========================
// Logout
// ===========================
export const logout = async () => {
  const token = getToken();

  if (token) {
    try {
      await logoutApi(token);
    } catch (error) {
      console.log(error);
    }
  }

  removeToken();
};

// ===========================
// Load Current User
// ===========================
export const loadUser = async () => {
  const token = getToken();

  if (!token) return null;

  try {
    const res = await getMeApi(token);

    return res.data.user;
  } catch (error) {
    removeToken();

    return null;
  }
};

// ===========================
// Verify Email
// ===========================
export const verifyEmail = async (token) => {
  const res = await verifyEmailApi(token);

  return res.data;
};

// ===========================
// Forgot Password
// ===========================
export const forgotPassword = async (email) => {
  const res = await forgotPasswordApi(email);

  return res.data;
};

// ===========================
// Reset Password
// ===========================
export const resetPassword = async (token, password) => {
  const res = await resetPasswordApi(token, password);

  return res.data;
};

// ===========================
// Update Profile
// ===========================
export const updateProfile = async (data) => {
  const token = getToken();

  const res = await updateProfileApi(token, data);

  return res.data;
};

// ===========================
// Change Password
// ===========================
export const changePassword = async (data) => {
  const token = getToken();

  const res = await changePasswordApi(token, data);

  return res.data;
};