import express from "express";
import { handleChatMessage } from "../controllers/chatController.js";
import authenticateUserByClerkId from "../middleware/authenticateUserByClerkId.js";

const router = express.Router();

router.post("/chat", authenticateUserByClerkId, handleChatMessage);

export default router;
