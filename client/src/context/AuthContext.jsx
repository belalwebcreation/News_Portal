import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

/**
 * This file is 100% frontend (React) code — no backend imports here.
 * If you ever see something like `import sendEmail from "../utils/sendEmail.js"`
 * at the top of this file, that's leftover backend code that got mixed in
 * by accident during copy-paste — delete it, it doesn't belong here.
 *
 * What this file does:
 * - Restores the session from localStorage on app load (only if the JWT
 *   isn't expired yet).
 * - Attaches the token to every axios request automatically.
 * - Auto-logs-out if the backend ever responds 401 to any request.
 * - Keeps login/logout in sync across browser tabs.
 * - Exposes updateUser() so profile edits update both React state AND
 *   localStorage together (never use setUserInfo directly — it doesn't
 *   exist as a public value here on purpose).
 *
 * Known tradeoff: the token lives in localStorage, which any script on the
 * page can read — a real risk only if the site is vulnerable to XSS
 * somewhere else. The safer pattern is an httpOnly cookie set by the
 * backend (JS can't read it at all), but that needs backend + CORS changes
 * (credentials: true), so it's not done here.
 */

const AuthContext = createContext(null);

// JWTs are base64url, not plain base64 — "-"/"_" need remapping before atob.
const decodeTokenExpiry = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(padded));
    return payload.exp ? payload.exp * 1000 : null; // ms
  } catch {
    return null;
  }
};

const isTokenExpired = (token) => {
  const expiryMs = decodeTokenExpiry(token);
  // Can't read an expiry (e.g. non-JWT format)? Don't force a logout over
  // a decode quirk — the 401 interceptor below is the real safety net.
  if (!expiryMs) return false;
  return Date.now() >= expiryMs;
};

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on app load, but only if it's actually still valid.
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("userInfo");

      if (storedToken && storedUser && !isTokenExpired(storedToken)) {
        setToken(storedToken);
        setUserInfo(JSON.parse(storedUser));
      } else if (storedToken || storedUser) {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      }
    } catch (err) {
      console.error("Failed to restore session:", err);
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  }, []);

  const loginUser = useCallback((newToken, user) => {
    try {
      localStorage.setItem("token", newToken);
      localStorage.setItem("userInfo", JSON.stringify(user));
    } catch (err) {
      console.error("Failed to persist session:", err);
    }
    setToken(newToken);
    setUserInfo(user);
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setToken(null);
    setUserInfo(null);
  }, []);

  // Use this after e.g. a profile update instead of touching state
  // directly — keeps React state and localStorage from drifting apart.
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

  // Keep every axios request authenticated automatically.
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common.Authorization;
    }
  }, [token]);

  // Self-heal on a rejected/expired/invalid token instead of leaving the
  // user stuck in a "logged in" UI where every request quietly fails.
  useEffect(() => {
    const interceptorId = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logoutUser();
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptorId);
  }, [logoutUser]);

  // Logging out in one tab should log out every open tab of the site.
  useEffect(() => {
    const syncAcrossTabs = (event) => {
      if (event.key === "token" && !event.newValue) {
        setToken(null);
        setUserInfo(null);
      }
      if (event.key === "userInfo") {
        try {
          setUserInfo(event.newValue ? JSON.parse(event.newValue) : null);
        } catch {
          setUserInfo(null);
        }
      }
    };
    window.addEventListener("storage", syncAcrossTabs);
    return () => window.removeEventListener("storage", syncAcrossTabs);
  }, []);

  const value = useMemo(
    () => ({
      userInfo,
      token,
      loading,
      isLoggedIn: !!userInfo && !!token,
      isAdmin: userInfo?.role === "admin",
      // Treat admin as able to do everything a writer can.
      isWriter: userInfo?.role === "writer" || userInfo?.role === "admin",
      hasRole,
      loginUser,
      logoutUser,
      updateUser,
    }),
    [userInfo, token, loading, hasRole, loginUser, logoutUser, updateUser]
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
