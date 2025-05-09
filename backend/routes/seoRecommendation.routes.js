import express from 'express';
import { 
    generateSEORecommendations, 
    getAllSEORecommendations, 
    getSEORecommendationByWebsite, 
    deleteSEORecommendation 
} from '../controllers/seoRecommendation.controller.js';

const router = express.Router();

// Create (Generate recommendations)
router.post('/generate', generateSEORecommendations);

// Read (Get all recommendations for a user)
router.get('/:userId', getAllSEORecommendations);

// Read (Get recommendations for a specific website)
router.get('/:userId/:websiteUrl', getSEORecommendationByWebsite);

// Delete (Remove recommendations for a website)
router.delete('/:userId/:websiteUrl', deleteSEORecommendation);

export default router;
