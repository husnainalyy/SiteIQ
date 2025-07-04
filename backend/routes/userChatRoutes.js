//techstack user chats
import express from "express";
import {
  getUserChats,
  deleteUserChat,
  getChatHistory,
  addMessageToChat
} from "../controllers/userChatController.js";

const router = express.Router();

router.get("/chats", getUserChats);
router.delete("/chats/:id", deleteUserChat);

// Fetch full chat history (with messages)
router.get("/chats/:id", getChatHistory);

// Add a message to an existing chat
router.post("/chats/:id/messages", addMessageToChat);

export default router;
