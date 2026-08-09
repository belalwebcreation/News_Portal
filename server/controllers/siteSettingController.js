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
      heroBannerImage: "",
      heroBannerPublicId: "",
      heroBannerLink: "",
      heroBannerVisible: true,
    });
  }

  return settings;
};

const buildSettingsResponse = (settings) => ({
  logo: settings.logo || "",
  logoVisible: settings.logoVisible,
  heroBannerImage: settings.heroBannerImage || "",
  heroBannerLink: settings.heroBannerLink || "",
  heroBannerVisible: settings.heroBannerVisible,
  navbar: [...(settings.navbar || [])].sort(
    (a, b) => a.order - b.order
  ),

  // Footer - Brand Info
  siteName: settings.siteName || "",
  tagline: settings.tagline || "",
  aboutText: settings.aboutText || "",
  footerVisible: settings.footerVisible,

  // Footer - Social Links
  socialFacebook: settings.socialFacebook || "",
  socialX: settings.socialX || "",
  socialYoutube: settings.socialYoutube || "",
  socialInstagram: settings.socialInstagram || "",
  socialLinksVisible: settings.socialLinksVisible,

  // Footer - Contact Info
  contactAddress: settings.contactAddress || "",
  contactPhone: settings.contactPhone || "",
  contactEmail: settings.contactEmail || "",
  contactVisible: settings.contactVisible,
});

/* ======================================================
   Get Site Settings
====================================================== */

export const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

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

    const {
      logoVisible,
      heroBannerVisible,
      heroBannerLink,

      siteName,
      tagline,
      aboutText,
      footerVisible,

      socialFacebook,
      socialX,
      socialYoutube,
      socialInstagram,
      socialLinksVisible,

      contactAddress,
      contactPhone,
      contactEmail,
      contactVisible,
    } = req.body;

    if (logoVisible !== undefined) {
      settings.logoVisible = Boolean(logoVisible);
    }

    if (heroBannerVisible !== undefined) {
      settings.heroBannerVisible = Boolean(heroBannerVisible);
    }

    if (heroBannerLink !== undefined) {
      settings.heroBannerLink = String(heroBannerLink).trim();
    }

    // ---- Footer: Brand Info ----
    if (siteName !== undefined) {
      settings.siteName = String(siteName).trim();
    }

    if (tagline !== undefined) {
      settings.tagline = String(tagline).trim();
    }

    if (aboutText !== undefined) {
      settings.aboutText = String(aboutText).trim();
    }

    if (footerVisible !== undefined) {
      settings.footerVisible = Boolean(footerVisible);
    }

    // ---- Footer: Social Links ----
    if (socialFacebook !== undefined) {
      settings.socialFacebook = String(socialFacebook).trim();
    }

    if (socialX !== undefined) {
      settings.socialX = String(socialX).trim();
    }

    if (socialYoutube !== undefined) {
      settings.socialYoutube = String(socialYoutube).trim();
    }

    if (socialInstagram !== undefined) {
      settings.socialInstagram = String(socialInstagram).trim();
    }

    if (socialLinksVisible !== undefined) {
      settings.socialLinksVisible = Boolean(socialLinksVisible);
    }

    // ---- Footer: Contact Info ----
    if (contactAddress !== undefined) {
      settings.contactAddress = String(contactAddress).trim();
    }

    if (contactPhone !== undefined) {
      settings.contactPhone = String(contactPhone).trim();
    }

    if (contactEmail !== undefined) {
      settings.contactEmail = String(contactEmail).trim();
    }

    if (contactVisible !== undefined) {
      settings.contactVisible = Boolean(contactVisible);
    }

    await settings.save();

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

    if (settings.logoPublicId) {
      await deleteFromCloudinary(settings.logoPublicId);
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "site-settings/logo"
    );

    settings.logo = result.secure_url;
    settings.logoPublicId = result.public_id;

    await settings.save();

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

/* ======================================================
   Upload / Change Hero Banner
====================================================== */
export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a banner image.",
      });
    }

    const settings = await getOrCreateSettings();

    if (settings.heroBannerPublicId) {
      await deleteFromCloudinary(settings.heroBannerPublicId);
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "site-settings/banner"
    );

    settings.heroBannerImage = result.secure_url;
    settings.heroBannerPublicId = result.public_id;

    await settings.save();

    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Banner uploaded successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Upload Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to upload banner.",
    });
  }
};

/* ======================================================
   Delete Hero Banner
====================================================== */

export const deleteBanner = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (!settings.heroBannerImage) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    if (settings.heroBannerPublicId) {
      await deleteFromCloudinary(settings.heroBannerPublicId);
    }

    settings.heroBannerImage = "";
    settings.heroBannerPublicId = "";

    await settings.save();

    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Delete Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete banner.",
    });
  }
};

/* ======================================================
   Update Hero Banner Visibility
====================================================== */

export const updateBannerVisibility = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { visible } = req.body;

    settings.heroBannerVisible = Boolean(visible);

    await settings.save();

    await settings.populate({
      path: "navbar.category",
      select: "name slug",
    });

    return res.status(200).json({
      success: true,
      message: "Banner visibility updated successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Update Banner Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Failed to update banner visibility.",
    });
  }
};