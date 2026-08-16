// ======================================================
// Rajshahi College News Portal
// Global Configuration File
// ======================================================

// =============================
// Backend API Base URL
// =============================
//
// IMPORTANT:
// এটা ইচ্ছাকৃতভাবে একটা RELATIVE path ("/news"), কোনো
// absolute URL (http://localhost:5000/news) না।
//
// কারণ:
//
// Dev:
//   Frontend  -> http://localhost:5173
//   axios call -> http://localhost:5173/news/api/...
//   এটা vite.config.js এর proxy ("/news/api") ধরে
//   ভেতরে ভেতরে http://localhost:5000 এ forward করে দেয়।
//   ফলে browser এর চোখে সবসময় SAME-ORIGIN request —
//   httpOnly cookie block হওয়ার কোনো সুযোগ থাকে না।
//
// Production:
//   Frontend ও backend এমনিতেই same domain এ serve হয়
//   (https://www.royalbangla.com/news), তাই relative path
//   এখানেও ঠিকভাবে কাজ করে, কোনো পরিবর্তন লাগে না।
//
// যদি .env ফাইলে VITE_API_BASE_URL এখনো
// "http://localhost:5000/news" এর মতো absolute value সেট
// করা থাকে, সেটা এই default কে override করে ফেলবে —
// তাই .env থেকেও সেটা সরিয়ে/relative করে দিতে হবে।
//
export const baseUrl =
  import.meta.env.VITE_API_BASE_URL || "/news";

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