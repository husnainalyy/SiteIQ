import express from 'express';
import {
  getUserHistory,
  getWebsiteHistory,
  clearUserHistory,
  deleteHistoryEntry
} from "../controllers/history.controller.js";

const router = express.Router();

// ✅ Get full history for a user
router.get("/:userId", getUserHistory);

// ✅ Clear all history for a user
router.delete("/:userId/clear", clearUserHistory);

// ✅ Delete a specific history entry (by historyId)
router.delete("/:userId/history/:historyId", deleteHistoryEntry);

// ✅ Get history for a specific website
router.get("/:userId/website/:websiteUrl", getWebsiteHistory);

export default router;
