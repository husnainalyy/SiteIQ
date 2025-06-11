import express from "express";
import mockClerkAuth from "../middleware/testclerkauth.js";
import {
  generateAndScoreReport,
  deleteReport,
  returnReport,
  getSeoReports
} from '../controllers/seoController.js';

const router = express.Router(); 

router.use(mockClerkAuth);

router.post("/generate", generateAndScoreReport);   // body {domain, phrase}

router.delete("/delete/:jid", deleteReport); // params {jid} 

router.get("/return/:jid", returnReport);  // params {jid}

router.get("/websites/:websiteId", getSeoReports);
export default router;