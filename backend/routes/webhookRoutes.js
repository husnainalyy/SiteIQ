import express from "express";
const router = express.Router();
import { handleClerkWebhook } from "../controllers/webhookController.js";


router.post('/clerk', handleClerkWebhook);

export default router; // ✅ Correct ES Modules export

