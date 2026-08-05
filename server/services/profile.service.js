import profileRepository from "../repositories/profile.repository.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

/* ======================================================
   GET PROFILE
====================================================== */

const getProfile = async (userId) => {
  const profile = await profileRepository.findProfileById(userId);

  if (!profile) {
    throw new Error("Profile not found.");
  }

  return profile;
};

/* ======================================================
   UPDATE PROFILE
====================================================== */

const updateProfile = async (userId, profileData) => {
  const updatedProfile = await profileRepository.updateProfile(
    userId,
    profileData
  );

  if (!updatedProfile) {
    throw new Error("Failed to update profile.");
  }

  return updatedProfile;
};

/* ======================================================
   UPDATE AVATAR
====================================================== */

const updateAvatar = async (userId, file) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  const uploadedImage = await uploadToCloudinary(
    file.buffer,
    "news-portal/avatar"
  );

  return profileRepository.updateAvatar(userId, {
    public_id: uploadedImage.public_id,
    url: uploadedImage.secure_url,
  });
};

/* ======================================================
   REMOVE AVATAR
   — নতুন যোগ করা হলো। আলাদা কোনো repository method লাগেনি — updateAvatar
   যে profileRepository.updateAvatar(userId, {public_id, url}) কল করছে,
   ঠিক সেটাই খালি string দিয়ে কল করলে avatar রিসেট হয়ে যায়।
====================================================== */

const removeAvatar = async (userId) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.avatar?.public_id) {
    await deleteFromCloudinary(user.avatar.public_id);
  }

  return profileRepository.updateAvatar(userId, {
    public_id: "",
    url: "",
  });
};

const updateAvatarPosition = async (userId, position) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.avatar?.url) {
    throw new Error("No avatar to reposition.");
  }

  return profileRepository.updateAvatarPosition(userId, position);
};


/* ======================================================
   UPDATE COVER PHOTO
====================================================== */

const updateCoverPhoto = async (userId, file) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.coverPhoto?.public_id) {
    await deleteFromCloudinary(user.coverPhoto.public_id);
  }

  const uploadedImage = await uploadToCloudinary(
    file.buffer,
    "news-portal/cover"
  );

  return profileRepository.updateCoverPhoto(userId, {
    public_id: uploadedImage.public_id,
    url: uploadedImage.secure_url,
  });
};

/* ======================================================
   REMOVE COVER PHOTO
   — removeAvatar-এর মতোই, existing updateCoverPhoto repository method
   পুনর্ব্যবহার করা হলো।
====================================================== */

const removeCoverPhoto = async (userId) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (user.coverPhoto?.public_id) {
    await deleteFromCloudinary(user.coverPhoto.public_id);
  }

  return profileRepository.updateCoverPhoto(userId, {
    public_id: "",
    url: "",
  });
};

/* ======================================================
   UPDATE COVER POSITION
====================================================== */

const updateCoverPosition = async (userId, position) => {
  const user = await profileRepository.findProfileById(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  if (!user.coverPhoto?.url) {
    throw new Error("No cover photo to reposition.");
  }

  return profileRepository.updateCoverPosition(userId, position);
};

/* ======================================================
   CHANGE PASSWORD
====================================================== */

const changePassword = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user =
    await profileRepository.findUserWithPassword(userId);

  if (!user) {
    throw new Error("User not found.");
  }

  const isMatched = await user.matchPassword(currentPassword);

  if (!isMatched) {
    throw new Error("Current password is incorrect.");
  }

  user.password = newPassword;

  await profileRepository.updatePassword(user);

  return true;
};

/* ======================================================
   PROFILE STATS
====================================================== */

const getProfileStats = async (userId) => {
  return profileRepository.getProfileStats(userId);
};

/* ======================================================
   SAVED NEWS
====================================================== */

const getSavedNews = async (
  userId,
  page = 1,
  limit = 10
) => {
  const news =
    await profileRepository.getSavedNews(
      userId,
      page,
      limit
    );

  const total =
    await profileRepository.countSavedNews(userId);

  return {
    data: news,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   READING HISTORY
====================================================== */

const getReadingHistory = async (
  userId,
  page = 1,
  limit = 10
) => {
  const history =
    await profileRepository.getReadingHistory(
      userId,
      page,
      limit
    );

  const total =
    await profileRepository.countReadingHistory(
      userId
    );

  return {
    data: history,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

/* ======================================================
   CLEAR READING HISTORY
====================================================== */

const clearReadingHistory = async (
  userId
) => {
  await profileRepository.clearReadingHistory(
    userId
  );

  return true;
};

export default {
  getProfile,
  updateProfile,
  updateAvatar,
  removeAvatar,
  updateAvatarPosition,   // 👈 নতুন
  updateCoverPhoto,
  removeCoverPhoto,
  updateCoverPosition,    // 👈 নতুন
  changePassword,
  getProfileStats,
  getSavedNews,
  getReadingHistory,
  clearReadingHistory,
};
