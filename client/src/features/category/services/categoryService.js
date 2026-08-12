import { apiClient } from "../api/apiClient";
import { api } from "../../../config/Config";

export const categoryService = {
  // ==========================
  // Get All Categories
  // ==========================
  async getAllCategories() {
    try {
      const { data } = await apiClient.get(api.category);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ক্যাটাগরি লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Create Category
  // ==========================
  async createCategory(payload) {
    try {
      const { data } = await apiClient.post(api.category, payload);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ক্যাটাগরি তৈরি করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Update Category
  // ==========================
  async updateCategory(id, payload) {
    try {
      const { data } = await apiClient.put(
        `${api.category}/${id}`,
        payload
      );
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ক্যাটাগরি আপডেট করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Delete Category
  // ==========================
  async deleteCategory(id) {
    try {
      await apiClient.delete(`${api.category}/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ক্যাটাগরি ডিলিট করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Get Top Categories (most news first)
  // ==========================
  async getTopCategories(limit = 7) {
    try {
      const categories = await this.getAllCategories();
      return [...categories]
        .sort((a, b) => (b.newsCount ?? 0) - (a.newsCount ?? 0)) // 🔻 field name backend onujayi check kore niyo
        .slice(0, limit);
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "জনপ্রিয় ক্যাটাগরি লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },
};
