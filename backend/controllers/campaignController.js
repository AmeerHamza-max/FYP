const Campaign = require('../models/Campaign');

// @desc   Create Campaign
// @route  POST /api/campaigns/create
exports.createCampaign = async (req, res) => {
  try {
    const { title, description, platform, budget, niche, deadline, tags } = req.body;
    
    const newCampaign = new Campaign({
      businessId: req.user.id, 
      title, 
      description, 
      platform, 
      budget, 
      niche, 
      deadline,
      tags
    });

    await newCampaign.save();
    res.status(201).json({ success: true, data: newCampaign });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @desc   Get All Campaigns (With Auto-Status Update & Filters)
// @route  GET /api/campaigns/
exports.getCampaigns = async (req, res) => {
  try {
    const { search, status, platform } = req.query;
    const currentDate = new Date();

    // STEP 1: Pehle database mein un campaigns ko 'Completed' mark karo jinki deadline guzar chuki hai
    // Hum sirf is user ki campaigns ko update karenge
    await Campaign.updateMany(
      { 
        businessId: req.user.id,
        deadline: { $lt: currentDate }, 
        status: { $ne: "Completed" } 
      },
      { $set: { status: "Completed" } }
    );

    // STEP 2: Ab filters apply karo
    let query = { businessId: req.user.id };

    if (search) {
      query.title = { $regex: search, $options: 'i' }; 
    }
    if (status && status !== 'All') {
      query.status = status;
    }
    if (platform && platform !== 'All') {
      query.platform = platform;
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });
    res.status(200).json(campaigns);
  } catch (err) {
    res.status(500).json({ success: false, msg: "Failed to fetch campaigns" });
  }
};

// @desc   Get Single Campaign
// @route  GET /api/campaigns/:id
exports.getCampaignById = async (req, res) => {
  try {
    // Single campaign fetch karte waqt bhi check kar lete hain agar deadline guzar gayi ho
    const campaign = await Campaign.findOne({ _id: req.params.id, businessId: req.user.id });
    
    if (!campaign) return res.status(404).json({ success: false, msg: 'Campaign not found' });

    // Agar deadline nikal gayi aur status abhi tak Completed nahi hai
    if (new Date(campaign.deadline) < new Date() && campaign.status !== "Completed") {
        campaign.status = "Completed";
        await campaign.save();
    }
    
    res.status(200).json(campaign);
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @desc   Update Campaign
// @route  PUT /api/campaigns/:id
exports.updateCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndUpdate(
      { _id: req.params.id, businessId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!campaign) return res.status(404).json({ success: false, msg: 'Campaign not found' });
    
    res.status(200).json({ success: true, data: campaign });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};

// @desc   Delete Campaign
// @route  DELETE /api/campaigns/:id
exports.deleteCampaign = async (req, res) => {
  try {
    const campaign = await Campaign.findOneAndDelete({ _id: req.params.id, businessId: req.user.id });

    if (!campaign) return res.status(404).json({ success: false, msg: 'Campaign not found' });
    
    res.status(200).json({ success: true, msg: 'Campaign deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, msg: err.message });
  }
};