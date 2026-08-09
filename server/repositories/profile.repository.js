import User from "../models/User.js";
import Bookmark from "../models/Bookmark.js";
import ReadingHistory from "../models/ReadingHistory.js";

/* ======================================================
   PROFILE
====================================================== */

const findProfileById = async (userId) => {
  const user = await User.findById(userId).lean();

  if (!user) return null;

  // Mongoose timestamps দেয় createdAt, কিন্তু frontend joinedAt আশা করে।
  // এখানে map করে দেওয়া হলো যাতে User.js schema বা frontend কোনোটাই
  // পরিবর্তন করতে না হয়। getProfileStats নিচে একই কাজ আলাদাভাবে করে।
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

const saveNews = async (
  userId,
  newsId
) => {
  return Bookmark.create({
    user: userId,
    news: newsId,
  });
};

const removeSavedNews = async (
  userId,
  newsId
) => {
  return Bookmark.findOneAndDelete({
    user: userId,
    news: newsId,
  });
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

  getReadingHistory,
  countReadingHistory,
  clearReadingHistory,
};