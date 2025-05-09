import express from "express";
import { recommendStack, improveStack } from "../controllers/techstackcontroller.js"
const router = express.Router();
router.post("/recommend", recommendStack);
router.post("/improve", improveStack);
export default router;
