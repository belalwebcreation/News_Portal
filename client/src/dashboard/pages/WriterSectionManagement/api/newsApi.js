// src/modules/WriterSectionManagement/api/newsApi.js

import apiClient from "./apiClient";

/* ==========================================
   News API Service
========================================== */

// Get All News
export const getAllNews = async (params = {}) => {
  const { data } = await apiClient.get("/news", {
    params,
  });

  return data;
};

// Get Single News
export const getNewsById = async (id) => {
  const { data } = await apiClient.get(`/news/${id}`);

  return data;
};

// Get News By Slug
export const getNewsBySlug = async (slug) => {
  const { data } = await apiClient.get(`/news/slug/${slug}`);

  return data;
};

// Get Category News
export const getCategoryNews = async (
  category,
  params = {}
) => {
  const { data } = await apiClient.get(
    `/news/category/${category}`,
    {
      params,
    }
  );

  return data;
};

// Search News
export const searchNews = async (
  keyword,
  params = {}
) => {
  const { data } = await apiClient.get(
    "/news/search",
    {
      params: {
        keyword,
        ...params,
      },
    }
  );

  return data;
};

// Create News
export const createNews = async (
  payload
) => {
  const { data } = await apiClient.post(
    "/news",
    payload
  );

  return data;
};

// Update News
export const updateNews = async (
  id,
  payload
) => {
  const { data } = await apiClient.patch(
    `/news/${id}`,
    payload
  );

  return data;
};

// Delete News
export const deleteNews = async (
  id
) => {
  const { data } = await apiClient.delete(
    `/news/${id}`
  );

  return data;
};

// Toggle Hide / Show
export const toggleNewsVisibility = async (
  id
) => {
  const { data } = await apiClient.patch(
    `/news/${id}/visibility`
  );

  return data;
};

// Publish / Draft
export const updateNewsStatus = async (
  id,
  status
) => {
  const { data } = await apiClient.patch(
    `/news/${id}/status`,
    {
      status,
    }
  );

  return data;
};

// Feature News
export const featureNews = async (
  id,
  featured
) => {
  const { data } = await apiClient.patch(
    `/news/${id}/feature`,
    {
      featured,
    }
  );

  return data;
};

// Pin News
export const pinNews = async (
  id,
  pinned
) => {
  const { data } = await apiClient.patch(
    `/news/${id}/pin`,
    {
      pinned,
    }
  );

  return data;
};