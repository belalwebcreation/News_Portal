import News from "../models/News.js";

// Home page NewsSection এর জন্য slot limits — center সবচেয়ে বেশি viewed পাবে,
// তারপর left, বাকিটা right। প্রয়োজনমতো সংখ্যা বদলে নিও।
const LAYOUT_LIMITS = {
  centerFeatured: 1,
  centerCard: 4,
  centerText: 4,
  leftFeatured: 1,
  leftImage: 3,
  leftText: 3,
  right: 5,
};

/**
 * @desc  Views অনুযায়ী rank করে news কে left/center/right এ ভাগ করে দেয়।
 *        Tie হলে (views সমান) নতুন post আগে (createdAt DESC)।
 * @route GET /api/news/section-layout
 */
export const getNewsSectionLayout = async (req, res, next) => {
  try {
    const totalNeeded = Object.values(LAYOUT_LIMITS).reduce((a, b) => a + b, 0);

    // শুধু published news — DB level এ views দিয়ে sort, tie-break createdAt দিয়ে
    const rankedNews = await News.find({ status: "published" })
      .select("-content")
      .populate("category", "name slug")
      .populate({
        path: "author",
        select: "name email role profileImage",
        populate: { path: "profileImage", select: "url alt width height" },
      })
      .populate(
        "thumbnail.media",
        "url cloudinaryPublicId alt caption credit width height mimeType"
      )
      .sort({ views: -1, createdAt: -1 })
      .limit(totalNeeded);

    let cursor = 0;
    const take = (count) => rankedNews.slice(cursor, (cursor += count));

    const center = {
      featured: take(LAYOUT_LIMITS.centerFeatured)[0] || null,
      cardNews: take(LAYOUT_LIMITS.centerCard),
      textNews: take(LAYOUT_LIMITS.centerText),
    };

    const left = {
      featured: take(LAYOUT_LIMITS.leftFeatured)[0] || null,
      imageNews: take(LAYOUT_LIMITS.leftImage),
      textNews: take(LAYOUT_LIMITS.leftText),
    };

    const right = take(LAYOUT_LIMITS.right);

    return res.status(200).json({
      success: true,
      data: { left, center, right },
    });
  } catch (error) {
    next(error);
  }
};