import express from "express";

import { protect } from "../../middleware/authMiddleware.js";
import { searchUsersForMention } from "./mention.controller.js";
import { validateMentionSearch } from "./mention.validation.js";

const router = express.Router();

/**
 * @route   GET /api/v1/mentions/users
 * @desc    Search users for @mention autocomplete
 * @access  Private
 *
 * Example:
 * GET /api/v1/mentions/users?q=belal&limit=8
 */
router.get(
  "/users",
  protect,
  validateMentionSearch,
  searchUsersForMention
);

export default router;