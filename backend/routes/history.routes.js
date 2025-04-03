import express from 'express';
import { getUserHistory, getWebsiteHistory, clearUserHistory, deleteHistoryEntry } from "../controllers/history.controller.js"; 

const router = express.Router();

// ✅ Get full history for a user
router.get("/:userId", getUserHistory);

// ✅ Get history for a specific website
router.get("/:userId/:websiteUrl", getWebsiteHistory);

// ✅ Clear all history for a user
router.delete("/:userId/clear", clearUserHistory);

// ✅ Delete a specific history entry
router.delete("/:userId/:historyId", deleteHistoryEntry);

export default router;
