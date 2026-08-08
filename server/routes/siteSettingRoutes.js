import express from "express";
import uploadImage from "../middleware/uploadLogo.js"; // generic multer instance — কোনো field-name-এর সাথে bound না, তাই logo ও banner দুটোতেই reuse করা যায়

import {
  getSiteSettings,
  updateSiteSettings,
  uploadLogo as uploadLogoController,
  deleteLogo,
  updateLogoVisibility,
  uploadBanner as uploadBannerController,
  deleteBanner,
  updateBannerVisibility,
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
  uploadImage.single("logo"),
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

// ===============================
// Upload / Change Hero Banner
// ===============================
router.put(
  "/banner",
  uploadImage.single("banner"),
  uploadBannerController
);

// ===============================
// Delete Hero Banner
// ===============================
router.delete("/banner", deleteBanner);

// ===============================
// Show / Hide Hero Banner
// ===============================
router.put("/banner/visibility", updateBannerVisibility);

export default router;