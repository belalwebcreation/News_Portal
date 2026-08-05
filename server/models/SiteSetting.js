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