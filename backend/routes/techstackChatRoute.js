// routes/techstackChatRoutes.js
import express from "express";
import { createSession } from "../services/techstackSessionStore.js";
import { handleImproveChat } from "../controllers/techstackChatController.js";
import { requireAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Create a session (only for 'improve' mode)
router.post("/start", requireAuth, (req, res) => {
  const { mode } = req.body;

  if (mode !== "improve") {
    return res.status(400).json({ error: "Only 'improve' mode supports chat" });
  }

  const sessionId = createSession(mode);
  res.json({ sessionId });
});

// Chat endpoint
router.post("/chat", requireAuth, handleImproveChat);

export default router;
// This route handles chat interactions for the 'improve' mode.
// It requires authentication and uses the session ID to manage chat history.