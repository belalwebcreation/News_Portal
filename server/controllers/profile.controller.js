import profileService from "../services/profile.service.js";

/* ==========================================
   Helpers
========================================== */

// updateProfile আগে req.body সরাসরি service-এ পাঠাচ্ছিল — কেউ চাইলে body-তে
// role/email/isVerified/permissions ইত্যাদি পাঠিয়ে mass-assignment করতে
// পারতো (service layer guard না করলে সরাসরি চলে যেত)। controller লেয়ারেও
// allow-list দিয়ে filter করে দেওয়া হলো (defense-in-depth)।
const ALLOWED_PROFILE_FIELDS = [
  "name",
  "phone",
  "address",
  "bio",
  "website",
  "occupation",
  "college",
  "socialLinks",
];

const pickAllowedFields = (body = {}, allowed = []) =>
  allowed.reduce((acc, field) => {
    if (body[field] !== undefined) acc[field] = body[field];
    return acc;
  }, {});

// page=0/negative হলেও আগে pass হয়ে যেত (Number(0) || 1 -> 1 ঠিক আছে,
// কিন্তু Number(-5) || 1 -> -5, কারণ -5 truthy)। limit-ও unbounded ছিল,
// কেউ ?limit=99999 দিয়ে পুরো collection টেনে নিতে পারতো। দুটোই clamp
// করে দেওয়া হলো।
const MAX_PAGE_LIMIT = 50;

const parsePagination = (query = {}) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(
    MAX_PAGE_LIMIT,
    Math.max(1, Number(query.limit) || 10)
  );
  return { page, limit };
};

// x/y ছাড়া বা range এর বাইরের মান (negative, >100) গেলে DB পর্যন্ত পৌঁছানোর
// আগেই আটকানো হলো।
const isValidPosition = (position) =>
  position &&
  typeof position.x === "number" &&
  typeof position.y === "number" &&
  position.x >= 0 &&
  position.x <= 100 &&
  position.y >= 0 &&
  position.y <= 100;

/* ======================================================
   GET PROFILE
====================================================== */

