const Influencer = require('../models/Influencer');

// @desc    Get All Influencers (Live Feed)
// @route   GET /api/influencers
exports.getAllInfluencers = async (req, res) => {
    try {
        // Humne sort kiya hai taake naya scraped data hamesha TOP par aaye
        const influencers = await Influencer.find().sort({ last_updated: -1 });
        
        res.status(200).json({
            success: true,
            count: influencers.length,
            data: influencers
        });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Data fetch failed' });
    }
};

// @desc    Get Recommendations (AI logic)
exports.getRecommendations = async (req, res) => {
    try {
        const { niche, platform } = req.query;
        let query = {};
        if (niche) query.niche = { $regex: niche, $options: 'i' };
        if (platform && platform !== 'All') query.platform = platform;

        const results = await Influencer.find(query).sort({ follower_count: -1 });
        res.status(200).json(results);
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Recommendation error' });
    }
};