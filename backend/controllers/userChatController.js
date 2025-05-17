//TECHSTACK CHAT CONTROLLER
// This controller handles user chat functionalities such as fetching and deleting user chats.
// controllers/userChatController.js
import Conversation from "../models/techstackChatModel.js"; // ✅ Updated model name

export async function getUserChats(req, res) {
  const clerkUserId = req.auth?.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const chats = await Conversation.find({ clerkUserId }).sort({ lastUpdated: -1 });
    if (!chats.length) {
      return res.status(404).json({ message: "No conversations found" });
    }

    res.json({ chats });
  } catch (err) {
    console.error("Fetch chats error:", err.message);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
}

export async function deleteUserChat(req, res) {
  const { id } = req.params; // MongoDB ObjectId
  const clerkUserId = req.auth?.userId;

  if (!clerkUserId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const result = await Conversation.deleteOne({ _id: id, clerkUserId });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json({ message: "Chat deleted successfully" });
  } catch (err) {
    console.error("Delete chat error:", err.message);
    res.status(500).json({ error: "Failed to delete chat" });
  }
}
