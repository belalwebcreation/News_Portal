import { searchMentionUsersService } from "./mention.service.js";

/**
 * @desc    Search users for @mention suggestions
 * @route   GET /api/v1/mentions/users?q=belal
 * @access  Private
 */
export const searchUsersForMention = async (req, res) => {
  try {
    const { q, limit } = req.query;

    const users = await searchMentionUsersService(q, limit);

    return res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Mention user search error:", error);

    return res.status(500).json({
      success: false,
      message: "Mention user search failed",
    });
  }
};