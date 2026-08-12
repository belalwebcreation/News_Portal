import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { baseUrl } from "../config/Config";

/**
 * Cookie-based auth (access + refresh tokens, both HttpOnly)
 *
 * Backend owns the authentication cookies.
 * This file never reads or stores raw access/refresh tokens.
 *
 * Session restoration:
 *   GET /news/api/auth/me
 *
 * Token refresh:
 *   POST /news/api/auth/refresh
 *
 * Logout:
 *   POST /news/api/auth/logout
 *
 * The "/news" prefix comes from VITE_API_BASE_URL in production:
 *
 *   https://www.royalbangla.com/news
 *
 * Therefore:
 *
 *   baseUrl + "/api/auth/me"
 *   =
 *   https://www.royalbangla.com/news/api/auth/me
 */

// ============================================================
// API URLs
// ============================================================

const AUTH_API = `${baseUrl}/api/auth`;

const ME_URL = `${AUTH_API}/me`;
const REFRESH_URL = `${AUTH_API}/refresh`;
const LOGOUT_URL = `${AUTH_API}/logout`;

// ============================================================
// Context
// ============================================================

const AuthContext = createContext(null);

// Send/receive HttpOnly authentication cookies on every request.
axios.defaults.withCredentials = true;

// Prevent multiple simultaneous refresh requests.
let refreshPromise = null;

// ============================================================
// Refresh Access Token
// ============================================================

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(REFRESH_URL, null, {
        withCredentials: true,
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

// ============================================================
// Auth Provider
// ============================================================

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasCheckedSession = useRef(false);

  // ==========================================================
  // Apply User
  // ==========================================================

  const applyUser = useCallback((user) => {
    setUserInfo(user);

    try {
      if (user) {
        localStorage.setItem("userInfo", JSON.stringify(user));
      } else {
        localStorage.removeItem("userInfo");
      }
    } catch (err) {
      console.error("Failed to cache user info:", err);
    }
  }, []);

  // ==========================================================
  // Restore Cached User Immediately
  // ==========================================================

  // This is only a visual cache.
  // It is NEVER trusted as authentication.
  //
  // Real authentication is confirmed by /me below.

  useEffect(() => {
    try {
      const cached = localStorage.getItem("userInfo");

      if (cached) {
        setUserInfo(JSON.parse(cached));
      }
    } catch {
      localStorage.removeItem("userInfo");
    }
  }, []);

  // ==========================================================
  // Axios Response Interceptor
  // ==========================================================

  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,

      async (error) => {
        const original = error.config;

        const requestUrl = original?.url || "";

        // ------------------------------------------------------
        // Detect expired access token
        // ------------------------------------------------------

        const isExpiredAccessToken =
          error.response?.status === 401 &&
          error.response?.data?.code === "TOKEN_EXPIRED" &&
          !original?._retried &&
          !requestUrl.includes("/api/auth/refresh");

        // ------------------------------------------------------
        // Refresh + Retry
        // ------------------------------------------------------

        if (isExpiredAccessToken) {
          original._retried = true;

          try {
            await refreshAccessToken();

            return axios(original);
          } catch {
            applyUser(null);

            return Promise.reject(error);
          }
        }

        // ------------------------------------------------------
        // Any other 401 = authenticated session unavailable
        // ------------------------------------------------------

        if (error.response?.status === 401) {
          applyUser(null);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptorId);
    };
  }, [applyUser]);

  // ==========================================================
  // Fetch Current Logged-In User
  // ==========================================================

  const fetchMe = useCallback(async () => {
    try {
      /**
       * IMPORTANT:
       *
       * Old:
       * axios.get("/api/auth/me")
       *
       * Production requested:
       * https://www.royalbangla.com/api/auth/me
       *
       * Correct:
       * https://www.royalbangla.com/news/api/auth/me
       */

      const { data } = await axios.get(ME_URL, {
        withCredentials: true,
      });

      applyUser(data.user);
    } catch (error) {
      console.error(
        "Session restore failed:",
        error.response?.status,
        error.response?.data || error.message
      );

      // If session is genuinely invalid, clear auth state.
      applyUser(null);
    }
  }, [applyUser]);

  // ==========================================================
  // Initial Session Check
  // ==========================================================

  useEffect(() => {
    if (hasCheckedSession.current) return;

    hasCheckedSession.current = true;

    fetchMe().finally(() => {
      setLoading(false);
    });
  }, [fetchMe]);

  // ==========================================================
  // Login
  // ==========================================================

  const loginUser = useCallback(
    (user) => {
      applyUser(user);

      // Cross-tab authentication event.
      localStorage.setItem("authEvent", `login:${Date.now()}`);
    },
    [applyUser]
  );

  // ==========================================================
  // Logout
  // ==========================================================

  const logoutUser = useCallback(async () => {
    try {
      /**
       * Correct production URL:
       *
       * https://www.royalbangla.com/news/api/auth/logout
       */

      await axios.post(
        LOGOUT_URL,
        null,
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Logout request failed:", err);
    }

    // Clear local state regardless of server response.
    applyUser(null);

    // Cross-tab authentication event.
    localStorage.setItem("authEvent", `logout:${Date.now()}`);
  }, [applyUser]);

  // ==========================================================
  // Update User
  // ==========================================================

  const updateUser = useCallback((updatedFields) => {
    setUserInfo((prev) => {
      if (!prev) return prev;

      const next = {
        ...prev,
        ...updatedFields,
      };

      try {
        localStorage.setItem("userInfo", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to persist user info:", err);
      }

      return next;
    });
  }, []);

  // ==========================================================
  // Role Helpers
  // ==========================================================

  const hasRole = useCallback(
    (...roles) => {
      return !!userInfo && roles.includes(userInfo.role);
    },
    [userInfo]
  );

  // ==========================================================
  // Cross-Tab Authentication Sync
  // ==========================================================

  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key === "authEvent") {
        fetchMe();
      }
    };

    window.addEventListener("storage", syncAcrossTabs);

    return () => {
      window.removeEventListener("storage", syncAcrossTabs);
    };
  }, [fetchMe]);

  // ==========================================================
  // Context Value
  // ==========================================================

  const value = useMemo(
    () => ({
      userInfo,
      loading,

      isLoggedIn: !!userInfo,

      isAdmin: userInfo?.role === "admin",

      isWriter:
        userInfo?.role === "writer" ||
        userInfo?.role === "admin",

      hasRole,

      loginUser,

      logoutUser,

      updateUser,
    }),
    [
      userInfo,
      loading,
      hasRole,
      loginUser,
      logoutUser,
      updateUser,
    ]
  );

  // ==========================================================
  // Provider
  // ==========================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// useAuth Hook
// ============================================================

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};