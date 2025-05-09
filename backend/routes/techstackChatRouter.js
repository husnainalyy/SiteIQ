import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import { createSession, getSession, sessionExists } from "../services/techstackSessionStore.js";

dotenv.config();

const router = express.Router();
const OR_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const OR_MODEL_URL = "https://openrouter.ai/api/v1/chat/completions";

// Initial entry point for new session
router.post("/start", (req, res) => {
  const { mode } = req.body;

  if (!mode || !["recommend", "improve"].includes(mode)) {
    return res.status(400).json({ error: "Mode must be 'recommend' or 'improve'" });
  }

  const sessionId = createSession(mode);
  res.json({ sessionId });
});

// Chat endpoint
router.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!message || !sessionId) {
    return res.status(400).json({ error: "Missing message or sessionId" });
  }

  if (!sessionExists(sessionId)) {
    return res.status(404).json({ error: "Session not found or expired" });
  }

  const session = getSession(sessionId);
  session.createdAt = Date.now(); // refresh session timeout

  const contextPrompt = `
You are a helpful AI assistant for a platform that recommends tech stacks for websites.
Only answer questions related to:
- frontend/backend stack choices
- SEO and performance strategies
- hosting, CI/CD, DevOps, databases
Do not answer personal, irrelevant, or unrelated questions.
Current Mode: ${session.mode === "recommend" ? "New Website Planning" : "Improving Existing Website"}
`;

  const messages = [
    { role: "system", content: contextPrompt },
    ...session.history,
    { role: "user", content: message }
  ];

  try {
    const response = await axios.post(
      OR_MODEL_URL,
      {
        model: "mistralai/mistral-7b-instruct",
        messages,
        temperature: 0.7,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: `Bearer ${OR_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiReply = response.data.choices[0].message.content;
    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: aiReply });

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("Chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "AI chat failed" });
  }
});

export default router;
