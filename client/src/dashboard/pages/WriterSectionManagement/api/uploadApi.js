// src/modules/WriterSectionManagement/api/uploadApi.js

import apiClient from "./apiClient";

/* ==========================================
   Upload API
========================================== */

/**
 * Upload Single Image
 */
export const uploadImage = async (file, folder = "news") => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", folder);

  const { data } = await apiClient.post(
    "/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/**
 * Upload Multiple Images
 */
export const uploadImages = async (
  files,
  folder = "news"
) => {
  const formData = new FormData();

  [...files].forEach((file) => {
    formData.append("images", file);
  });

  formData.append("folder", folder);

  const { data } = await apiClient.post(
    "/upload/images",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

/**
 * Delete Uploaded Image
 */
export const deleteImage = async (
  publicId
) => {
  const { data } = await apiClient.delete(
    `/upload/image/${publicId}`
  );

  return data;
};

/**
 * Replace Existing Image
 */
export const replaceImage = async (
  publicId,
  file,
  folder = "news"
) => {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("folder", folder);

  const { data } = await apiClient.patch(
    `/upload/image/${publicId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};