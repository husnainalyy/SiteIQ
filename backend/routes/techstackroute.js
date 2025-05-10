import express from "express";
import { recommendStack, improveStack } from "../controllers/techstackcontroller.js"
import mockClerkAuth from "../middleware/testclerkauth.js";
const router = express.Router();

router.use(mockClerkAuth);

router.post("/recommend", recommendStack);
router.post("/improve", improveStack);
export default router;
