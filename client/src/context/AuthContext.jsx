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

/**
 * Cookie-based auth (access + refresh tokens, both HttpOnly) — the backend
 * sets and reads these directly; this file never sees a raw token string.
 *
 * What changed from the localStorage version:
 * - No token in localStorage anymore — HttpOnly cookies can't be read by
 *   JS at all, so an XSS bug elsewhere on the site can no longer steal
 *   the session by reading storage.
 * - Session is restored by asking the backend "who am I" (GET /api/auth/me)
 *   instead of decoding a JWT locally, since we no longer have one to decode.
 * - A 401 with code "TOKEN_EXPIRED" triggers one silent
 *   POST /api/auth/refresh + retry instead of an immediate logout — access
 *   tokens are short-lived (15m) on purpose, so this is routine, not just
 *   an end-of-session event.
 * - userInfo is still cached in localStorage, but only as a "paint
 *   something before the network reply lands" hint. It's never trusted for
 *   auth decisions — only the cookie + backend response decide that.
 */

const AuthContext = createContext(null);

axios.defaults.withCredentials = true; // send/receive the auth cookies on every request

let refreshPromise = null; // de-dupes concurrent refresh calls from parallel requests

const refreshAccessToken = () => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post("/api/auth/refresh")
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const hasCheckedSession = useRef(false);

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

  // Paint a guess immediately from cache — actual auth state is confirmed
  // by fetchMe() below once the interceptor is registered.
  useEffect(() => {
    try {
      const cached = localStorage.getItem("userInfo");
      if (cached) setUserInfo(JSON.parse(cached));
    } catch {
      localStorage.removeItem("userInfo");
    }
  }, []);

  // Silent-refresh-then-retry on an expired access token; hard logout only
  // on a refresh failure or any other 401 (e.g. a revoked/invalid session).
  // Declared before the fetchMe effect below so it's registered first —
  // effects run in declaration order, and fetchMe's very first request
  // needs this interceptor already in place to self-heal correctly.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config;

        const isExpiredAccessToken =
          error.response?.status === 401 &&
          error.response?.data?.code === "TOKEN_EXPIRED" &&
          !original?._retried &&
          !original?.url?.includes("/api/auth/refresh"); // never retry-refresh the refresh call itself

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

        if (error.response?.status === 401) {
          applyUser(null);
        }

        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptorId);
  }, [applyUser]);

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/auth/me");
      applyUser(data.user);
    } catch {
      // By the time this catch runs, the interceptor above has already
      // tried a silent refresh once if it was a TOKEN_EXPIRED case — so a
      // failure here means there's genuinely no valid session.
      applyUser(null);
    }
  }, [applyUser]);

  // Runs once per app load (guarded against React StrictMode's dev double-invoke).
  useEffect(() => {
    if (hasCheckedSession.current) return;
    hasCheckedSession.current = true;
    fetchMe().finally(() => setLoading(false));
  }, [fetchMe]);

  // Cookies are already set by the backend's Set-Cookie header on the
  // login/googleLogin response — this just syncs React state to match.
  const loginUser = useCallback(
    (user) => {
      applyUser(user);
      localStorage.setItem("authEvent", `login:${Date.now()}`); // cross-tab ping
    },
    [applyUser]
  );

  const logoutUser = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout request failed:", err);
      // Clear local state regardless — the UI shouldn't stay "logged in"
      // just because this one network call failed.
    }
    applyUser(null);
    localStorage.setItem("authEvent", `logout:${Date.now()}`); // cross-tab ping
  }, [applyUser]);

  const updateUser = useCallback((updatedFields) => {
    setUserInfo((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...updatedFields };
      try {
        localStorage.setItem("userInfo", JSON.stringify(next));
      } catch (err) {
        console.error("Failed to persist user info:", err);
      }
      return next;
    });
  }, []);

  const hasRole = useCallback(
    (...roles) => !!userInfo && roles.includes(userInfo.role),
    [userInfo]
  );

  // A login/logout in one tab should reflect in every other open tab.
  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key === "authEvent") fetchMe();
    };
    window.addEventListener("storage", syncAcrossTabs);
    return () => window.removeEventListener("storage", syncAcrossTabs);
  }, [fetchMe]);

  const value = useMemo(
    () => ({
      userInfo,
      loading,
      isLoggedIn: !!userInfo,
      isAdmin: userInfo?.role === "admin",
      isWriter: userInfo?.role === "writer" || userInfo?.role === "admin",
      hasRole,
      loginUser,
      logoutUser,
      updateUser,
    }),
    [userInfo, loading, hasRole, loginUser, logoutUser, updateUser]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};