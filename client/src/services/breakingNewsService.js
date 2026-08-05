import axiosInstance from "../utils/axiosInstance"; // path প্রজেক্ট অনুযায়ী ঠিক করে নিও

// GET /api/breaking-news  ->  { success, breakingNews: { label, date, speed, items: [...] } }
export const getBreakingNews = async () => {
  const { data } = await axiosInstance.get("/api/breaking-news");
  return data;
};

// PUT /api/breaking-news  ->  saves { label, date, speed, items } together
export const updateBreakingNews = async (payload) => {
  const { data } = await axiosInstance.put("/api/breaking-news", payload);
  return data;
};

// POST /api/breaking-news  ->  adds one new item
export const addBreakingNews = async (item) => {
  const { data } = await axiosInstance.post("/api/breaking-news", item);
  return data;
};

// DELETE /api/breaking-news/:id
export const deleteBreakingNews = async (id) => {
  const { data } = await axiosInstance.delete(`/api/breaking-news/${id}`);
  return data;
};

// PATCH /api/breaking-news/:id/visibility
export const toggleBreakingNewsVisibility = async (id) => {
  const { data } = await axiosInstance.patch(`/api/breaking-news/${id}/visibility`);
  return data;
};
