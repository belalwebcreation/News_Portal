import ms from "ms";

/**
 * ============================================================
 * Authentication Cookie Configuration
 * ============================================================
 *
 * Access Token:
 *   Cookie name: accessToken
 *   Path: /
 *
 * Refresh Token:
 *   Cookie name: refreshToken
 *   Path: /news/api/auth
 *
 * Backend API:
 *   /news/api/auth/*
 *
 * Development:
 *   http://localhost:5173
 *   http://localhost:5000
 *
 * Production:
 *   https://www.royalbangla.com/news
 *
 * ============================================================
 */

const isProd =
  process.env.NODE_ENV === "production";

/*
|--------------------------------------------------------------------------
| Common Cookie Options
|--------------------------------------------------------------------------
*/

const baseOptions = {
  httpOnly: true,

  /*
  |--------------------------------------------------------------------------
  | localhost -> HTTP
  | production -> HTTPS
  |--------------------------------------------------------------------------
  */

  secure: isProd,

  /*
  |--------------------------------------------------------------------------
  | Development:
  | Same-site localhost requests
  |
  | Production:
  | Frontend + API are under royalbangla.com
  |--------------------------------------------------------------------------
  */

  sameSite: isProd
    ? "none"
    : "lax",
};

/*
|--------------------------------------------------------------------------
| Cookie Expiry
|--------------------------------------------------------------------------
*/

const ACCESS_TOKEN_MAX_AGE = ms(
  process.env.JWT_EXPIRES_IN || "15m"
);

const REFRESH_TOKEN_MAX_AGE = ms(
  process.env.JWT_REFRESH_EXPIRES_IN || "30d"
);

/*
|--------------------------------------------------------------------------
| Set Authentication Cookies
|--------------------------------------------------------------------------
*/

export const setAuthCookies = (
  res,
  {
    accessToken,
    refreshToken,
  }
) => {
  /*
  |--------------------------------------------------------------------------
  | ACCESS TOKEN
  |--------------------------------------------------------------------------
  |
  | Access token সব protected API request-এ দরকার।
  |
  | তাই path = "/"
  |
  */

  res.cookie(
    "accessToken",
    accessToken,
    {
      ...baseOptions,

      maxAge:
        ACCESS_TOKEN_MAX_AGE,

      path: "/",
    }
  );

  /*
  |--------------------------------------------------------------------------
  | REFRESH TOKEN
  |--------------------------------------------------------------------------
  |
  | তোমার actual auth API:
  |
  | /news/api/auth/*
  |
  | তাই refreshToken-এর path অবশ্যই:
  |
  | /news/api/auth
  |
  */

  res.cookie(
    "refreshToken",
    refreshToken,
    {
      ...baseOptions,

      maxAge:
        REFRESH_TOKEN_MAX_AGE,

      path: "/news/api/auth",
    }
  );
};

/*
|--------------------------------------------------------------------------
| Clear Authentication Cookies
|--------------------------------------------------------------------------
*/

export const clearAuthCookies = (
  res
) => {
  /*
  |--------------------------------------------------------------------------
  | Clear accessToken
  |--------------------------------------------------------------------------
  */

  res.clearCookie(
    "accessToken",
    {
      ...baseOptions,
      path: "/",
    }
  );

  /*
  |--------------------------------------------------------------------------
  | Clear refreshToken
  |--------------------------------------------------------------------------
  */

  res.clearCookie(
    "refreshToken",
    {
      ...baseOptions,
      path: "/news/api/auth",
    }
  );
};