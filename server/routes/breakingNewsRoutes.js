import express from "express";
import {
  getBreakingNews,
  updateBreakingNews,
  addBreakingNews,
  deleteBreakingNews,
  toggleBreakingNewsVisibility,
} from "../controllers/breakingNewsController.js";

const router = express.Router();

/*
-----------------------------------------
GET Breaking News
-----------------------------------------
*/
router.get("/", getBreakingNews);

/*
-----------------------------------------
UPDATE Whole Breaking News
-----------------------------------------
*/
router.put("/", updateBreakingNews);

/*
-----------------------------------------
ADD New Breaking News
-----------------------------------------
*/
router.post("/", addBreakingNews);

/*
-----------------------------------------
DELETE Breaking News
-----------------------------------------
*/
router.delete("/:id", deleteBreakingNews);

/*
-----------------------------------------
TOGGLE Visibility
-----------------------------------------
*/
router.patch("/:id/visibility", toggleBreakingNewsVisibility);

export default router;