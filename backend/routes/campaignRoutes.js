const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  updateCampaignStatus,
  getAnalyticsStats // <--- SIRF YEH ADD KIYA HAI IMPORT MEIN
} = require('../controllers/campaignController');
const auth = require('../middleware/auth');

// --- NEW ANALYTICS ROUTE ---
// Isse /:id se pehle rakha hai taake conflict na ho
router.get('/stats/analytics', auth, getAnalyticsStats); 

// 1. Create Campaign
router.post('/create', auth, createCampaign);

// 2. Get All Campaigns (Search & Filters)
router.get('/', auth, getCampaigns);

// 3. Get Single Campaign
router.get('/:id', auth, getCampaignById);

// 4. Update Campaign
router.put('/:id', auth, updateCampaign);

// 5. Delete Campaign (FIXED LINE)
router.delete('/:id', auth, deleteCampaign);

// Aapka pehle wala status route (No changes here)
router.patch('/campaign/:id/status', updateCampaignStatus);

module.exports = router;