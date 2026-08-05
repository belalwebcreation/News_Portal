import mongoose from "mongoose";

// ======================================================
// Single Headline Schema
// ======================================================

const headlineItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      trim: true,
    },

    // Cloudinary Image URL
    image: {
      type: String,
      default: "",
      trim: true,
    },

    // Cloudinary Public ID
    imagePublicId: {
      type: String,
      default: "",
      trim: true,
    },

    // Show / Hide
    visible: {
      type: Boolean,
      default: true,
    },

    // Display Order
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

// ======================================================
// Top Headline Schema
// ======================================================

const topHeadlineSchema = new mongoose.Schema(
  {
    // Left Side Label
    label: {
      type: String,
      default: "Top Headlines",
      trim: true,
    },

    // Optional Date
    date: {
      type: String,
      default: "",
      trim: true,
    },

    // Marquee Speed
    speed: {
      type: Number,
      default: 40,
      min: 10,
      max: 200,
    },

    // Headlines
    items: {
      type: [headlineItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TopHeadline", topHeadlineSchema);