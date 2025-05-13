import express from "express";
import {
  createNewReport,
  getExistingReport,
  scorePhrase,
  deleteReport,
  returnReport
} from '../controllers/seoController.js';

const router = express.Router(); 
const mockClerkAuth = (req, res, next) => {
  // Simulating Clerk authentication
  req.auth = { 
    clerkUserId: "clerk_user_123456" // Your test user ID
  };

  next();
};
router.use(mockClerkAuth);
router.post("/create", createNewReport);   // body {domain, phrase}

router.get("/tempget/:jid", getExistingReport); // param {jid}

router.post("/score", scorePhrase); // body {jid, phrase, domain}

router.delete("/delete/:jid", deleteReport); // params {jid} 

router.get("/return/:jid", returnReport);  // params {jid}

export default router;
