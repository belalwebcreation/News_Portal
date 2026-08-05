import express from "express";

import {
  getTopHeadline,
  updateTopHeadline,
  addHeadline,
  deleteHeadline,
  toggleHeadlineVisibility,
  uploadHeadlineImage,
  deleteHeadlineImage,
} from "../controllers/topHeadlineController.js";

import topHeadlineUpload from "../middleware/topHeadlineUpload.js";

// Future authentication middleware
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();


/*
|--------------------------------------------------------------------------
| Top Headline Management Routes
|--------------------------------------------------------------------------
*/


/**
 * @route   GET /api/top-headline
 * @desc    Get Top Headline data
 * @access  Public
 */
router.get(
  "/",
  getTopHeadline
);



/**
 * @route   PUT /api/top-headline
 * @desc    Update headline settings + items
 * @access  Admin
 */
router.put(
  "/",
  protect,
  adminOnly,
  updateTopHeadline
);



/**
 * @route   POST /api/top-headline
 * @desc    Add new headline item
 * @access  Admin
 */
router.post(
  "/",
  protect,
  adminOnly,
  addHeadline
);



/**
 * @route   DELETE /api/top-headline/:id
 * @desc    Delete headline item
 * @access  Admin
 */
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteHeadline
);



/**
 * @route   PATCH /api/top-headline/:id/toggle
 * @desc    Toggle headline visibility
 * @access  Admin
 */
router.patch(
  "/:id/toggle",
  protect,
  adminOnly,
  toggleHeadlineVisibility
);



/*
|--------------------------------------------------------------------------
| Cloudinary Image Management Routes
|--------------------------------------------------------------------------
*/


/**
 * @route   PUT /api/top-headline/:id/image
 * @desc    Upload / Replace headline image
 * @access  Admin
 */
router.put(
  "/:id/image",
  protect,
  adminOnly,
  topHeadlineUpload.single("image"),
  uploadHeadlineImage
);



/**
 * @route   DELETE /api/top-headline/:id/image
 * @desc    Delete headline image from Cloudinary
 * @access  Admin
 */
router.delete(
  "/:id/image",
  protect,
  adminOnly,
  deleteHeadlineImage
);



export default router;