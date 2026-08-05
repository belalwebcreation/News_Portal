import apiClient from "../dashboard/pages/WriterSectionManagement/api/apiClient"; // path মিলিয়ে নিন
import { api } from "../config/Config"; // path মিলিয়ে নিন

export const publicProfileService = {
  async getByUsername(username) {
    try {
      const { data } = await apiClient.get(`${api.publicProfile}/${username}`);
      return data.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "প্রোফাইল লোড করা যায়নি।",
        { cause: error }
      );
    }
  },
};