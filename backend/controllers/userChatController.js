//techstack user chat controller

// controllers/userChatController.js
import ChatSession from "../models/techstackChatModel.js";

export async function getUserChats(req, res) {
  const userId = req.auth?.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    const chats = await ChatSession.find({ userId }).sort({ lastAccessed: -1 });
    res.json({ chats });
  } catch (err) {
    console.error("Fetch chats error:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}
export async function deleteUserChat(req, res) {
  const { sessionId } = req.params;
  const userId = req.auth?.userId;

  if (!userId) return res.status(401).json({ error: "Unauthorized" });

  try {
    await ChatSession.deleteOne({ sessionId, userId });
    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
}