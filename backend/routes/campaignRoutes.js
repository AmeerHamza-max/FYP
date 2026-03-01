const express = require('express');
const router = express.Router();
const {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign
} = require('../controllers/campaignController');
const auth = require('../middleware/auth');

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

module.exports = router;