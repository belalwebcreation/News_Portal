import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import dbConnect from "./server/utils/db.js";
import siteSettingRoutes from "./server/routes/siteSettingRoutes.js";
import path from "path";
import topHeadlineRoutes from "./server/routes/topHeadlineRoutes.js";

dotenv.config();

console.log("EMAIL_HOST:", process.env.EMAIL_HOST);
console.log("EMAIL_PORT:", process.env.EMAIL_PORT);

const app = express();

const PORT = process.env.PORT || 5000;

// Database
dbConnect();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Uploads
// app.use(
//   "/uploads",
//   express.static(path.join(process.cwd(), "server/uploads"))
// );

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/site-settings", siteSettingRoutes);
app.use("/api/top-headline", topHeadlineRoutes);


// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "News Portal API Running...",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server Running On http://localhost:${PORT}`);
});

