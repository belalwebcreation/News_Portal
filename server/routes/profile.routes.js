import express from "express";

import {
  getProfile,
  updateProfile,
  updateAvatar,
  removeAvatar,
  updateAvatarPosition,
  updateCoverPhoto,
  removeCoverPhoto,
  updateCoverPosition,
  changePassword,
  getProfileStats,
  getSavedNews,
  getSavedNewsCount,     // NEW
  getBookmarkStatus,     // NEW
  toggleBookmark,        // NEW
  getReadingHistory,
  recordReadingHistory,
  clearReadingHistory,
} from "../controllers/profile.controller.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import validate from "../middleware/validate.js";

import {
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/profile.validator.js";

const router = express.Router();

/* ======================================================
   Profile
====================================================== */

router.get("/", protect, getProfile);

router.put(
  "/",
  protect,
  validate(updateProfileSchema),
  updateProfile
);

/* ======================================================
   Avatar
====================================================== */

router.patch("/avatar", protect, upload.single("avatar"), updateAvatar);
router.delete("/avatar", protect, removeAvatar);
router.patch("/avatar/position", protect, updateAvatarPosition);

/* ======================================================
   Cover Photo
====================================================== */

router.patch(
  "/cover-photo",
  protect,
  upload.single("coverPhoto"),
  updateCoverPhoto
);
router.delete("/cover-photo", protect, removeCoverPhoto);
router.patch("/cover-photo/position", protect, updateCoverPosition);

/* ======================================================
   Change Password
====================================================== */

router.patch(
  "/change-password",
  protect,
  validate(changePasswordSchema),
  changePassword
);

/* ======================================================
   Profile Stats
====================================================== */

router.get("/stats", protect, getProfileStats);

/* ======================================================
   Saved News / Bookmarks
====================================================== */

router.get("/saved-news", protect, getSavedNews);
router.get("/saved-news/count", protect, getSavedNewsCount);          // NEW
router.get("/saved-news/:newsId/status", protect, getBookmarkStatus); // NEW
router.post("/saved-news/:newsId/toggle", protect, toggleBookmark);   // NEW

/* ======================================================
   Reading History
====================================================== */

router.get("/reading-history", protect, getReadingHistory);
router.post("/reading-history", protect, recordReadingHistory);
router.delete("/reading-history", protect, clearReadingHistory);

export default router;