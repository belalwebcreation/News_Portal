// ======================================================
// Rajshahi College News Portal
// Global Configuration File
// ======================================================

// =============================
// Backend API Base URL
// =============================
export const baseUrl =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =============================
// API Endpoints
// =============================
export const api = {
  // =============================
  // Authentication
  // =============================
  login: "/api/login",
  logout: "/api/logout",

  // =============================
  // Profile
  // =============================
  profile: "/api/profile",
  updateProfile: "/api/profile/update",

  publicProfile: "/api/public-profile",

  // =============================
  // News
  // =============================
  news: "/api/news",
  uploadNewsImage: "/api/news/image",
  users: "/api/users",

  // =============================
  // Category
  // =============================
  category: "/api/categories",

  // =============================
  // Writers
  // =============================
  writers: "/api/writers",

  // =============================
  // Dashboard
  // =============================
  dashboard: "/api/dashboard",

  // =============================
  // Mentions
  // =============================
  mentions: "/api/mentions/users",

};

// =============================
// Image Path
// =============================
export const imageUrl = `${baseUrl}/uploads/`;

// =============================
// Default Axios Timeout
// =============================
export const requestTimeout = 30000;

// =============================
// App Information
// =============================
export const appInfo = {
  appName: "Rajshahi College News Portal",
  version: "1.0.0",
};