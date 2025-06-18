// routes/seoRecommendation.routes.js

import express from 'express';

import mockClerkAuth from "../middleware/testclerkauth.js";
import checkSubscriptionLimit from '../middleware/checkSubscriptionLimit.js';
import incrementUsage from '../utils/incrementUsage.js';

import {
  generateSEORecommendations,
  generateLightHouseRecommendation,
  getAllRecommendations,
  getUserSeoRecommendations,
  updateRecommendation,
  deleteRecommendation,
} from '../controllers/seoRecommendation.controller.js';

const router = express.Router();

// Middleware to simulate authentication (for testing)
router.use(mockClerkAuth);

// CREATE (Generate recommendations) with usage limit + increment
router.post(
    '/generate/:websiteId',
    checkSubscriptionLimit('seo'),  
    async (req, res, next) => {
      await incrementUsage(req.auth.userId, 'seo');  // call utility
      next();
    },
    generateSEORecommendations
  );
  

router.post(
    '/generate-lighthouse',
    generateLightHouseRecommendation      
  );
  

// READ ALL recommendations for user
router.get('/all', getAllRecommendations);

// READ ONE recommendation by ID
router.get('/', getUserSeoRecommendations);

// UPDATE a recommendation by ID
router.put('/:id', updateRecommendation);

// DELETE a recommendation by ID
router.delete('/:id', deleteRecommendation);

export default router;
