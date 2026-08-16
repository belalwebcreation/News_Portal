import mongoose from "mongoose";
import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import ReadingHistory from "../models/ReadingHistory.js";
import News from "../models/News.js"; // NEW — bookmarksCount sync ও existence check এর জন্য

/* ======================================================
   PROFILE
====================================================== */

const findProfileById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) return null;

  return {
    ...user,
    joinedAt: user.createdAt,
  };
};

const updateProfile = async (userId, updateData) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

const findUserWithPassword = async (userId) => {
  return User.findById(userId).select("+password");
};

const updatePassword = async (user) => {
  return user.save();
};

/* ======================================================
   AVATAR
====================================================== */

const updateAvatar = async (userId, avatar) => {
  return User.findByIdAndUpdate(
    userId,
    {
      avatar,
    },
    {
      new: true,
    }
  );
};

const updateAvatarPosition = async (
  userId,
  position
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "avatar.position": position,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/* ======================================================
   COVER PHOTO
====================================================== */

const updateCoverPhoto = async (
  userId,
  coverPhoto
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      coverPhoto,
    },
    {
      new: true,
    }
  );
};

const updateCoverPosition = async (
  userId,
  position
) => {
  return User.findByIdAndUpdate(
    userId,
    {
      $set: {
        "coverPhoto.position": position,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

/* ======================================================
   PROFILE STATS
====================================================== */

const getProfileStats = async (userId) => {
  const user = await User.findById(userId).lean();

  return {
    joinedAt: user.createdAt,
    role: user.role,
    verified: user.isVerified,
    active: user.isActive,
  };
};

/* ======================================================
   BOOKMARKS
====================================================== */

const getSavedNews = async (
  userId,
  page = 1,
  limit = 10
) => {
  return Bookmark.find({
    user: userId,
  })
    .populate({
      path: "news",
      populate: [
        {
          path: "thumbnail.media",
          select: "url alt width height",
        },
        {
          path: "author",
          select: "name avatar profileImage",
        },
        {
          path: "category",
          select: "name slug",
        },
      ],
    })
    .sort({
      createdAt: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

const countSavedNews = async (
  userId
) => {
  return Bookmark.countDocuments({
    user: userId,
  });
};

// NEW — নির্দিষ্ট নিউজটা এই user বুকমার্ক করেছে কিনা
const isNewsBookmarked = async (
  userId,
  newsId
) => {
  const exists = await Bookmark.exists({
    user: userId,
    news: newsId,
  });

  return Boolean(exists);
};

// NEW — toggle করার আগে newsId আসলে valid কিনা যাচাই (dangling bookmark ঠেকাতে)
const newsExists = async (newsId) => {
  if (!mongoose.Types.ObjectId.isValid(newsId)) {
    return false;
  }

  const exists = await News.exists({
    _id: newsId,
  });

  return Boolean(exists);
};

// NEW — News ডকুমেন্টের নিজস্ব bookmarksCount ফেরত দেয়
const getNewsBookmarksCount = async (newsId) => {
  const news = await News.findById(newsId)
    .select("bookmarksCount")
    .lean();

  return news?.bookmarksCount ?? 0;
};

const saveNews = async (
  userId,
  newsId
) => {
  const bookmark = await Bookmark.create({
    user: userId,
    news: newsId,
  });

  // CHANGED — News.bookmarksCount সাথে sync রাখা হলো (Writer Stats/dashboard এটাই পড়ে)
  await News.findByIdAndUpdate(newsId, {
    $inc: { bookmarksCount: 1 },
  });

  return bookmark;
};

const removeSavedNews = async (
  userId,
  newsId
) => {
  const deleted = await Bookmark.findOneAndDelete({
    user: userId,
    news: newsId,
  });

  // CHANGED — শুধু আসলেই ডিলিট হলে decrement করবে
  if (deleted) {
    await News.findByIdAndUpdate(newsId, {
      $inc: { bookmarksCount: -1 },
    });
  }

  return deleted;
};

const recordReadingHistory = async (
  userId,
  newsId,
  progress = 0
) => {
  const history = await ReadingHistory.findOneAndUpdate(
    {
      user: userId,
      news: newsId,
    },
    {
      $set: {
        progress,
        lastReadAt: new Date(),
      },
      $setOnInsert: {
        user: userId,
        news: newsId,
      },
    },
    {
      returnDocument: "after",
      upsert: true,
      runValidators: true,
    }
  );

  const oldHistory = await ReadingHistory.find({
    user: userId,
  })
    .sort({
      lastReadAt: -1,
    })
    .skip(10)
    .select("_id")
    .lean();

  if (oldHistory.length > 0) {
    await ReadingHistory.deleteMany({
      user: userId,
      _id: {
        $in: oldHistory.map((item) => item._id),
      },
    });
  }

  return history;
};

/* ======================================================
   READING HISTORY
====================================================== */

const getReadingHistory = async (
  userId,
  page = 1,
  limit = 10
) => {
  return ReadingHistory.find({
    user: userId,
  })
    .populate({
      path: "news",
      populate: [
        {
          path: "author",
          select: "name avatar",
        },
        {
          path: "category",
          select: "name slug",
        },
      ],
    })
    .sort({
      lastReadAt: -1,
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
};

const countReadingHistory =
  async (userId) => {
    return ReadingHistory.countDocuments({
      user: userId,
    });
  };

const clearReadingHistory =
  async (userId) => {
    return ReadingHistory.deleteMany({
      user: userId,
    });
  };

export default {
  findProfileById,
  updateProfile,
  findUserWithPassword,
  updatePassword,

  updateAvatar,
  updateAvatarPosition,

  updateCoverPhoto,
  updateCoverPosition,

  getProfileStats,

  getSavedNews,
  countSavedNews,
  saveNews,
  removeSavedNews,
  isNewsBookmarked,      // NEW
  newsExists,             // NEW
  getNewsBookmarksCount,  // NEW

  getReadingHistory,
  recordReadingHistory,
  countReadingHistory,
  clearReadingHistory,
};