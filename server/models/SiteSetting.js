import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema(
  {
    // Website Logo (Cloudinary URL)
    logo: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary Public ID
    logoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    // Logo Show / Hide
    logoVisible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("SiteSetting", siteSettingSchema);