import SiteSetting from "../models/SiteSetting.js";
import cloudinary from "../config/cloudinary.js"; // path প্রজেক্ট অনুযায়ী ঠিক করে নিও
import streamifier from "streamifier";
// ======================================================
// Helpers
// ======================================================

const getOrCreateSettings = async () => {
  let settings = await SiteSetting.findOne();

  if (!settings) {
    settings = await SiteSetting.create({});
  }

  return settings;
};

const buildSettingsResponse = (settings) => ({
  logo: settings.logo || "", // এখন এটা সরাসরি Cloudinary secure_url, তাই আর prefix বসাতে হচ্ছে না
  logoVisible: settings.logoVisible,
});

// Cloudinary থেকে safely ডিলিট — public_id না থাকলে বা destroy fail করলেও
// পুরো রিকোয়েস্ট crash না করে শুধু লগ করে এগিয়ে যায়
const destroyCloudinaryAsset = async (publicId) => {
  if (!publicId) return;

  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
  }
};

const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "site-settings/logo",
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// ======================================================
// Get Site Settings
// ======================================================

export const getSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    return res.status(200).json({
      success: true,
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Get Site Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Update General Site Settings
// ======================================================

export const updateSiteSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { logoVisible } = req.body;

    if (logoVisible !== undefined) {
      settings.logoVisible = Boolean(logoVisible);
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Site settings updated successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Update Site Settings Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Upload / Change Logo
// ======================================================

export const uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a logo.",
      });
    }

    const settings = await getOrCreateSettings();

   
    await destroyCloudinaryAsset(settings.logoPublicId);

  
   const result = await uploadToCloudinary(req.file.buffer);

      settings.logo = result.secure_url;
      settings.logoPublicId = result.public_id;

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Logo uploaded successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Upload Logo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Delete Logo
// ======================================================

export const deleteLogo = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    if (!settings.logo) {
      return res.status(400).json({
        success: false,
        message: "No logo found.",
      });
    }

    await destroyCloudinaryAsset(settings.logoPublicId);

    settings.logo = "";
    settings.logoPublicId = "";

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Logo deleted successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Delete Logo Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Show / Hide Logo
// ======================================================

export const updateLogoVisibility = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const { visible } = req.body;

    settings.logoVisible = Boolean(visible);

    await settings.save();

    return res.status(200).json({
      success: true,
      message: "Logo visibility updated successfully.",
      settings: buildSettingsResponse(settings),
    });
  } catch (error) {
    console.error("Update Logo Visibility Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
