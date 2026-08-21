import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    type: {
      type: String,
      enum: ["article_approved", "article_rejected", "new_article", "system"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    // Frontend route যেখানে click করলে নিয়ে যাবে
    // (e.g. /dashboard/writer/add-news/editor?id=...)
    link: {
      type: String,
      default: "",
    },

    relatedNews: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News",
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Header dropdown-এর সবচেয়ে বেশি ব্যবহৃত query pattern:
// "recipient-এর সব notification, নতুন আগে" + unread count
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;