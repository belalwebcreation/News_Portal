import mongoose from "mongoose";

const { Schema } = mongoose;

const slugPattern = /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 120,
      match: slugPattern,
      unique: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: 500,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    position: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);