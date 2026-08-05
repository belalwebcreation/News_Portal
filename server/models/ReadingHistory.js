import mongoose from "mongoose";

const readingHistorySchema =
  new mongoose.Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      news: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "News",
        required: true,
      },

      readTime: {
        type: Number,
        default: 0,
      },

      progress: {
        type: Number,
        default: 100,
        min: 0,
        max: 100,
      },

      lastReadAt: {
        type: Date,
        default: Date.now,
      },
    },
    {
      timestamps: true,
    }
  );

readingHistorySchema.index(
  {
    user: 1,
    news: 1,
  },
  {
    unique: true,
  }
);

const ReadingHistory = mongoose.model(
  "ReadingHistory",
  readingHistorySchema
);

export default ReadingHistory;