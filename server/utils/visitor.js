import crypto from "crypto";

export const generateVisitorHash = (ip, userAgent, acceptLanguage = "") => {
  const rawString = `${ip}-${userAgent}-${acceptLanguage}`;
  return crypto.createHash("sha256").update(rawString).digest("hex");
};

export const detectDevice = (userAgent = "") => {
  const ua = userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return "tablet";
  if (/mobile|iphone|android|touch/i.test(ua)) return "mobile";
  return "desktop";
};