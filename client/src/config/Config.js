// ======================================================
// Rajshahi College News Portal
// Global Configuration File
// ======================================================

export const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "/news";

// ✅ NEW: Socket.io endpoint path — server/socket/index.js এর সাথে
// exact মিলতে হবে।
export const socketPath = "/news/socket.io";

export const api = {
  login: "/api/login",
  logout: "/api/logout",

  profile: "/api/profile",
  updateProfile: "/api/profile/update",

  publicProfile: "/api/public-profile",

  news: "/api/news",
  uploadNewsImage: "/api/news/image",
  users: "/api/users",

  category: "/api/categories",

  writers: "/api/writers",

  dashboard: "/api/dashboard",

  mentions: "/api/mentions/users",

  // ✅ NEW
  notifications: "/api/notifications",
};

export const imageUrl = `${baseUrl}/uploads/`;

export const requestTimeout = 30000;

export const appInfo = {
  appName: "Royal Bangla News",
  version: "1.0.0",
};