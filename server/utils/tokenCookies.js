import ms from "ms";

/**
 * Centralizes cookie options so accessToken/refreshToken cookies stay
 * identical everywhere they're set or cleared (login, googleLogin,
 * refresh, logout). Change an expiry or a security flag here and every
 * call site picks it up — avoids the "updated it in one place, forgot
 * the other" class of bug.
 */

const isProd = process.env.NODE_ENV === "production";

const baseOptions = {
  httpOnly: true,
  secure: isProd, // HTTPS only in prod; plain http is fine on localhost
  // "lax" works if frontend & backend share a domain (or same-site via a
  // reverse proxy) even in prod. Switch to "none" (with secure:true) only
  // if frontend and backend are on genuinely different domains in prod.
  sameSite: isProd ? "none" : "lax",
};

const ACCESS_TOKEN_MAX_AGE = ms(process.env.JWT_EXPIRES_IN || "15m");
const REFRESH_TOKEN_MAX_AGE = ms(process.env.JWT_REFRESH_EXPIRES_IN || "30d");

export const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie("accessToken", accessToken, {
    ...baseOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
    path: "/",
  });

  res.cookie("refreshToken", refreshToken, {
    ...baseOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/api/auth", // only sent to /api/auth/* routes (refresh, logout)
  });
};

export const clearAuthCookies = (res) => {
  res.clearCookie("accessToken", { ...baseOptions, path: "/" });
  res.clearCookie("refreshToken", { ...baseOptions, path: "/api/auth" });
};