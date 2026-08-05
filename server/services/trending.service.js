import News from "../models/News.js";

export const getTrendingNewsService = async (limit = 6) => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  return await News.aggregate([
    {
      $match: {
        status: "published",
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $addFields: {
        // দিনে আর্টিকেলের বয়স হিসাব করা
        ageInDays: {
          $divide: [
            { $subtract: [new Date(), "$createdAt"] },
            1000 * 60 * 60 * 24,
          ],
        },
      },
    },
    {
      $addFields: {
        // Freshness Multiplier নির্ধারণ
        freshnessMultiplier: {
          $cond: [
            { $lte: ["$ageInDays", 1] },
            1.0,
            {
              $cond: [
                { $lte: ["$ageInDays", 3] },
                0.8,
                {
                  $cond: [{ $lte: ["$ageInDays", 7] }, 0.6, 0.2],
                },
              ],
            },
          ],
        },
        // Raw Engagement Score
        rawScore: {
          $add: [
            { $ifNull: ["$views", 0] },
            { $multiply: [{ $ifNull: ["$commentsCount", 0] }, 5] },
            { $multiply: [{ $ifNull: ["$sharesCount", 0] }, 10] },
            { $multiply: [{ $ifNull: ["$bookmarksCount", 0] }, 8] },
          ],
        },
      },
    },
    {
      $addFields: {
        // Final Time-Decay Trending Score
        trendingScore: { $multiply: ["$rawScore", "$freshnessMultiplier"] },
      },
    },
    { $sort: { trendingScore: -1 } },
    { $limit: limit },
  ]);
};