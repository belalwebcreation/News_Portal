import mongoose from "mongoose";
import User from "../models/User.js";
import Category from "../models/categoryModel.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/index.js";

/**
 * @desc নতুন publish হওয়া আর্টিকেলের জন্য সব active user-কে (author +
 *       actor বাদে) একটা করে notification পাঠায় — DB-তে bulk insert +
 *       real-time socket push দুটোই করে।
 */
export const broadcastNewArticlePublished = async (news, actorId) => {
  // নিজের আর্টিকেল নিজেকে জানানো অর্থহীন, আর যে admin approve/publish
  // করলো সেও তো এমনিতেই জানে — দুজনকেই বাদ দেওয়া হচ্ছে।
  const excludedIds = [
    ...new Set(
      [news.author?.toString(), actorId?.toString()].filter(Boolean)
    ),
  ];

  const recipients = await User.find({
    isActive: true,
    _id: { $nin: excludedIds },
    // ইউজার নিজে push notification বন্ধ রাখলে সেটা respect করা হচ্ছে
    "notificationSettings.push": { $ne: false },
  })
    .select("_id")
    .lean();

  if (recipients.length === 0) return;

  const category = await Category.findById(news.category)
    .select("slug")
    .lean();

  // navigate() basename-aware ("/news" prefix নিজে থেকেই যোগ হয়ে যায়),
  // তাই এখানে "/news" লেখা লাগবে না — App.jsx-এর
  // path="/:categorySlug/:slug" route-এর সাথে মিলিয়ে বানানো হলো।
 const link = category ? `/${category.slug}/${news._id}` : "/";

  const now = new Date();

  const docs = recipients.map((user) => ({
    _id: new mongoose.Types.ObjectId(),
    recipient: user._id,
    sender: actorId || null,
    type: "new_article",
    title: "নতুন আর্টিকেল প্রকাশিত হয়েছে",
    message: `"${news.title}" এখন পড়ার জন্য প্রস্তুত।`,
    link,
    relatedNews: news._id,
    isRead: false,
    createdAt: now,
    updatedAt: now,
  }));

  // একবারেই bulk insert — হাজার হাজার user থাকলেও একটাই DB round-trip
  await Notification.insertMany(docs, { ordered: false });

  try {
    const io = getIO();

    // প্রতিটা doc-এর _id আগে থেকেই generate করা আছে বলে আলাদা করে DB
    // থেকে populate/fetch না করেই সরাসরি emit করা যাচ্ছে
    docs.forEach((doc) => {
      io.to(doc.recipient.toString()).emit("new_notification", doc);
    });
  } catch (error) {
    console.error("Broadcast socket emit failed:", error.message);
  }
};