const express = require("express");
const router = express.Router();
const { chatWithWebsite, getChatHistory } = require("../controllers/chatbotController");
const authenticateUserByClerkId = require("../middlewares/authenticateUserByClerkId");

// 💬 Chat with the AI about a website (Process user queries)
router.post("/chat", authenticateUserByClerkId, chatWithWebsite);

// 📜 Get previous chat history for a website
router.get("/history/:websiteUrl", authenticateUserByClerkId, getChatHistory);

module.exports = router;
