import Notification from "../models/Notification.js";
import { getIO } from "../socket/index.js";

/**
 * @desc DB-তে notification save করে + connected থাকলে recipient-কে
 *       real-time push করে
 */
export const createNotification = async ({
  recipient,
  sender = null,
  type,
  title,
  message = "",
  link = "",
  relatedNews = null,
}) => {
  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    link,
    relatedNews,
  });

  await notification.populate([
    { path: "sender", select: "name username avatar" },
    { path: "relatedNews", select: "title slug category" },
  ]);

  try {
    getIO().to(recipient.toString()).emit("new_notification", notification);
  } catch (error) {
    // Socket layer down থাকলেও notification DB-তে save হয়ে গেছে —
    // user পরের বার login/refresh করলে REST list-এ পেয়ে যাবে।
    console.error("Socket emit failed:", error.message);
  }

  return notification;
};