import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import http from "http";

import categoryRoutes from "./server/routes/categoryRoutes.js";
import notificationRoutes from "./server/routes/notificationRoutes.js"; // ✅ NEW
import allowedOrigins from "./server/config/allowedOrigins.js"; // ✅ NEW
import { initSocket } from "./server/socket/index.js"; // ✅ NEW

// ===============================
// Database & Models
// ===============================
import dbConnect from "./server/utils/db.js";
import News from "./server/models/News.js";

// ===============================
// Routes
// ===============================
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./server/routes/profile.routes.js";
import siteSettingRoutes from "./server/routes/siteSettingRoutes.js";
import navbarSettingRoutes from "./server/routes/navbarSetting.routes.js";
import topHeadlineRoutes from "./server/routes/topHeadlineRoutes.js";
import breakingNewsRoutes from "./server/routes/breakingNewsRoutes.js";
import mentionRoutes from "./server/features/mention/mention.routes.js";
import newsRoutes from "./server/routes/news.routes.js";
import userRoutes from "./server/routes/userRoutes.js";
import publicProfileRoutes from "./server/routes/publicProfileRoutes.js";

// ===============================
// Middleware
// ===============================
import errorHandler from "./server/middleware/errorMiddleware.js";

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// Reverse Proxy / Production
// ============================================================
// Required when running behind cPanel / LiteSpeed / Cloudflare
// so Express can correctly understand HTTPS and client IP.
app.set("trust proxy", 1);

// ============================================================
// Helpers for Social Media Bot Handling
// ============================================================

const BOT_UA =
  /facebookexternalhit|Facebot|LinkedInBot|Twitterbot|WhatsApp|Slackbot|TelegramBot|Discordbot/i;

const escapeHtml = (s = "") =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]
  );

const getArticleBySlug = async (slug) => {
  try {
    const article = await News.findOne({ slug }).lean();

    if (!article) return null;

    return {
      title: article.title,
      summary: article.summary || article.excerpt || "",
      coverImage: article.coverImage || article.image || "",
    };
  } catch (error) {
    console.error("getArticleBySlug failed:", error.message);
    return null;
  }
};

// ============================================================
// Debug Log
// ============================================================
// Only log non-production configuration values.
// Never expose secrets such as passwords or JWT secrets.

if (process.env.NODE_ENV !== "production") {
  console.log(
    "Cloud Name:",
    process.env.CLOUDINARY_CLOUD_NAME
  );

  console.log(
    "Cloud API Key:",
    process.env.CLOUDINARY_API_KEY
  );

  console.log(
    "EMAIL_HOST:",
    process.env.EMAIL_HOST
  );

  console.log(
    "EMAIL_PORT:",
    process.env.EMAIL_PORT
  );
}

// ============================================================
// Database Connection
// ============================================================

dbConnect();

// ============================================================
// Global Middlewares
// ============================================================

// 1. Cookie Parser
app.use(cookieParser());

// ============================================================
// 2. CORS Configuration
// ============================================================
//
// Production frontend:
// https://www.royalbangla.com/news
//
// Browser Origin does NOT include /news.
// Therefore CLIENT_URL must remain:
// https://www.royalbangla.com
//
// We support both www and non-www production domains.


app.use(
  cors({
    origin(origin, callback) {
      // Requests without Origin:
      // Postman, health checks, server-to-server requests, etc.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error(
        `CORS rejected origin: ${origin}`
      );

      return callback(
        new Error("CORS: Origin not allowed")
      );
    },

    // Required for HttpOnly authentication cookies.
    credentials: true,
  })
);

// ============================================================
// 3. Request Body Parsers
// ============================================================

