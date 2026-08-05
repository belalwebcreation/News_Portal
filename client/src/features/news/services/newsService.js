import apiClient from "../../../dashboard/pages/WriterSectionManagement/api/apiClient";
import { api } from "../../../config/Config";

export const newsService = {
  // ==========================
  // Get All News
  // ==========================
  async getAllNews(params = {}) {
    try {
      const { data } = await apiClient.get(api.news, {
        params,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Get Single News
  // ==========================
  async getSingleNews(identifier) {
    try {
      const { data } = await apiClient.get(
        `${api.news}/${identifier}`
      );

      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Get Trending News (NEW)
  // ==========================
  async getTrendingNews(params = {}) {
    try {
      const { data } = await apiClient.get(`${api.news}/trending`, {
        params,
      });

      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ট্রেন্ডিং নিউজ লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Increment View Count (NEW - Anti-Spam)
  // ==========================
  async incrementView(id) {
    try {
      const { data } = await apiClient.post(`${api.news}/${id}/view`);
      return data;
    } catch (error) {
      // ভিউ কাউন্ট ফেল করলেও যেন পুরো পেজ ক্র্যাশ না করে
      console.error("View increment error:", error.response?.data?.message || error.message);
      return null;
    }
  },

  // ==========================
  // Create News
  // ==========================
  async createNews(payload) {
    try {
      const { data } = await apiClient.post(api.news, payload);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ তৈরি করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Update News
  // ==========================
  async updateNews(id, payload) {
    try {
      const { data } = await apiClient.put(
        `${api.news}/${id}`,
        payload
      );

      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ আপডেট করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Delete News
  // ==========================
  async deleteNews(id) {
    try {
      await apiClient.delete(`${api.news}/${id}`);
      return true;
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ ডিলিট করা যায়নি।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Get Home NewsSection Layout (NEW - views-ranked left/center/right)
  // ==========================
  async getNewsSectionLayout() {
    try {
      const { data } = await apiClient.get(`${api.news}/section-layout`);
      return data.data; // { left, center, right }
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "নিউজ সেকশন লোড করতে সমস্যা হয়েছে।",
        { cause: error }
      );
    }
  },

  // ==========================
  // Upload News Image
  // ==========================
  async uploadImage(formData) {
    try {
      const { data } = await apiClient.post(
        `${api.news}/image`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return {
        mediaId: data.mediaId,
        url: data.url,
        secureUrl: data.secureUrl,
        cloudinaryPublicId: data.cloudinaryPublicId,
      };
    } catch (error) {
      throw new Error(
        error.response?.data?.message ||
          "ছবি আপলোড করা যায়নি।",
        { cause: error }
      );
    }
  },
};