import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";

/* ======================================================
   Protect Middleware
====================================================== */

export const protect = asyncHandler(async (req, res, next) => {
  let accessToken;

  // Cookie is the primary path now — the React app relies on this exclusively.
  if (req.cookies?.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  // Bearer header kept only as a fallback for non-browser clients
  // (Postman, future mobile app) that can't hold cookies.
  if (
    !accessToken &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (decoded.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid token type.",
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      // Frontend's axios interceptor watches for this exact code to
      // silently call /api/auth/refresh and retry, instead of logging out.
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Access token expired.",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token.",
    });
  }
});

/* ======================================================
   Admin / Super Admin Only
====================================================== */

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication required.",
    });
  }

  if (
    req.user.role !== "admin" &&
    req.user.role !== "superadmin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Admin access required.",
    });
  }

  next();
};

/* ======================================================
   Role Middleware (Hierarchy Aware)
====================================================== */

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const userRole = req.user.role;

    // --------------------------------------------------
    // Super Admin can access everything
    // --------------------------------------------------
    if (userRole === "superadmin") {
      return next();
    }

    // --------------------------------------------------
    // Check allowed roles
    // --------------------------------------------------
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};


export const optionalAuth = asyncHandler(async (req, res, next) => {
  let accessToken;

  if (req.cookies?.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  if (
    !accessToken &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  // Guest allowed — token na thakle just pass through, req.user undefined-i thakবে
  if (!accessToken) {
    return next();
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

    if (decoded.type === "access") {
      const user = await User.findById(decoded.id).select("-password");
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (error) {
    // Invalid/expired token — এই route-এ refresh flow দরকার নাই, guest হিসেবেই চলুক
  }

  next();
});