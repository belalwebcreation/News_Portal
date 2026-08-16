import apiClient from "../../../dashboard/pages/WriterSectionManagement/api/apiClient";
import { api } from "../../../config/Config";


/*
|--------------------------------------------------------------------------
| Extract API Error Message
|--------------------------------------------------------------------------
*/

function getErrorMessage(
  error,
  fallback
) {

  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );

}


export const newsService = {


  // ==========================================================
  // GET ALL NEWS
  // ==========================================================

  async getAllNews(params = {}) {

    try {

      const { data } =
        await apiClient.get(
          api.news,
          {
            params,
          }
        );

      return data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ লোড করতে সমস্যা হয়েছে।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // GET SINGLE NEWS
  // ==========================================================

  async getSingleNews(identifier) {

    try {

      const { data } =
        await apiClient.get(
          `${api.news}/${identifier}`
        );

      return data.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ লোড করতে সমস্যা হয়েছে।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // GET TRENDING NEWS
  // ==========================================================

  async getTrendingNews(params = {}) {

    try {

      const { data } =
        await apiClient.get(
          `${api.news}/trending`,
          {
            params,
          }
        );

      return data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "ট্রেন্ডিং নিউজ লোড করতে সমস্যা হয়েছে।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // GET TOP VIEWED NEWS
  // ==========================================================

  async getTopViewedNews(limit = 5) {

    try {

      const { data } =
        await apiClient.get(
          `${api.news}/top-viewed`,
          {
            params: {
              limit,
            },
          }
        );

      return data.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "টপ ভিউড নিউজ লোড করতে সমস্যা হয়েছে।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // INCREMENT VIEW
  // ==========================================================

  async incrementView(id) {

    try {

      const { data } =
        await apiClient.post(
          `${api.news}/${id}/view`
        );

      return data;

    } catch (error) {

      console.error(
        "View increment error:",
        error?.response?.data ||
        error?.message
      );

      return null;

    }

  },


  // ==========================================================
  // CREATE NEWS
  // ==========================================================

  async createNews(payload) {

    try {

      const { data } =
        await apiClient.post(
          api.news,
          payload,
          {
            withCredentials: true,
          }
        );

      return data.data;

    } catch (error) {

      console.error(
        "createNews API error:",
        {
          status:
            error?.response?.status,

          response:
            error?.response?.data,

          message:
            error?.message,
        }
      );

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ তৈরি করা যায়নি।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // UPDATE NEWS
  // ==========================================================

  async updateNews(
    id,
    payload
  ) {

    try {

      const { data } =
        await apiClient.put(
          `${api.news}/${id}`,
          payload,
          {
            withCredentials: true,
          }
        );

      return data.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ আপডেট করা যায়নি।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // DELETE NEWS
  // ==========================================================

  async deleteNews(id) {

    try {

      await apiClient.delete(
        `${api.news}/${id}`,
        {
          withCredentials: true,
        }
      );

      return true;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ ডিলিট করা যায়নি।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // NEWS SECTION LAYOUT
  // ==========================================================

  async getNewsSectionLayout() {

    try {

      const { data } =
        await apiClient.get(
          `${api.news}/section-layout`
        );

      return data.data;

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "নিউজ সেকশন লোড করতে সমস্যা হয়েছে।"
        ),
        {
          cause: error,
        }
      );

    }

  },


  // ==========================================================
  // UPLOAD NEWS IMAGE
  // ==========================================================

  async uploadImage(formData) {

    try {

      const { data } =
        await apiClient.post(
          `${api.news}/image`,
          formData,
          {
            withCredentials: true,

            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      return {

        mediaId:
          data.mediaId,

        url:
          data.url,

        secureUrl:
          data.secureUrl,

        cloudinaryPublicId:
          data.cloudinaryPublicId,

      };

    } catch (error) {

      throw new Error(
        getErrorMessage(
          error,
          "ছবি আপলোড করা যায়নি।"
        ),
        {
          cause: error,
        }
      );

    }

  },

};


export default newsService;