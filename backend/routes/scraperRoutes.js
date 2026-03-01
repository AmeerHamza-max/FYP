const express = require('express');
const router = express.Router();

// 🧠 Controllers Import
const tiktokCtrl = require('../controllers/tiktokScrapeController');
const youtubeCtrl = require('../controllers/youtubeController');
const instagramCtrl = require('../controllers/instagramController'); // 🆕 Added Instagram Controller

/**
 * 📱 TIKTOK SCRAPER ROUTES
 * Limit: 7 New Profiles per search
 */
// @route   POST /api/scraper/tiktok/search
router.post('/tiktok/search', tiktokCtrl.searchByNiche);

// @route   POST /api/scraper/tiktok/sync
router.post('/tiktok/sync', tiktokCtrl.syncTikTokData);


/**
 * 📸 INSTAGRAM SCRAPER ROUTES (Adrian Scraper API)
 * Limit: 7 New Profiles per search
 */
// @route   POST /api/scraper/instagram/search
// Description: Search influencers by niche/keyword
router.post('/instagram/search', instagramCtrl.searchInstaByNiche);

// @route   POST /api/scraper/instagram/sync
// Description: Sync/Update specific profile data using username
router.post('/instagram/sync', instagramCtrl.syncInstagramData);


/**
 * 🎥 YOUTUBE SCRAPER ROUTES (OFFICIAL API)
 * Limit: 5-10 Channels per search
 */
// @route   POST /api/scraper/youtube/search
router.post('/youtube/search', youtubeCtrl.searchYTByNiche);


module.exports = router;