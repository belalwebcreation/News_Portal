import express from "express";
import {
  getAllUsers,
  getUserById,
  getTopWriters,      // 👈 নতুন import
  promoteUser,
  demoteUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", authorize("admin", "superadmin"), getAllUsers);

router.get("/top-writers", authorize("admin", "superadmin"), getTopWriters);

// 👇 নতুন route — hover card-এর জন্য single user fetch
router.get("/:id", authorize("admin", "superadmin"), getUserById);

router.patch("/:id/promote", authorize("admin", "superadmin"), promoteUser);
router.patch("/:id/demote", authorize("superadmin"), demoteUser);
router.delete("/:id", authorize("admin", "superadmin"), deleteUser);

export default router;