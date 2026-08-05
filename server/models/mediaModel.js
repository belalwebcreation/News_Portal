import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "document", "audio"],
      default: "image",
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number, // in bytes
      required: true,
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
    url: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true, // Cloudinary থেকে ডিলিট করার জন্য অপরিহার্য
    },
    storageProvider: {
      type: String,
      default: "cloudinary",
    },
    alt: {
      type: String,
      default: "",
      trim: true,
    },
    caption: {
      type: String,
      default: "",
      trim: true,
    },
    credit: {
      type: String,
      default: "",
      trim: true,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    referencedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// High-performance Indexes
mediaSchema.index({ cloudinaryPublicId: 1 });
mediaSchema.index({ uploadedBy: 1 });

const Media = mongoose.model("Media", mediaSchema);

export default Media;