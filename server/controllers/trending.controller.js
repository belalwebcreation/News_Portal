import { getTrendingNewsService } from "../services/trending.service.js";

/**
 * @desc    Get top trending articles based on dynamic engagement & freshness score
 * @route   GET /api/news/trending
 * @access  Public
 */
export const getTrending = async (req, res) => {
  try {
    // Query parameter থেকে limit নেওয়া (Default: 6)
    const limit = parseInt(req.query.limit, 10) || 6;

    // Service Layer-এ ডাটা প্রসেসিং ডেলিগেট করা
    const trendingArticles = await getTrendingNewsService(limit);

    return res.status(200).json({
      success: true,
      count: trendingArticles.length,
      data: trendingArticles,
    });
  } catch (error) {
    console.error("Error in getTrending controller:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending articles",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};