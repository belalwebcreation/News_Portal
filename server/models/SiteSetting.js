import mongoose from "mongoose";

const navbarSchema = new mongoose.Schema(
  {
    // Fixed Home Menu
    isHome: {
      type: Boolean,
      default: false,
    },

    // Home এর title (যেমন: প্রচ্ছদ / Home / মূলপাতা)
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: 50,
    },

    // Category Menu
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },

    // Left / Right
    position: {
      type: String,
      enum: ["left", "right"],
      default: "left",
    },

    // Show / Hide
    visible: {
      type: Boolean,
      default: true,
    },

    // Navbar Order
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const siteSettingSchema = new mongoose.Schema(
  {
    // ==========================
    // Logo
    // ==========================
    logo: {
      type: String,
      default: "",
      trim: true,
    },

    logoPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    logoVisible: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Hero Banner
    // ==========================
    heroBannerImage: {
      type: String,
      default: "",
      trim: true,
    },

    heroBannerPublicId: {
      type: String,
      default: "",
      trim: true,
    },

    heroBannerLink: {
      type: String,
      default: "",
      trim: true,
    },

    heroBannerVisible: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Footer - Brand Info
    // ==========================
    siteName: {
      type: String,
      default: "",
      trim: true,
    },

    tagline: {
      type: String,
      default: "",
      trim: true,
    },

    aboutText: {
      type: String,
      default: "",
      trim: true,
    },

    footerVisible: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Footer - Social Links
    // ==========================
    socialFacebook: {
      type: String,
      default: "",
      trim: true,
    },

    socialX: {
      type: String,
      default: "",
      trim: true,
    },

    socialYoutube: {
      type: String,
      default: "",
      trim: true,
    },

    socialInstagram: {
      type: String,
      default: "",
      trim: true,
    },

    socialLinksVisible: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Footer - Contact Info
    // ==========================
    contactAddress: {
      type: String,
      default: "",
      trim: true,
    },

    contactPhone: {
      type: String,
      default: "",
      trim: true,
    },

    contactEmail: {
      type: String,
      default: "",
      trim: true,
    },

    contactVisible: {
      type: Boolean,
      default: true,
    },

    // ==========================
    // Navbar
    // ==========================
    navbar: {
      type: [navbarSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "SiteSetting",
  siteSettingSchema
);