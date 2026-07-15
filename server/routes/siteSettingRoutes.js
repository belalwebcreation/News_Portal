import express from "express";
import uploadLogo from "../middleware/uploadLogo.js";

import {
  getSiteSettings,
  updateSiteSettings,
  uploadLogo as uploadLogoController,
  deleteLogo,
  updateLogoVisibility,
} from "../controllers/siteSettingController.js";

const router = express.Router();

// ===============================
// Get Site Settings
// ===============================
router.get("/", getSiteSettings);

// ===============================
// Update General Site Settings
// ===============================
router.put("/", updateSiteSettings);

// ===============================
// Upload / Change Logo
// ===============================
router.put(
  "/logo",
  uploadLogo.single("logo"),
  uploadLogoController
);

// ===============================
// Delete Logo
// ===============================
router.delete("/logo", deleteLogo);

// ===============================
// Show / Hide Logo
// ===============================
router.put("/logo/visibility", updateLogoVisibility);

export default router;