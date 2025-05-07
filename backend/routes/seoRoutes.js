import express from "express";
import {
  createNewReport,
  getExistingReport,
  scorePhrase,
  deleteReport,
  returnReport
} from '../controllers/seoController.js';

const router = express.Router(); 
// /api/seoreports


/**
 * @swagger
 * /api/seoreports/create:
 *   post:
 *     summary: Create a new SEO report
 *     tags: [SEO Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phrase:
 *                 type: string
 *                 example: "best coffee shops"
 *               location:
 *                 type: string
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 reportId:
 *                   type: string
 */
router.post("/create", createNewReport);   // body {domain, phrase}
/** 
 * @swagger
 * /api/seoreports/tempget/:jid
 *  get:
 *    summary:
 *    tags: [SEO Reports]
 *  
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */
router.get("/tempget/:jid", getExistingReport); // param {jid}

router.post("/score", scorePhrase); // body {jid, phrase, domain}

router.delete("/delete/:jid", deleteReport); // params {jid} 

router.get("/return/:jid", returnReport);  // params {jid}

export default router;
