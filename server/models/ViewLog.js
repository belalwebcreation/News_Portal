import mongoose from "mongoose";

const viewLogSchema = new mongoose.Schema({
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "News",
    required: true,
    index: true,
  },
  visitorHash: {
    type: String,
    required: true,
  },
  device: {
    type: String,
    enum: ["desktop", "mobile", "tablet"],
    default: "desktop",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "24h", // TTL Index: অটোমেটিক ২৪ ঘণ্টা পর ডিলিট হবে
  },
});

// Compound Indexes for Ultra-Fast Lookup & Analytics
viewLogSchema.index({ articleId: 1, visitorHash: 1 });
viewLogSchema.index({ articleId: 1, createdAt: -1 });

export default mongoose.model("ViewLog", viewLogSchema);