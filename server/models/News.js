import mongoose from "mongoose";
import { getReadingTime } from "../utils/readingTime.js";

// Clean & Normalized Thumbnail Sub-schema (Only Media Reference)
const thumbnailSchema = new mongoose.Schema(
  {
    media: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Media",
      default: null,
    },
  },
  {
    _id: false,
  }
);

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    summary: {
      type: String,
      default: "",
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    thumbnail: {
      type: thumbnailSchema,
      default: () => ({}),
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},

reviewNote: {
  // Reject korার somoy admin/superadmin কেন reject korলো সেটা লিখতে পারবে
  type: String,
  default: "",
  trim: true,
},

    status: {
      type: String,
      enum: ["draft", "review", "published"],   // ✅ "review" added
      default: "draft",
    },

    views: {
      type: Number,
      default: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
    },

    bookmarksCount: {
      type: Number,
      default: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW: Video Gallery-তে দেখানোর checkbox flag। শুধু flag true দিলেই হবে না —
    // videoMeta.videoId থাকা লাগবে, নাহলে controller লেভেলে false হয়ে যাবে।
    showInVideoSection: {
      type: Boolean,
      default: false,
    },

    // ✅ NEW: body-র প্রথম YouTube embed থেকে auto-extract করা মেটাডেটা।
    // প্রতিবার video section fetch করার সময় HTML re-parse করতে হয় না।
    videoMeta: {
      videoId: { type: String, default: null },
      embedUrl: { type: String, default: null },
      thumbnail: { type: String, default: null },
    },

    publishedAt: {
      type: Date,
      default: null,
    },

    wordCount: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



newsSchema.pre("save", function () {
  if (this.isModified("content")) {
    const { words, minutes } = getReadingTime(this.content);
    this.wordCount = words;
    this.readingTime = minutes;
  }

  if (
    this.isModified("status") &&
    this.status === "published" &&
    !this.publishedAt
  ) {
    this.publishedAt = new Date();
  }
});

newsSchema.index({ category: 1 });
newsSchema.index({ status: 1 });
newsSchema.index({ author: 1 });
newsSchema.index({ createdAt: -1 });
newsSchema.index({ publishedAt: -1 });
newsSchema.index({ isFeatured: 1 });
newsSchema.index({ showInVideoSection: 1 }); // ✅ NEW

newsSchema.index({ status: 1, createdAt: -1 });
newsSchema.index({ status: 1, category: 1, createdAt: -1 });
newsSchema.index({ status: 1, views: -1 });

const News = mongoose.models.News || mongoose.model("News", newsSchema);

export default News;