import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import categoryRoutes from "./server/routes/categoryRoutes.js";

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

// Required for Render / Reverse Proxy (১. trust proxy যোগ করা হয়েছে)
app.set("trust proxy", 1);

// ===============================
// Helpers for Social Media Bot Handling
// ===============================
const BOT_UA = /facebookexternalhit|Facebot|LinkedInBot|Twitterbot|WhatsApp|Slackbot|TelegramBot|Discordbot/i;

const escapeHtml = (s = "") =>
  s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

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

// ===============================
// Debug Log (২. Production চেক সহ আপডেট করা হয়েছে)
// ===============================
if (process.env.NODE_ENV !== "production") {
  console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
  console.log("Cloud API Key:", process.env.CLOUDINARY_API_KEY);
  console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
  console.log("EMAIL_PORT:", process.env.EMAIL_PORT);
}

// ===============================
// Database Connection
// ===============================
dbConnect();

// ===============================
// Global Middlewares
// ===============================

// 1. Cookie Parser Middleware
app.use(cookieParser());

// 2. Dynamic CORS Configuration (৩. Multiple Origins & Non-browser request সাপোর্ট সহ)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without origin (Postman, health checks, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true, // required for http-only cookies
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// ===============================
// API Routes
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/site-settings/navbar", navbarSettingRoutes);
app.use("/api/site-settings", siteSettingRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/top-headline", topHeadlineRoutes);
app.use("/api/breaking-news", breakingNewsRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/mentions", mentionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/public-profile", publicProfileRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "News Portal API Running...",
  });
});

// ===============================
// BOT HANDLER & FRONTEND SERVING
// ===============================

// ১. সোশ্যাল মিডিয়া বট হ্যান্ডলার (Facebook, WhatsApp, Twitter ইত্যাদি)
app.get("/articles/:slug", async (req, res, next) => {
  if (!BOT_UA.test(req.headers["user-agent"] || "")) return next();

  const article = await getArticleBySlug(req.params.slug);
  if (!article) return next();

  const absoluteImage =
    article.coverImage && article.coverImage.startsWith("http")
      ? article.coverImage
      : article.coverImage
      ? `${req.protocol}://${req.get("host")}${article.coverImage}`
      : "";

  res.send(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(article.title)}</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(article.title)}" />
  <meta property="og:description" content="${escapeHtml(article.summary)}" />
  <meta property="og:image" content="${absoluteImage}" />
  <meta property="og:url" content="${req.protocol}://${req.get("host")}${req.originalUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(article.title)}" />
  <meta name="twitter:description" content="${escapeHtml(article.summary)}" />
  <meta name="twitter:image" content="${absoluteImage}" />
</head>
<body></body>
</html>`);
});

// ২. Frontend Static Files (dist) সার্ভ করা
app.use(express.static(path.join(process.cwd(), "client", "dist")));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith("/api")) return next();

  res.sendFile(
    path.join(process.cwd(), "client", "dist", "index.html")
  );
});

// ===============================
// Global Error Handler
// ===============================
app.use(errorHandler);

// ===============================
// Start Server
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Server Running On http://localhost:${PORT}`);
});