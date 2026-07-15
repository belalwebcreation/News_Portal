// ======================================================
// Rajshahi College News Portal
// Global Configuration File
// ======================================================

// =============================
// Backend API Base URL
// =============================
// Development
export const baseUrl = "http://localhost:5000";

// =============================
// API Endpoints
// =============================
export const api = {
  login: "/api/login",
  logout: "/api/logout",

  profile: "/api/profile",
  updateProfile: "/api/profile/update",

  createNews: "/api/news/create",
  getNews: "/api/news",
  updateNews: "/api/news/update",
  deleteNews: "/api/news/delete",

  uploadImage: "/api/upload",

  category: "/api/category",

  writers: "/api/writers",

  dashboard: "/api/dashboard",
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

// ======================================================
// Production Example
// ======================================================
// export const baseUrl = "https://api.yourdomain.com";