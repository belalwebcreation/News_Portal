import api from "./api";

// ===============================
// Profile
// ===============================

const getProfile = async () => {
  const { data } = await api.get("/profile");
  return data.data;
};

const updateProfile = async (profileData) => {
  const { data } = await api.put(
    "/profile",
    profileData
  );

  return data.data;
};

// ===============================
// Avatar
// ===============================

const uploadAvatar = async (file) => {
  const formData = new FormData();

  formData.append("avatar", file);

  const { data } = await api.patch(
    "/profile/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.data;
};

// ⚠️ Backend DELETE route লাগবে
const removeAvatar = async () => {
  const { data } = await api.delete(
    "/profile/avatar"
  );

  return data.data;
};

// ⚠️ Backend PATCH route লাগবে (শুধু crop position আপডেট করবে, ফাইল পাঠাবে না)
const updateAvatarPosition = async (position) => {
  // position = { x: number, y: number } — দুটোই 0-100 এর মধ্যে percentage
  const { data } = await api.patch(
    "/profile/avatar/position",
    position
  );

  return data.data;
};

// ===============================
// Cover Photo
// ===============================

const uploadCoverPhoto = async (file) => {
  const formData = new FormData();

  formData.append("coverPhoto", file);

  const { data } = await api.patch(
    "/profile/cover-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data.data;
};

// ⚠️ Backend DELETE route লাগবে
const removeCoverPhoto = async () => {
  const { data } = await api.delete(
    "/profile/cover-photo"
  );

  return data.data;
};

// ⚠️ Backend PATCH route লাগবে (শুধু crop position আপডেট করবে, ফাইল পাঠাবে না)
const updateCoverPosition = async (position) => {
  // position = { x: number, y: number } — দুটোই 0-100 এর মধ্যে percentage
  const { data } = await api.patch(
    "/profile/cover-photo/position",
    position
  );

  return data.data;
};

// ===============================
// Password
// ===============================

const changePassword = async (
  passwordData
) => {
  const { data } = await api.patch(
    "/profile/change-password",
    passwordData
  );

  return data.data;
};

// ===============================
// Profile Stats
// ===============================

const getProfileStats = async () => {
  const { data } = await api.get(
    "/profile/stats"
  );

  return data.data;
};

// ===============================
// Saved News
// ===============================

const getSavedNews = async (
  page = 1,
  limit = 10
) => {
  const { data } = await api.get(
    "/profile/saved-news",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return data.data;
};

// ===============================
// Reading History
// ===============================

const getReadingHistory = async (
  page = 1,
  limit = 10
) => {
  const { data } = await api.get(
    "/profile/reading-history",
    {
      params: {
        page,
        limit,
      },
    }
  );

  return data.data;
};

const clearReadingHistory = async () => {
  const { data } = await api.delete(
    "/profile/reading-history"
  );

  return data.data;
};

// ===============================
// Export
// ===============================

const profileService = {
  getProfile,

  updateProfile,

  uploadAvatar,
  removeAvatar,
  updateAvatarPosition,

  uploadCoverPhoto,
  removeCoverPhoto,
  updateCoverPosition,

  changePassword,

  getProfileStats,

  getSavedNews,

  getReadingHistory,
  clearReadingHistory,
};

export default profileService;