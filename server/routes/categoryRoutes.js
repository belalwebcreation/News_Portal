import { Router } from "express";
import {
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import asyncHandler from "../middleware/asyncHandler.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import validate from "../middleware/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";

const router = Router();

// Public
router.get("/", asyncHandler(listCategories));

// Admin
router.post(
  "/",
  protect,
  authorize("admin"),
  validate(createCategorySchema),
  asyncHandler(createCategory)
);

router.put(
  "/:id",
  protect,
  authorize("admin"),
  validate(updateCategorySchema),
  asyncHandler(updateCategory)
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(deleteCategory)
);

export default router;