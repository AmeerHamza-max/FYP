const Campaign = require('../models/Campaign');
const Influencer = require('../models/Influencer');
const User = require('../models/User'); // 🔥 ADDED (SaaS system)
const { analyzeInfluencer } = require('../services/aiService');
const tiktokCtrl = require('../controllers/tiktokScrapeController');
const youtubeCtrl = require('../controllers/youtubeController');


// 1. CREATE & PROCESS CAMPAIGN
exports.createCampaign = async (req, res) => {
    try {
        const { title, description, platform, budget, niche, deadline, tags } = req.body;
        const userId = req.user.id;

        // 🔥 SaaS LIMIT CHECK (ADDED - SAFE)
        const user = await User.findById(userId);

        if (user.plan === 'free' && user.campaignsUsed >= user.campaignLimit) {
            return res.status(403).json({
                success: false,
                msg: "🚫 Campaign limit reached. Please upgrade your plan."
            });
        }

        const newCampaign = await Campaign.create({
            businessId: userId,
            title,
            description,
            platform,
            budget,
            niche,
            deadline,
            tags: tags || []
        });

        let allScrapedData = [];
        const scrapeTasks = [];

        if (platform === 'TikTok' || platform === 'All')
            scrapeTasks.push(tiktokCtrl.internalSearch(niche, userId).catch(() => []));

        if (platform === 'YouTube' || platform === 'All')
            scrapeTasks.push(youtubeCtrl.internalSearch(niche, userId).catch(() => []));

        const scrapeResults = await Promise.all(scrapeTasks);
        scrapeResults.forEach(data => {
            if (Array.isArray(data)) allScrapedData.push(...data);
        });

        let processedInfluencers = [];

        for (let inf of allScrapedData) {
            try {
                const globalInf = await Influencer.findOneAndUpdate(
                    { profile_url: inf.profile_url },
                    {
                        ...inf,
                        last_updated: Date.now(),
                        $setOnInsert: { createdBy: userId }
                    },
                    { upsert: true, new: true }
                );

                if (!globalInf.createdBy) {
                    await Influencer.findByIdAndUpdate(globalInf._id, { createdBy: userId });
                }

                const aiData = await analyzeInfluencer(
                    {
                        nickname: inf.nickname || globalInf.nickname,
                        follower_count: inf.follower_count || globalInf.follower_count,
                        engagement_rate: inf.engagement_rate || globalInf.engagement_rate,
                        total_videos: inf.total_videos || globalInf.total_videos,
                        platform: inf.platform || globalInf.platform,
                        niche: inf.niche || niche,
                        profile_url: inf.profile_url,
                    },
                    { campaignTitle: title, niche }
                );

                const finalScore = aiData?.score || aiData?.ai_score || 0;

                await Influencer.findByIdAndUpdate(globalInf._id, {
                    ai_score: finalScore,
                    sentiment: aiData?.sentiment || 'Neutral',
                    brand_fit: aiData?.brand_fit || niche || 'General',
                    ai_summary: aiData?.summary || 'Analysis complete.',
                    createdBy: userId,
                });

                processedInfluencers.push({
                    influencerId: globalInf._id,
                    ai_score: finalScore,
                    ai_summary: aiData?.summary || 'Match found.',
                    match_reasoning: aiData?.reasoning || 'Based on engagement and niche fit.',
                    recommended_at: Date.now()
                });

            } catch (innerErr) {
                console.error(`❌ Influencer processing error [${inf.profile_url}]:`, innerErr.message);
                continue;
            }
        }

        const bestInfluencers = processedInfluencers
            .sort((a, b) => b.ai_score - a.ai_score)
            .slice(0, 3);

        const finalCampaign = await Campaign.findByIdAndUpdate(
            newCampaign._id,
            { $set: { selectedInfluencers: bestInfluencers } },
            { new: true }
        ).populate('selectedInfluencers.influencerId');

        // 🔥 INCREMENT USER USAGE (ADDED SAFE)
        await User.findByIdAndUpdate(userId, {
            $inc: { campaignsUsed: 1 }
        });

        res.status(201).json({ success: true, data: finalCampaign });

    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 2. GET SINGLE CAMPAIGN
exports.getCampaignById = async (req, res) => {
    try {
        const campaign = await Campaign.findById(req.params.id)
            .populate({
                path: 'selectedInfluencers.influencerId',
                model: 'Influencer',
                select: 'profile_username nickname avatar ai_score sentiment brand_fit ai_summary platform'
            });

        if (!campaign)
            return res.status(404).json({ success: false, msg: 'Campaign not found' });

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 3. GET ALL CAMPAIGNS
exports.getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ businessId: req.user.id })
            .select('-selectedInfluencers')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: campaigns });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 4. UPDATE CAMPAIGN
exports.updateCampaign = async (req, res) => {
    try {
        const updated = await Campaign.findOneAndUpdate(
            { _id: req.params.id, businessId: req.user.id },
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 5. UPDATE CAMPAIGN STATUS
exports.updateCampaignStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const updatedCampaign = await Campaign.findOneAndUpdate(
            { _id: req.params.id, businessId: req.user.id },
            { $set: { status } },
            { new: true }
        );

        if (!updatedCampaign)
            return res.status(404).json({ success: false, msg: "Campaign not found" });

        res.status(200).json({ success: true, data: updatedCampaign });

    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 6. DELETE CAMPAIGN
exports.deleteCampaign = async (req, res) => {
    try {
        await Campaign.findOneAndDelete({
            _id: req.params.id,
            businessId: req.user.id
        });

        res.status(200).json({ success: true, msg: "Deleted" });

    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};


// 7. GET ANALYTICS DATA
exports.getAnalyticsStats = async (req, res) => {
    try {
        const businessId = req.user.id;

        const stats = await Campaign.aggregate([
            { $match: { businessId: new Object(businessId) } },
            {
                $group: {
                    _id: null,
                    totalCampaigns: { $sum: 1 },
                    totalBudget: { $sum: "$budget" },
                    active: { $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] } },
                    pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    draft: { $sum: { $cond: [{ $not: ["$status"] }, 1, 0] } }
                }
            }
        ]);

        const platformDist = await Campaign.aggregate([
            { $match: { businessId: new Object(businessId) } },
            { $group: { _id: "$platform", count: { $sum: 1 } } }
        ]);

        const topCampaigns = await Campaign.find({ businessId })
            .select('title budget')
            .sort({ budget: -1 })
            .limit(5);

        const summary = stats[0] || {
            totalCampaigns: 0,
            totalBudget: 0,
            active: 0,
            pending: 0,
            completed: 0,
            draft: 0
        };

        const distribution = [
            { name: 'Active', value: summary.active, color: '#22d3ee' },
            { name: 'Pending', value: summary.pending, color: '#f59e0b' },
            { name: 'Completed', value: summary.completed, color: '#4ade80' },
            { name: 'Draft', value: summary.draft, color: '#a855f7' }
        ];

        res.status(200).json({
            success: true,
            summary,
            distribution,
            budgetData: topCampaigns,
            platformData: platformDist
        });

    } catch (err) {
        res.status(500).json({ success: false, msg: err.message });
    }
};