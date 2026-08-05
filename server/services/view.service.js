import News from "../models/News.js";
import ViewLog from "../models/ViewLog.js";
import User from "../models/User.js"; // 🟢 User model import করা হলো

export const recordArticleViewService = async ({
  articleId,
  visitorHash,
  device,
  userId,
}) => {
  // ২৪ ঘণ্টার মধ্যে এই visitorHash দিয়ে ভিউ রেকর্ড আছে কিনা দেখা
  const existingLog = await ViewLog.findOne({ articleId, visitorHash });

  if (existingLog) {
    return { incremented: false, views: null };
  }

  // ১. নতুন View Log তৈরি
  await ViewLog.create({
    articleId,
    visitorHash,
    device,
    userId,
  });

  // ২. Atomic Increment (High Concurrency Safe)
  // author ফিল্ডটিও select করা হলো যাতে নিচে ওই ইউজারের প্রোফাইল আপডেট করা যায়
  const updatedNews = await News.findByIdAndUpdate(
    articleId,
    { $inc: { views: 1 } },
    { new: true, select: "views author" }
  );

  // ৩. সংবাদের লেখকের (Author) User.stats.totalViews ফিল্ডে ১ যোগ করা
  if (updatedNews?.author) {
    await User.findByIdAndUpdate(updatedNews.author, {
      $inc: { "stats.totalViews": 1 },
    });
  }

  return { incremented: true, views: updatedNews?.views || 0 };
};