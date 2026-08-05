import express from "express";

import {
  getNavbarMenus,
  addNavbarMenu,
  updateNavbarMenu,
  deleteNavbarMenu,
  toggleNavbarMenu,
  reorderNavbarMenus,
} from "../controllers/navbarSetting.controller.js";

import {
  protect,
  authorize,
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ==============================
// Public Navbar
// ==============================

router.get("/", getNavbarMenus);


// ==============================
// Admin Navbar Management
// ==============================

router.use(protect);
router.use(authorize("admin"));


router.post("/", addNavbarMenu);

router.put("/:menuId", updateNavbarMenu);

router.delete("/:menuId", deleteNavbarMenu);

router.patch("/:menuId/toggle", toggleNavbarMenu);

router.patch("/reorder", reorderNavbarMenus);


export default router;