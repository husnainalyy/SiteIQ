import express from "express";
import { getTechStack } from "../controllers/techStackController.js";

const router = express.Router();
router.post("/recommend-techstack", getTechStack);
export default router;
