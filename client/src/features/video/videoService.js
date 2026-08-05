import { apiClient } from "../../features/category/api/apiClient";

export const videoService = {
  async getVideoNews({ categorySlug, limit = 20 } = {}) {
    const params = {};
    if (categorySlug && categorySlug !== "all") params.categorySlug = categorySlug;
    if (limit) params.limit = limit;

    const { data } = await apiClient.get("/api/news/videos", { params });
    return data.data; // categoryService.js এর মতোই — data.data রিটার্ন করছি, পুরো wrapper না
  },
};

export default videoService;