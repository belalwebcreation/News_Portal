// src/features/users/services/userService.js
import apiClient from "../../dashboard/pages/WriterSectionManagement/api/apiClient";
import { api } from "../../config/Config";

export const userService = {
  async getAllUsers(params = {}) {
    try {
      const { data } = await apiClient.get(api.users, { params });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "ইউজার লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  async getUserProfile(id) {
    try {
      const { data } = await apiClient.get(`${api.users}/${id}`);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "ইউজারের তথ্য লোড করা যায়নি।",
        { cause: error }
      );
    }
  },

  async deleteUser(id) {
    try {
      await apiClient.delete(`${api.users}/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "ইউজার ডিলিট করা যায়নি।",
        { cause: error }
      );
    }
  },

  async promoteUser(id) {
    try {
      const { data } = await apiClient.patch(`${api.users}/${id}/promote`);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "প্রমোট করা যায়নি।",
        { cause: error }
      );
    }
  },

  async demoteUser(id) {
    try {
      const { data } = await apiClient.patch(`${api.users}/${id}/demote`);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "ডিমোট করা যায়নি।",
        { cause: error }
      );
    }
  },

  async getTopWriters(limit = 5) {
  try {
    const { data } = await apiClient.get(`${api.users}/top-writers`, {
      params: { limit },
    });
    return data.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Top writers লোড করা যায়নি।",
      { cause: error }
    );
  }
},

};