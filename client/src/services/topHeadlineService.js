import axios from "axios";
import { baseUrl } from "../config/Config";

// ======================================================
// Axios Instance
// ======================================================

const api = axios.create({
  baseURL: `${baseUrl}/api/top-headline`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ======================================================
// Get Top Headline
// ======================================================

export const getTopHeadline = async () => {
  const { data } = await api.get("/");

  return data;
};

// ======================================================
// Update Top Headline
// ======================================================

export const updateTopHeadline = async (headlineData) => {
  const { data } = await api.put("/", headlineData);

  return data;
};

// ======================================================
// Add New Headline
// ======================================================

export const addHeadline = async (headline) => {
  const { data } = await api.post("/", headline);

  return data;
};

// ======================================================
// Delete Headline
// ======================================================

export const deleteHeadline = async (id) => {
  const { data } = await api.delete(`/${id}`);

  return data;
};

// ======================================================
// Toggle Visibility
// ======================================================

export const toggleHeadlineVisibility = async (id) => {
  const { data } = await api.patch(`/${id}/toggle`);

  return data;
};

// ======================================================
// Upload Headline Image (Cloudinary)
// ======================================================

export const uploadHeadlineImage = async (id, file) => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.put(
    `/${id}/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

// ======================================================
// Delete Headline Image (Cloudinary)
// ======================================================

export const deleteHeadlineImage = async (id) => {
  const { data } = await api.delete(
    `/${id}/image`
  );

  return data;
};