import apiClient from "../../../dashboard/pages/WriterSectionManagement/api/apiClient";
import { api } from "../../../config/Config";

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export const notificationService = {
  async getNotifications(params = {}) {
    try {
      const { data } = await apiClient.get(api.notifications, { params });
      return data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "নোটিফিকেশন লোড করা যায়নি।"),
        { cause: error }
      );
    }
  },

  async markAsRead(id) {
    try {
      const { data } = await apiClient.patch(
        `${api.notifications}/${id}/read`
      );
      return data.data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "নোটিফিকেশন আপডেট করা যায়নি।"),
        { cause: error }
      );
    }
  },

  async markAllAsRead() {
    try {
      const { data } = await apiClient.patch(
        `${api.notifications}/mark-all-read`
      );
      return data;
    } catch (error) {
      throw new Error(
        getErrorMessage(error, "নোটিফিকেশন আপডেট করা যায়নি।"),
        { cause: error }
      );
    }
  },
};

export default notificationService;