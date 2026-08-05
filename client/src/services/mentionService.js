import axiosInstance from "../utils/axiosInstance";
import { api } from "../config/Config";

export const searchMentionUsers = async (query) => {
  const response = await axiosInstance.get(api.mentions, {
    params: {
      q: query,
      limit: 8,
    },
  });

  return response.data.data;
};