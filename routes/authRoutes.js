import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
} from "../server/controllers/authController.js";
import { protect } from "../server/middleware/authMiddleware.js";
import { authorizeRoles } from "../server/middleware/roleMiddleware.js";

const router = express.Router();

// Register
router.post("/register", registerUser);

// Login
router.post("/login", loginUser);

// Current Logged In User
router.get("/me", protect, getMe);

// Update profile
router.put("/profile", protect, updateProfile);

// Change Password
router.put("/change-password", protect, changePassword);

// Logout User
router.post("/logout", protect, logoutUser);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.put("/reset-password/:token", resetPassword);

// Verify Email
router.get("/verify-email/:token", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

// Admin Only
router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

// Writer Only
router.get(
  "/writer",
  protect,
  authorizeRoles("writer"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Writer",
      user: req.user,
    });
  }
);

// Reader Only
router.get(
  "/reader",
  protect,
  authorizeRoles("reader"),
  (req, res) => {
    res.json({
      success: true,
      message: "Welcome Reader",
      user: req.user,
    });
  }
);


export default router;