app.use(
  express.json({
    limit: "20mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

// ============================================================
// API Routes
// ============================================================
//
// IMPORTANT:
// The production application is deployed under:
//
// https://www.royalbangla.com/news
//
// Therefore every API endpoint uses:
//
// /news/api/...

// Authentication
app.use(
  "/news/api/auth",
  authRoutes
);

// Profile
app.use(
  "/news/api/profile",
  profileRoutes
);

// Navbar Settings
app.use(
  "/news/api/site-settings/navbar",
  navbarSettingRoutes
);

// Site Settings
app.use(
  "/news/api/site-settings",
  siteSettingRoutes
);

// News
app.use(
  "/news/api/news",
  newsRoutes
);

// Top Headlines
app.use(
  "/news/api/top-headline",
  topHeadlineRoutes
);

// Breaking News
app.use(
  "/news/api/breaking-news",
  breakingNewsRoutes
);

// Categories
app.use(
  "/news/api/categories",
  categoryRoutes
);

// Mentions
app.use(
  "/news/api/mentions",
  mentionRoutes
);

// Users
app.use(
  "/news/api/users",
  userRoutes
);

// Notifications ✅ NEW
app.use(
  "/news/api/notifications",
  notificationRoutes
);

// Public Profile
app.use(
  "/news/api/public-profile",
  publicProfileRoutes
);

// ============================================================
// Health Check
// ============================================================

app.get(
  "/news/api/health",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "News Portal API Running...",
    });
  }
);

// ============================================================
// BOT HANDLER & FRONTEND SERVING
// ============================================================

// ============================================================
// 1. Social Media Bot Handler
// ============================================================
//
// Handles:
// Facebook
// WhatsApp
// Twitter/X
// LinkedIn
// Telegram
// Discord
// etc.
//
// Production article URL:
//
// https://www.royalbangla.com/news/articles/:slug

app.get(
  "/news/articles/:slug",
  async (req, res, next) => {
    const userAgent =
      req.headers["user-agent"] || "";

    // Normal browser request:
    // continue to React SPA.
    if (!BOT_UA.test(userAgent)) {
      return next();
    }

    const article = await getArticleBySlug(
      req.params.slug
    );

    if (!article) {
      return next();
    }

    const absoluteImage =
      article.coverImage &&
      article.coverImage.startsWith("http")
        ? article.coverImage
        : article.coverImage
        ? `${req.protocol}://${req.get(
            "host"
          )}${article.coverImage}`
        : "";

    const articleUrl =
      `${req.protocol}://${req.get("host")}` +
      `${req.originalUrl}`;

    res.send(`
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />

  <title>${escapeHtml(article.title)}</title>

  <meta
    property="og:type"
    content="article"
  />

  <meta
    property="og:title"
    content="${escapeHtml(article.title)}"
  />

  <meta
    property="og:description"
    content="${escapeHtml(article.summary)}"
  />

  <meta
    property="og:image"
    content="${absoluteImage}"
  />

  <meta
    property="og:url"
    content="${articleUrl}"
  />

  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="${escapeHtml(article.title)}"
  />

  <meta
    name="twitter:description"
    content="${escapeHtml(article.summary)}"
  />

  <meta
    name="twitter:image"
    content="${absoluteImage}"
  />
</head>

<body></body>
</html>
`);
  }
);

// ============================================================
// 2. Frontend Static Files
// ============================================================
//
// Vite production build:
//
// client/dist
//
// Application base:
//
// /news

app.use(
  "/news",
  express.static(
    path.join(
      process.cwd(),
      "client",
      "dist"
    )
  )
);

// ============================================================
// 3. React SPA Fallback
// ============================================================
//
// All frontend routes under /news should receive
// the React application's index.html.
//
// API routes must NOT reach this fallback.
// Otherwise API errors can incorrectly return HTML.

app.use(
  (req, res, next) => {
    if (
      req.originalUrl.startsWith(
        "/news/api"
      )
    ) {
      return next();
    }

    // Only handle requests belonging to
    // the /news application.
    if (
      !req.originalUrl.startsWith(
        "/news"
      )
    ) {
      return next();
    }

    res.sendFile(
      path.join(
        process.cwd(),
        "client",
        "dist",
        "index.html"
      )
    );
  }
);

// ============================================================
// Global Error Handler
// ============================================================

app.use(errorHandler);

// ============================================================
// Start Server
// ============================================================

// ============================================================
// HTTP Server + Socket.io
// ============================================================
//
// Socket.io কে raw http.Server-এর সাথে attach করতে হয় (শুধু Express
// app-এর সাথে সরাসরি না), তাই app.listen() এর বদলে httpServer ব্যবহার
// করা হচ্ছে। Passenger/cPanel-এর জন্য এটা transparent — এখনও একই
// PORT-এ HTTP serve করছে, শুধু WebSocket upgrade handle করার সক্ষমতা
// যোগ হলো।

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(
    `🚀 Server Running On http://localhost:${PORT}`
  );
});