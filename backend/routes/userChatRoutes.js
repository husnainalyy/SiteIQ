// routes/userChatRoutes.js
import express from "express";
import { getUserChats } from "../controllers/userChatController.js";

const router = express.Router();

router.get("/chats",  getUserChats);

export default router;
