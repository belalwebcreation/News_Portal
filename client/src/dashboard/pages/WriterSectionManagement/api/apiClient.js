import axios from "axios";

/*
|--------------------------------------------------------------------------
| API CLIENT
|--------------------------------------------------------------------------
|
| Authentication is completely cookie based.
|
| accessToken  -> HttpOnly cookie
| refreshToken -> HttpOnly cookie
|
| Frontend কখনো raw JWT token localStorage-এ রাখবে না।
|
*/

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "/news",

  timeout: 20000,

  withCredentials: true,

  headers: {
    "Content-Type": "application/json",
  },
});


/*
|--------------------------------------------------------------------------
| Shared refresh promise
|--------------------------------------------------------------------------
|
| একই সময়ে অনেক request-এর accessToken expire হলে
| একাধিক refresh request পাঠানো হবে না।
|
*/

let refreshPromise = null;


const refreshAccessToken = async () => {

  if (!refreshPromise) {

    refreshPromise = apiClient
      .post(
        "/api/auth/refresh",
        null,
        {
          withCredentials: true,

          /*
          | গুরুত্বপূর্ণ:
          | refresh request নিজে আবার refresh trigger করবে না।
          */
          skipAuthRefresh: true,
        }
      )
      .finally(() => {

        refreshPromise = null;

      });

  }

  return refreshPromise;

};


/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
|
| এখানে Authorization header manually পাঠানোর দরকার নেই।
|
| Browser নিজেই HttpOnly cookie পাঠাবে।
|
*/

apiClient.interceptors.request.use(

  (config) => {

    config.withCredentials = true;

    return config;

  },

  (error) => {

    return Promise.reject(error);

  }

);


/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
|
| 401 TOKEN_EXPIRED
|        ↓
| /api/auth/refresh
|        ↓
| নতুন accessToken cookie
|        ↓
| original request retry
|
*/

apiClient.interceptors.response.use(

  (response) => {

    return response;

  },

  async (error) => {

    const originalRequest =
      error?.config;

    const status =
      error?.response?.status;

    const responseData =
      error?.response?.data;

    /*
    |--------------------------------------------------------------------------
    | Refresh endpoint itself
    |--------------------------------------------------------------------------
    */

    const isRefreshRequest =
      originalRequest?.skipAuthRefresh === true ||
      originalRequest?.url?.includes(
        "/api/auth/refresh"
      );


    /*
    |--------------------------------------------------------------------------
    | Detect expired access token
    |--------------------------------------------------------------------------
    */

    const tokenExpired =
      status === 401 &&
      responseData?.code ===
        "TOKEN_EXPIRED";


    /*
    |--------------------------------------------------------------------------
    | Refresh + Retry
    |--------------------------------------------------------------------------
    */

    if (
      tokenExpired &&
      !isRefreshRequest &&
      originalRequest &&
      !originalRequest._authRetry
    ) {

      originalRequest._authRetry = true;

      try {

        await refreshAccessToken();

        originalRequest.withCredentials =
          true;

        return apiClient(
          originalRequest
        );

      } catch (refreshError) {

        return Promise.reject(
          refreshError
        );

      }

    }


    /*
    |--------------------------------------------------------------------------
    | Return original axios error
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | আগের code এখানে error.response.data return করছিল।
    | ফলে newsService-এর:
    |
    | error.response?.data?.message
    |
    | আর কাজ করছিল না।
    |
    */

    return Promise.reject(error);

  }

);


export default apiClient;