/**
 * Validate mention search query
 *
 * Rules:
 * - q is optional
 * - Trim whitespace
 * - Maximum 50 characters
 * - Limit between 1 and 50
 */

export const validateMentionSearch = (req, res, next) => {
  let { q = "", limit = 8 } = req.query;

  // Normalize query
  q = String(q).trim();

  // Maximum search length
  if (q.length > 50) {
    return res.status(400).json({
      success: false,
      message: "Search query cannot exceed 50 characters.",
    });
  }

  // Normalize limit
  limit = Number(limit);

  if (Number.isNaN(limit)) {
    limit = 8;
  }

  // Clamp limit between 1 and 50
  limit = Math.min(Math.max(limit, 1), 50);

  // Store sanitized values
  req.query.q = q;
  req.query.limit = limit;

  next();
};