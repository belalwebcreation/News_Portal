// src/modules/WriterSectionManagement/api/sectionApi.js

import apiClient from "./apiClient";

/* ==========================================
   SECTION LAYOUT API
========================================== */

// Get All Sections
export const getSections = async () => {
  const { data } = await apiClient.get("/sections");

  return data;
};

// Get Single Section
export const getSection = async (sectionKey) => {
  const { data } = await apiClient.get(
    `/sections/${sectionKey}`
  );

  return data;
};

// Create Section
export const createSection = async (
  payload
) => {
  const { data } = await apiClient.post(
    "/sections",
    payload
  );

  return data;
};

// Update Section
export const updateSection = async (
  sectionKey,
  payload
) => {
  const { data } = await apiClient.patch(
    `/sections/${sectionKey}`,
    payload
  );

  return data;
};

// Delete Section
export const deleteSection = async (
  sectionKey
) => {
  const { data } = await apiClient.delete(
    `/sections/${sectionKey}`
  );

  return data;
};

/* ==========================================
   HERO SLOT API
========================================== */

// Update Hero Left
export const updateHeroLeft = async (
  newsId
) => {
  const { data } = await apiClient.patch(
    "/sections/hero/left",
    {
      newsId,
    }
  );

  return data;
};

// Update Hero Center
export const updateHeroCenter = async (
  newsId
) => {
  const { data } = await apiClient.patch(
    "/sections/hero/center",
    {
      newsId,
    }
  );

  return data;
};

// Update Hero Right
export const updateHeroRight = async (
  newsIds
) => {
  const { data } = await apiClient.patch(
    "/sections/hero/right",
    {
      newsIds,
    }
  );

  return data;
};

/* ==========================================
   SECTION BANNER
========================================== */

export const updateSectionBanner =
  async (sectionKey, payload) => {
    const { data } =
      await apiClient.patch(
        `/sections/${sectionKey}/banner`,
        payload
      );

    return data;
  };

/* ==========================================
   REORDER
========================================== */

export const reorderSectionNews =
  async (sectionKey, payload) => {
    const { data } =
      await apiClient.patch(
        `/sections/${sectionKey}/reorder`,
        payload
      );

    return data;
  };

/* ==========================================
   VISIBILITY
========================================== */

export const toggleSectionVisibility =
  async (sectionKey) => {
    const { data } =
      await apiClient.patch(
        `/sections/${sectionKey}/visibility`
      );

    return data;
  };

/* ==========================================
   FEATURED
========================================== */

export const updateFeaturedNews =
  async (sectionKey, newsId) => {
    const { data } =
      await apiClient.patch(
        `/sections/${sectionKey}/featured`,
        {
          newsId,
        }
      );

    return data;
  };