// controllers/techstackChatController.js
import axios from "axios";
import dotenv from "dotenv";
import { getSession, sessionExists } from "../services/techstackSessionStore.js";
import ChatSession from "../models/techstackChatModel.js";

dotenv.config();

const OR_API_KEY = process.env.OPENROUTER_API_KEY?.trim();
const OR_MODEL_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function handleImproveChat(req, res) {
  const { message, sessionId } = req.body;
  const clerkUserId = req.auth?.userId; // Clerk user ID

  if (!message || !sessionId || !clerkUserId) {
    return res.status(400).json({ error: "Missing required fields or unauthenticated" });
  }

  if (!sessionExists(sessionId)) {
    return res.status(404).json({ error: "Session not found or expired" });
  }

  const session = getSession(sessionId);
  session.lastAccessed = Date.now();

  const contextPrompt = `
You are a helpful AI assistant helping improve existing websites.
Answer only questions related to:
- improving frontend/backend stack
- SEO and performance upgrades
- hosting, CI/CD, databases, DevOps tools
Ignore anything unrelated.
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

    // Save the chat session with Clerk User ID
    await ChatSession.findOneAndUpdate(
      { sessionId, clerkUserId },  // Use clerkUserId to link the chat session
      {
        clerkUserId,
        sessionId,
        mode: "improve",
        history: session.history,
        lastAccessed: Date.now()
      },
      { upsert: true }
    );

    res.json({ reply: aiReply });
  } catch (error) {
    console.error("AI chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "AI chat failed" });
  }
}
