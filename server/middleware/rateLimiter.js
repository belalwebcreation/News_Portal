import rateLimit from "express-rate-limit";

export const viewRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // ১ মিনিট
  max: 20, // প্রতি IP থেকে মিনিটে সর্বোচ্চ ২০টি view request
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many view requests. Please try again later.",
  },
});