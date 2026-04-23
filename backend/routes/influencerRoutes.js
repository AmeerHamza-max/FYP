const express = require('express');
const router = express.Router();
const { 
    getAllInfluencers, 
    getRecommendations, 
    getInfluencerById,
    getInfluencerAnalytics // <--- Sirf analytics ke liye ye import kiya
} = require('../controllers/Influencercontroller'); 
const auth = require('../middleware/auth');

// --- ANALYTICS ROUTE (SIRF YEH ADD KIYA HAI) ---
router.get('/stats/analytics', auth, getInfluencerAnalytics);

// GET /api/influencers/ - Sab influencers dekhne ke liye
router.get('/', auth, getAllInfluencers);

// GET /api/influencers/recommend?niche=&platform=&budget= - Recommendations
router.get('/recommend', auth, getRecommendations);

// GET /api/influencers/:id - SINGLE INFLUENCER DETAIL (Yeh zaroori hai)
router.get('/:id', auth, getInfluencerById);

module.exports = router;