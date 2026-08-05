import SiteSetting from "../models/SiteSetting.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

/* ======================================================
   Helpers
====================================================== */

const getOrCreateSettings = async () => {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create({
      logo: "",
      logoPublicId: "",
      logoVisible: true,
    });
  }

  return settings;
};

const buildSettingsResponse = (settings) => ({
  logo: settings.logo || "",
  logoVisible: settings.logoVisible,
  navbar: [...(settings.navbar || [])].sort(
    (a, b) => a.order - b.order
  ),
});

/* ======================================================
   Get Site Settings
====================================================== */

export const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    // ক্যাটাগরির name এবং slug পপুলেট করা হলো
    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Get Site Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to load site settings.",
    });
  }
};

/* ======================================================
   Update General Site Settings
====================================================== */

export const updateSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { logoVisible } = req.body;

    if (logoVisible !== undefined) {
      settings.logoVisible = Boolean(logoVisible);
    }

    await settings.save();

    // সেভ করার পর রেসপন্স পাঠানোর আগে পপুলেট করা হলো
    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Site settings updated successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Update Site Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update site settings.",
    });
  }
};

/* ======================================================
   Upload / Change Logo
====================================================== */
export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a logo.",
      });
    }

    const settings = await getOrCreateSettings();

    // Delete previous logo from Cloudinary
    if (settings.logoPublicId) {
      await deleteFromCloudinary(settings.logoPublicId);
    }

    // Upload new logo
    const result = await uploadToCloudinary(
      req.file.buffer,
      "site-settings/logo"
    );

    settings.logo = result.secure_url;
    settings.logoPublicId = result.public_id;

    await settings.save();

    // লোগো আপলোডের পর রেসপন্স ডাটা পপুলেট করা হলো
    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Upload Logo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload logo.",
    });
  }
};

/* ======================================================
   Delete Logo
====================================================== */

export const deleteLogo = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (!settings.logo) {
      return res.status(404).json({
        success: false,
        message: "Logo not found.",
      });
    }

    if (settings.logoPublicId) {
      await deleteFromCloudinary(settings.logoPublicId);
    }

    settings.logo = "";
    settings.logoPublicId = "";

    await settings.save();

    // লোগো ডিলিটের পর রেসপন্স ডাটা পপুলেট করা হলো
    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Logo deleted successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Delete Logo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete logo.",
    });
  }
};

/* ======================================================
   Update Logo Visibility
====================================================== */

export const updateLogoVisibility = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { visible } = req.body;

    settings.logoVisible = Boolean(visible);

    await settings.save();

    // ভিজিবিলিটি চেঞ্জের পরও যেন নেভবার ডাটা পপুলেটেড থাকে
    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Logo visibility updated successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Update Logo Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update logo visibility.",
    });
  }
};