import express from "express";
import { getUserChats, deleteUserChat } from "../controllers/userChatController.js";
import mockClerkAuth from "../middleware/testclerkauth.js"; // ✅ Add this

const router = express.Router();

router.use(mockClerkAuth); // ✅ Apply it to all routes
router.get("/chats", getUserChats);
router.delete("/chats/:id", deleteUserChat);

export default router;
