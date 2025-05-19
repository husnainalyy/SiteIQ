import express from 'express';
import { 
    generateSEORecommendations, 
    getAllSEORecommendations, 
    getSEORecommendationByWebsite, 
    deleteSEORecommendation 
} from '../controllers/seoRecommendation.controller.js';
import checkSubscriptionLimit from '../middleware/checkSubscriptionLimit.js';

const router = express.Router();

// Create (Generate recommendations)
router.post('/generate', checkSubscriptionLimit, generateSEORecommendations); // Apply middleware here

// Read (Get all recommendations for a user)
router.get('/:userId', checkSubscriptionLimit, getAllSEORecommendations); // Apply middleware here

// Read (Get recommendations for a specific website)
router.get('/:userId/:websiteUrl', checkSubscriptionLimit, getSEORecommendationByWebsite); // Apply middleware here

// Delete (Remove recommendations for a website)
router.delete('/:userId/:websiteUrl', checkSubscriptionLimit, deleteSEORecommendation); // Apply middleware here

export default router;
