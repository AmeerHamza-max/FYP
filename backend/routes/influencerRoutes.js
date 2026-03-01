const express = require('express');
const router = express.Router();
const { getAllInfluencers, getRecommendations } = require('../controllers/Influencercontroller');
const auth = require('../middleware/auth');

// GET /api/influencers/
router.get('/', auth, getAllInfluencers);

// GET /api/influencers/recommend?niche=&platform=&budget=
router.get('/recommend', auth, getRecommendations);

module.exports = router;