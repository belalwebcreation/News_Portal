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

const removeAvatar = async () => {
  const { data } = await api.delete(
    "/profile/avatar"
  );

  return data.data;
};

const updateAvatarPosition = async (position) => {
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

const removeCoverPhoto = async () => {
  const { data } = await api.delete(
    "/profile/cover-photo"
  );

  return data.data;
};

const updateCoverPosition = async (position) => {
  const { data } = await api.patch(
    "/profile/cover-photo/position",
    position
  );

  return data.data;
};

// ===============================
// Password
// ===============================

const changePassword = async (passwordData) => {
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
// Bookmarks (toggle / status / count)
// ===============================

const getSavedNewsCount = async () => {
  const { data } = await api.get("/profile/saved-news/count");
  return data.data; // { total }
};

const getBookmarkStatus = async (newsId) => {
  const { data } = await api.get(`/profile/saved-news/${newsId}/status`);
  return data.data; // { bookmarked }
};

const toggleBookmark = async (newsId) => {
  const { data } = await api.post(`/profile/saved-news/${newsId}/toggle`);
  return data.data; // { bookmarked, bookmarksCount }
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

// ===============================
// Record Reading History
// ===============================

const recordReadingHistory = async (
  newsId,
  progress = 0
) => {
  const { data } = await api.post(
    "/profile/reading-history",
    {
      newsId,
      progress,
    }
  );

  return data.data;
};

// ===============================
// Clear Reading History
// ===============================

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
  getSavedNewsCount,
  getBookmarkStatus,
  toggleBookmark,

  getReadingHistory,
  recordReadingHistory,
  clearReadingHistory,
};

export default profileService;