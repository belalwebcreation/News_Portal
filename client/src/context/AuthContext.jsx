import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { baseUrl } from "../config/Config";

/**
 * ============================================================
 * AUTH CONTEXT
 * ============================================================
 *
 * Authentication architecture:
 *
 * Access Token  -> HttpOnly cookie
 * Refresh Token -> HttpOnly cookie
 *
 * Frontend কখনো raw JWT token localStorage/sessionStorage-এ
 * রাখবে না।
 *
 * Browser automatically cookie পাঠাবে কারণ সব auth request-এ
 * withCredentials: true দেওয়া আছে।
 *
 * Main endpoints:
 *
 * GET  /api/auth/me
 * POST /api/auth/refresh
 * POST /api/auth/logout
 *
 * Example:
 *
 * VITE_API_BASE_URL=http://localhost:5000/news
 *
 * তাহলে:
 *
 * /api/auth/me
 * =
 * http://localhost:5000/news/api/auth/me
 *
 * ============================================================
 */

const AUTH_API = `${baseUrl}/api/auth`;

const ME_URL = `${AUTH_API}/me`;
const REFRESH_URL = `${AUTH_API}/refresh`;
const LOGOUT_URL = `${AUTH_API}/logout`;

const AuthContext = createContext(null);

/*
|--------------------------------------------------------------------------
| Shared refresh promise
|--------------------------------------------------------------------------
|
| একসাথে অনেক API request-এর access token expire হলে যেন
| একাধিক refresh request না যায়।
|
*/

let refreshPromise = null;

/*
|--------------------------------------------------------------------------
| Refresh Access Token
|--------------------------------------------------------------------------
*/