export const getProfile = async (req, res, next) => {
  try {
    const profile = await profileService.getProfile(req.user.id);

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE PROFILE
====================================================== */

export const updateProfile = async (req, res, next) => {
  try {
    const updates = pickAllowedFields(req.body, ALLOWED_PROFILE_FIELDS);

    const updatedProfile = await profileService.updateProfile(
      req.user.id,
      updates
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE AVATAR
====================================================== */

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image is required.",
      });
    }



    const updatedUser = await profileService.updateAvatar(
      req.user.id,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Avatar updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


/* ======================================================
   UPDATE AVATAR POSITION
====================================================== */

export const updateAvatarPosition = async (
  req,
  res,
  next
) => {
  try {
    const { x, y } = req.body;

    const position = { x, y };

    if (!isValidPosition(position)) {
      return res.status(400).json({
        success: false,
        message:
          "Position must include numeric x and y between 0 and 100.",
      });
    }

    const updatedUser =
      await profileService.updateAvatarPosition(
        req.user.id,
        position
      );

    res.status(200).json({
      success: true,
      message: "Avatar position saved.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   REMOVE AVATAR
   — নতুন যোগ করা হলো (frontend থেকে DELETE /avatar কল হয়)।
   profile.service.js-এ removeAvatar(userId) না থাকলে সেটাও যোগ করতে
   হবে — updateAvatar যেভাবে cloudinary-তে upload করে user.avatar সেভ
   করছে, ঠিক সেই প্যাটার্নেই destroy করে avatar ফিল্ড রিসেট করবে।
====================================================== */

export const removeAvatar = async (req, res, next) => {
  try {
    const updatedUser = await profileService.removeAvatar(req.user.id);

    res.status(200).json({
      success: true,
      message: "Avatar removed successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE COVER PHOTO
====================================================== */

export const updateCoverPhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Cover image is required.",
      });
    }

    const updatedUser = await profileService.updateCoverPhoto(
      req.user.id,
      req.file
    );

    res.status(200).json({
      success: true,
      message: "Cover photo updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   UPDATE COVER POSITION
====================================================== */

export const updateCoverPosition = async (
  req,
  res,
  next
) => {
  try {
    const { x, y } = req.body;

    const position = { x, y };

    if (!isValidPosition(position)) {
      return res.status(400).json({
        success: false,
        message:
          "Position must include numeric x and y between 0 and 100.",
      });
    }

    const updatedUser =
      await profileService.updateCoverPosition(
        req.user.id,
        position
      );

    res.status(200).json({
      success: true,
      message: "Cover photo position saved.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   REMOVE COVER PHOTO
   — removeAvatar-এর মতোই নতুন। profile.service.js-এ
   removeCoverPhoto(userId) যোগ করতে হবে।
====================================================== */

export const removeCoverPhoto = async (req, res, next) => {
  try {
    const updatedUser = await profileService.removeCoverPhoto(req.user.id);

    res.status(200).json({
      success: true,
      message: "Cover photo removed successfully.",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   CHANGE PASSWORD
====================================================== */

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // আগে কোনো presence/length check ছাড়াই সরাসরি service-এ চলে যাচ্ছিল।
    // User model-এ password minlength 6 (register/login-এর সাথে sync করা
    // আছে বলে ওখানে কমেন্টে লেখা), এখানেও একই limit ধরে early validation
    // যোগ করা হলো — অহেতুক DB round-trip ছাড়াই বাজে input reject হবে।
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from the current password.",
      });
    }

    await profileService.changePassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   PROFILE STATS
====================================================== */

export const getProfileStats = async (req, res, next) => {
  try {
    const stats = await profileService.getProfileStats(req.user.id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   SAVED NEWS
====================================================== */

export const getSavedNews = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);

    const result = await profileService.getSavedNews(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   BOOKMARK — SAVED NEWS COUNT
====================================================== */

export const getSavedNewsCount = async (req, res, next) => {
  try {
    const total = await profileService.getSavedNewsCount(req.user.id);

    res.status(200).json({
      success: true,
      data: { total },
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   BOOKMARK — STATUS
====================================================== */

export const getBookmarkStatus = async (req, res, next) => {
  try {
    const { newsId } = req.params;

    const result = await profileService.getBookmarkStatus(
      req.user.id,
      newsId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   BOOKMARK — TOGGLE
====================================================== */

export const toggleBookmark = async (req, res, next) => {
  try {
    const { newsId } = req.params;

    const result = await profileService.toggleBookmark(
      req.user.id,
      newsId
    );

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   READING HISTORY
====================================================== */

export const getReadingHistory = async (req, res, next) => {
  try {
    const { page, limit } = parsePagination(req.query);

    const result = await profileService.getReadingHistory(
      req.user.id,
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   RECORD / UPDATE READING PROGRESS
   — নতুন যোগ করা হলো। এতদিন এই রিসোর্সে শুধু GET (দেখানোর জন্য) আর
   DELETE (clear করার জন্য) ছিল — কোনো CREATE/UPDATE route-ই ছিল না।
   ফলে ফ্রন্টএন্ডে ReadingProgress যতই স্ক্রল % হিসাব করুক না কেন,
   সেটা সেভ করার মতো কোনো endpoint-ই এতদিন ছিল না — তাই Continue
   Reading আর Articles Read সবসময় খালি থাকতো, এটাই মূল কারণ।
====================================================== */

export const recordReadingHistory = async (req, res, next) => {
  try {
    const { newsId, progress } = req.body;

    if (!newsId) {
      return res.status(400).json({
        success: false,
        message: "newsId is required.",
      });
    }

    const numericProgress = Number(progress);

    if (
      Number.isNaN(numericProgress) ||
      numericProgress < 0 ||
      numericProgress > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "progress must be a number between 0 and 100.",
      });
    }

    const entry = await profileService.recordReadingHistory(
      req.user.id,
      newsId,
      Math.round(numericProgress)
    );

    res.status(200).json({
      success: true,
      message: "Reading progress saved.",
      data: entry,
    });
  } catch (error) {
    next(error);
  }
};

/* ======================================================
   CLEAR READING HISTORY
====================================================== */

export const clearReadingHistory = async (req, res, next) => {
  try {
    await profileService.clearReadingHistory(req.user.id);

    res.status(200).json({
      success: true,
      message: "Reading history cleared successfully.",
    });
  } catch (error) {
    next(error);
  }
};