import mongoose from "mongoose";

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

    visible: {
      type: Boolean,
      default: true,
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  {
    _id: true,
  }
);

const topHeadlineSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      default: "সর্বশেষ",
      trim: true,
    },

    showDate: {
      type: Boolean,
      default: true,
    },

    date: {
      type: String,
      default: "",
    },

    visible: {
      type: Boolean,
      default: true,
    },

    speed: {
      type: Number,
      default: 5,
    },

    items: [headlineItemSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "TopHeadline",
  topHeadlineSchema
);