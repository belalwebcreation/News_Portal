import express from "express";
import { getPublicProfileByUsername } from "../controllers/publicProfileController.js";

const router = express.Router();

// লগইন ছাড়াই অ্যাক্সেসযোগ্য — তাই এখানে protect middleware নেই
router.get("/:username", getPublicProfileByUsername);

export default router;