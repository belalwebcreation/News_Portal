import { useCallback, useEffect, useState } from "react";
import profileService from "../services/profileService";
import { useAuth } from "../context/AuthContext"; // adjust this path if your context folder is elsewhere

const useProfile = () => {
  const { updateUser } = useAuth();

  // ======================================
  // PROFILE DATA
  // ======================================

  const [profile, setProfile] = useState(null);

  const [stats, setStats] = useState(null);

  const [savedNews, setSavedNews] = useState([]);

  const [readingHistory, setReadingHistory] = useState([]);

  // ======================================
  // UI STATE
  // ======================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ======================================
  // LOAD ALL PROFILE DATA
  // ======================================

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);

      setError(null);

      const [
        profileData,
        statsData,
        savedNewsData,
        readingHistoryData,
      ] = await Promise.all([
        profileService.getProfile(),

        profileService.getProfileStats(),

        profileService.getSavedNews(),

        profileService.getReadingHistory(),
      ]);

      // Database থেকে logged-in user's profile
      setProfile(profileData);

      // Profile statistics
      setStats(statsData);

      // Saved news
      setSavedNews(savedNewsData || []);

      // Reading history
      setReadingHistory(readingHistoryData || []);

      // Keep AuthContext (navbar/ProfileMenu) in sync. Login response only
      // carries a snapshot of avatar/coverPhoto from the time of login —
      // this is the single source of truth for the *current* image, so
      // every profile load pushes it into userInfo too.

      // loadProfile ফাংশনের ভেতরে, আগের updateUser কলটার জায়গায়:

      
updateUser({
  name: profileData?.name,
  username: profileData?.username,
  avatar: profileData?.avatar,
  coverPhoto: profileData?.coverPhoto,
});

    } catch (err) {
      console.error(
        "Failed to load profile:",
        err
      );

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load profile."
      );

    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  // ======================================
  // LOAD PROFILE ON PAGE LOAD
  // ======================================

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ======================================
  // REFRESH PROFILE
  // ======================================

  const refreshProfile = useCallback(() => {
    return loadProfile();
  }, [loadProfile]);

  // ======================================
  // UPDATE PROFILE
  // ======================================

  const updateProfile = async (formData) => {
    try {
      const data =
        await profileService.updateProfile(
          formData
        );

      // UI immediately update
      setProfile(data);

      return data;

    } catch (err) {
      console.error(
        "Failed to update profile:",
        err
      );

      throw err;
    }
  };

  // ======================================
  // UPDATE AVATAR
  // ======================================

  const updateAvatar = async (formData) => {
    try {
      const data =
        await profileService.updateAvatar(
          formData
        );

      // Profile reload করলে নতুন avatar URL পাওয়া যাবে
      // (loadProfile নিজেই updateUser() কল করে navbar sync করে দেয়)
      await loadProfile();

      return data;

    } catch (err) {
      console.error(
        "Failed to update avatar:",
        err
      );

      throw err;
    }
  };

  // ======================================
  // UPDATE COVER PHOTO
  // ======================================

  const updateCoverPhoto = async (
    formData
  ) => {
    try {
      const data =
        await profileService.updateCoverPhoto(
          formData
        );

      await loadProfile();

      return data;

    } catch (err) {
      console.error(
        "Failed to update cover photo:",
        err
      );

      throw err;
    }
  };

  // ======================================
  // CHANGE PASSWORD
  // ======================================

  const changePassword = async (
    passwordData
  ) => {
    return profileService.changePassword(
      passwordData
    );
  };

  // ======================================
  // SAVED NEWS
  // ======================================

  const removeSavedNews = async (
    newsId
  ) => {
    await profileService.removeSavedNews(
      newsId
    );

    setSavedNews((prev) =>
      prev.filter(
        (item) => item._id !== newsId
      )
    );
  };

  const refreshSavedNews = async () => {
    const data =
      await profileService.getSavedNews();

    setSavedNews(data || []);
  };

  // ======================================
  // READING HISTORY
  // ======================================

  const removeReadingHistory = async (
    historyId
  ) => {
    await profileService.removeReadingHistory(
      historyId
    );

    setReadingHistory((prev) =>
      prev.filter(
        (item) => item._id !== historyId
      )
    );
  };

  const clearReadingHistory = async () => {
    await profileService.clearReadingHistory();

    setReadingHistory([]);
  };

  const refreshReadingHistory = async () => {
    const data =
      await profileService.getReadingHistory();

    setReadingHistory(data || []);
  };

  // ======================================
  // RETURN
  // ======================================

  return {
    // Profile Data
    profile,

    stats,

    savedNews,

    readingHistory,

    // Loading & Error
    loading,

    error,

    // Refresh
    refreshProfile,

    refreshSavedNews,

    refreshReadingHistory,

    // Profile Update
    updateProfile,

    updateAvatar,

    updateCoverPhoto,

    // Password
    changePassword,

    // Saved News
    removeSavedNews,

    // Reading History
    removeReadingHistory,

    clearReadingHistory,
  };
};

export default useProfile;