const refreshAccessToken = async () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        REFRESH_URL,
        null,
        {
          withCredentials: true,
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
| Auth Provider
|--------------------------------------------------------------------------
*/

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Prevent duplicate initial session checks
  |--------------------------------------------------------------------------
  */

  const hasCheckedSession = useRef(false);

  /*
  |--------------------------------------------------------------------------
  | Apply User
  |--------------------------------------------------------------------------
  */

  const applyUser = useCallback((user) => {
    setUserInfo(user || null);

    /*
    |--------------------------------------------------------------------------
    | userInfo cache
    |--------------------------------------------------------------------------
    |
    | এটা authentication source না।
    | শুধু UI দ্রুত দেখানোর জন্য cache।
    |
    */

    try {
      if (user) {
        localStorage.setItem(
          "userInfo",
          JSON.stringify(user)
        );
      } else {
        localStorage.removeItem("userInfo");
      }
    } catch (error) {
      console.error(
        "Failed to cache user information:",
        error
      );
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Restore Cached User
  |--------------------------------------------------------------------------
  |
  | Cached user শুধু initial UI-এর জন্য।
  |
  | Actual authentication সবসময় /me endpoint দিয়ে verify হবে।
  |
  */

  useEffect(() => {
    try {
      const cachedUser =
        localStorage.getItem("userInfo");

      if (!cachedUser) {
        return;
      }

      const parsedUser =
        JSON.parse(cachedUser);

      if (
        parsedUser &&
        typeof parsedUser === "object"
      ) {
        setUserInfo(parsedUser);
      }
    } catch (error) {
      console.warn(
        "Invalid cached user information. Clearing cache."
      );

      localStorage.removeItem("userInfo");
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Global Axios Response Interceptor
  |--------------------------------------------------------------------------
  |
  | Access token expire হলে:
  |
  | 1. Backend -> 401 TOKEN_EXPIRED
  | 2. Refresh cookie ব্যবহার করে /refresh
  | 3. নতুন access cookie set হবে
  | 4. Original request retry হবে
  |
  */

  useEffect(() => {
    const interceptorId =
      axios.interceptors.response.use(
        (response) => response,

        async (error) => {
          const originalRequest =
            error?.config;

          const status =
            error?.response?.status;

          const responseData =
            error?.response?.data;

          const requestUrl =
            originalRequest?.url || "";

          /*
          |--------------------------------------------------------------------------
          | Ignore refresh request itself
          |--------------------------------------------------------------------------
          */

          const isRefreshRequest =
            requestUrl.includes(
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
              /*
              |--------------------------------------------------------------------------
              | Refresh cookie-based session
              |--------------------------------------------------------------------------
              */

              await refreshAccessToken();

              /*
              |--------------------------------------------------------------------------
              | Retry original request
              |--------------------------------------------------------------------------
              |
              | Important:
              | withCredentials explicitly true রাখা হচ্ছে।
              |
              */

              originalRequest.withCredentials = true;

              return axios(
                originalRequest
              );
            } catch (refreshError) {
              /*
              |--------------------------------------------------------------------------
              | Refresh failed
              |--------------------------------------------------------------------------
              |
              | Access + refresh session আর valid নেই।
              |
              */

              applyUser(null);

              return Promise.reject(
                refreshError
              );
            }
          }

          /*
          |--------------------------------------------------------------------------
          | Authentication required
          |--------------------------------------------------------------------------
          |
          | Backend যদি future-এ এই code দেয়:
          |
          | AUTHENTICATION_REQUIRED
          |
          | তাহলে local auth state clear হবে।
          |
          */

          if (
            status === 401 &&
            responseData?.code ===
              "AUTHENTICATION_REQUIRED"
          ) {
            applyUser(null);
          }

          return Promise.reject(error);
        }
      );

    /*
    |--------------------------------------------------------------------------
    | Cleanup
    |--------------------------------------------------------------------------
    */

    return () => {
      axios.interceptors.response.eject(
        interceptorId
      );
    };
  }, [applyUser]);

  /*
  |--------------------------------------------------------------------------
  | Fetch Current User
  |--------------------------------------------------------------------------
  */

  const fetchMe = useCallback(
    async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | IMPORTANT
        |--------------------------------------------------------------------------
        |
        | Browser HttpOnly accessToken cookie automatically পাঠাবে।
        |
        */

        const response =
          await axios.get(
            ME_URL,
            {
              withCredentials: true,
            }
          );

        const data =
          response?.data;

        /*
        |--------------------------------------------------------------------------
        | Backend response compatibility
        |--------------------------------------------------------------------------
        |
        | যদি backend:
        |
        | { user: {...} }
        |
        | অথবা
        |
        | { data: { user: {...} } }
        |
        | দেয়, দুইটাই handle করবে।
        |
        */

        const authenticatedUser =
          data?.user ||
          data?.data?.user ||
          null;

        if (authenticatedUser) {
          applyUser(
            authenticatedUser
          );

          return authenticatedUser;
        }

        /*
        |--------------------------------------------------------------------------
        | No user returned
        |--------------------------------------------------------------------------
        */

        applyUser(null);

        return null;
      } catch (error) {
        const status =
          error?.response?.status;

        /*
        |--------------------------------------------------------------------------
        | 401 on /me
        |--------------------------------------------------------------------------
        |
        | User logged out থাকলে initial /me request-এর 401
        | expected behavior।
        |
        | তাই console.error না করে silently logged-out state
        | রাখা হচ্ছে।
        |
        */

        if (status === 401) {
          applyUser(null);

          return null;
        }

        /*
        |--------------------------------------------------------------------------
        | Other server/network errors
        |--------------------------------------------------------------------------
        */

        console.error(
          "Session restore failed:",
          error?.response?.status,
          error?.response?.data ||
            error?.message
        );

        /*
        |--------------------------------------------------------------------------
        | Authentication state uncertain হলে cached user
        | blindly trusted করা হবে না।
        |--------------------------------------------------------------------------
        */

        applyUser(null);

        return null;
      }
    },
    [applyUser]
  );

  /*
  |--------------------------------------------------------------------------
  | Initial Session Restore
  |--------------------------------------------------------------------------
  |
  | NOTE:
  | আগে এখানে একটা "mounted" flag ছিল, যেটা StrictMode-এর
  | double-invoke (mount -> cleanup -> mount) এর সময়
  | setLoading(false) কে permanently block করে দিচ্ছিল।
  | hasCheckedSession ref দিয়েই duplicate call ঠেকানো হচ্ছে,
  | তাই mounted flag দরকার নেই — সরিয়ে দেওয়া হলো।
  |
  */

  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }

    hasCheckedSession.current = true;

    const restoreSession = async () => {
      try {
        await fetchMe();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, [fetchMe]);

  /*
  |--------------------------------------------------------------------------
  | Login
  |--------------------------------------------------------------------------
  |
  | Login request backend থেকে successfully complete হওয়ার পরে
  | এই function call করবে।
  |
  | Backend ইতোমধ্যে HttpOnly cookie set করবে।
  |
  */

  const loginUser = useCallback(
    (user) => {
      if (!user) {
        applyUser(null);
        return;
      }

      applyUser(user);

      /*
      |--------------------------------------------------------------------------
      | Cross-tab sync
      |--------------------------------------------------------------------------
      */

      try {
        localStorage.setItem(
          "authEvent",
          `login:${Date.now()}`
        );
      } catch (error) {
        console.error(
          "Failed to dispatch login event:",
          error
        );
      }
    },
    [applyUser]
  );

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const logoutUser = useCallback(
    async () => {
      try {
        /*
        |--------------------------------------------------------------------------
        | Backend cookie clear করবে
        |--------------------------------------------------------------------------
        */

        await axios.post(
          LOGOUT_URL,
          null,
          {
            withCredentials: true,
          }
        );
      } catch (error) {
        /*
        |--------------------------------------------------------------------------
        | Logout endpoint fail করলেও frontend state clear করব।
        |--------------------------------------------------------------------------
        */

        console.error(
          "Logout request failed:",
          error?.response?.data ||
            error?.message
        );
      } finally {
        /*
        |--------------------------------------------------------------------------
        | Clear frontend user state
        |--------------------------------------------------------------------------
        */

        applyUser(null);

        /*
        |--------------------------------------------------------------------------
        | Cross-tab logout sync
        |--------------------------------------------------------------------------
        */

        try {
          localStorage.setItem(
            "authEvent",
            `logout:${Date.now()}`
          );
        } catch (error) {
          console.error(
            "Failed to dispatch logout event:",
            error
          );
        }
      }
    },
    [applyUser]
  );

  /*
  |--------------------------------------------------------------------------
  | Update User
  |--------------------------------------------------------------------------
  */

  const updateUser = useCallback(
    (updatedFields) => {
      setUserInfo((previousUser) => {
        if (!previousUser) {
          return previousUser;
        }

        const updatedUser = {
          ...previousUser,
          ...updatedFields,
        };

        try {
          localStorage.setItem(
            "userInfo",
            JSON.stringify(
              updatedUser
            )
          );
        } catch (error) {
          console.error(
            "Failed to update cached user:",
            error
          );
        }

        return updatedUser;
      });
    },
    []
  );

  /*
  |--------------------------------------------------------------------------
  | Role Helpers
  |--------------------------------------------------------------------------
  */

  const hasRole = useCallback(
    (...roles) => {
      if (!userInfo) {
        return false;
      }

      return roles.includes(
        userInfo.role
      );
    },
    [userInfo]
  );

  /*
  |--------------------------------------------------------------------------
  | Role Flags
  |--------------------------------------------------------------------------
  */

  const isAdmin =
    userInfo?.role === "admin" ||
    userInfo?.role === "superadmin";

  const isSuperAdmin =
    userInfo?.role ===
    "superadmin";

  const isWriter =
    userInfo?.role === "writer" ||
    userInfo?.role === "admin" ||
    userInfo?.role === "superadmin";

  /*
  |--------------------------------------------------------------------------
  | Context Value
  |--------------------------------------------------------------------------
  |
  | userInfo
  | user
  | currentUser
  |
  | তিনটিই expose করছি যাতে project-এর পুরোনো component
  | ভেঙে না যায়।
  |
  */

  const contextValue =
    useMemo(
      () => ({
        /*
        |--------------------------------------------------------------------------
        | Main user object
        |--------------------------------------------------------------------------
        */

        userInfo,

        /*
        |--------------------------------------------------------------------------
        | Compatibility aliases
        |--------------------------------------------------------------------------
        |
        | তোমার BookmarkButton-এ:
        |
        | const { user } = useAuth();
        |
        | কাজ করবে।
        |
        */

        user: userInfo,

        currentUser:
          userInfo,

        /*
        |--------------------------------------------------------------------------
        | Loading
        |--------------------------------------------------------------------------
        */

        loading,

        /*
        |--------------------------------------------------------------------------
        | Authentication state
        |--------------------------------------------------------------------------
        */

        isLoggedIn:
          Boolean(userInfo),

        isAuthenticated:
          Boolean(userInfo),

        /*
        |--------------------------------------------------------------------------
        | Role state
        |--------------------------------------------------------------------------
        */

        isAdmin,

        isSuperAdmin,

        isWriter,

        /*
        |--------------------------------------------------------------------------
        | Helpers
        |--------------------------------------------------------------------------
        */

        hasRole,

        /*
        |--------------------------------------------------------------------------
        | Actions
        |--------------------------------------------------------------------------
        */

        loginUser,

        logoutUser,

        updateUser,

        fetchMe,
      }),
      [
        userInfo,
        loading,
        isAdmin,
        isSuperAdmin,
        isWriter,
        hasRole,
        loginUser,
        logoutUser,
        updateUser,
        fetchMe,
      ]
    );

  /*
  |--------------------------------------------------------------------------
  | Provider
  |--------------------------------------------------------------------------
  */

  return (
    <AuthContext.Provider
      value={contextValue}
    >
      {children}
    </AuthContext.Provider>
  );
};

/*
|--------------------------------------------------------------------------
| useAuth
|--------------------------------------------------------------------------
*/

export const useAuth = () => {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
};

export default AuthContext;