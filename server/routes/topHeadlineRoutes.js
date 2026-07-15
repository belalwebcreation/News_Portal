import express from "express";

import {
  getTopHeadline,
  updateTopHeadline,
  addHeadline,
  deleteHeadline,
  toggleHeadlineVisibility,
} from "../controllers/topHeadlineController.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Top Headline
|--------------------------------------------------------------------------
*/

// Get Top Headline
router.get("/", getTopHeadline);

// Update All Settings
router.put("/", updateTopHeadline);

// Add Headline
router.post("/", addHeadline);

// Delete Headline
router.delete("/:id", deleteHeadline);

// Toggle Visibility
router.patch("/:id/toggle", toggleHeadlineVisibility);

export default router;