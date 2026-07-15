// src/utils/token.js

const TOKEN_KEY = "news_portal_token";

// Save Token
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Get Token
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Remove Token
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

// Check Login
export const isLoggedIn = () => {
  return !!localStorage.getItem(TOKEN_KEY);
};