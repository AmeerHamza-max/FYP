const mongoose = require('mongoose');
const Influencer = require('../models/Influencer');
const Campaign = require('../models/Campaign');

// ============================================================
// LOGIC:
// Sirf woh influencers dikhao jo is logged-in user ne
// khud banaye hain — createdBy: userId
//
// "All" tab → us user ke sare influencers
// "AI"  tab → unhi mein se jinke ai_score > 0, sorted by score
// ============================================================


// ─────────────────────────────────────────────────────────────
// @desc    Get All Influencers (sirf logged-in user ke apne)
// @route   GET /api/influencers
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getAllInfluencers = async (req, res) => {
    try {
        const { search, platform, niche, sortBy, type } = req.query;
        const userId = req.user?.id;

        // ── Step 1: Sirf is user ke influencers ──────────────────────
        let baseQuery = { createdBy: userId };

        // ── Step 2: AI tab — sirf jinke ai_score > 0 ─────────────────
        if (type === 'ai') {
            baseQuery.ai_score = { $gt: 0 };
        }

        // ── Step 3: Search ────────────────────────────────────────────
        if (search) {
            const regex = { $regex: search, $options: 'i' };
            baseQuery.$or = [
                { nickname: regex },
                { niche:    regex },
                { platform: regex },
            ];
        }

        // ── Step 4: Platform filter ───────────────────────────────────
        if (platform && platform !== 'All') {
            baseQuery.platform = platform;
        }

        // ── Step 5: Niche filter ──────────────────────────────────────
        if (niche && niche !== 'All') {
            baseQuery.niche = { $regex: niche, $options: 'i' };
        }

        // ── Step 6: Sort ──────────────────────────────────────────────
        let sortOption = { createdAt: -1 };
        if (sortBy === 'followers')    sortOption = { follower_count:  -1 };
        if (sortBy === 'ai_score')     sortOption = { ai_score:        -1 };
        if (sortBy === 'engagement')   sortOption = { engagement_rate: -1 };
        if (type === 'ai' && !sortBy)  sortOption = { ai_score:        -1 };

        // ── Step 7: Fetch ─────────────────────────────────────────────
        const influencers = await Influencer.find(baseQuery).sort(sortOption);

        res.status(200).json({
            success: true,
            count:   influencers.length,
            type:    type || 'all',
            data:    influencers
        });

    } catch (err) {
        console.error('getAllInfluencers error:', err);
        res.status(500).json({ success: false, msg: 'Data fetch failed' });
    }
};


// ─────────────────────────────────────────────────────────────
// @desc    Get Recommendations
// @route   GET /api/influencers/recommend
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getRecommendations = async (req, res) => {
    try {
        const { niche, platform } = req.query;
        const userId = req.user?.id;

        let query = { createdBy: userId };
        if (niche)                          query.niche    = { $regex: niche, $options: 'i' };
        if (platform && platform !== 'All') query.platform = platform;

        const results = await Influencer.find(query).sort({ ai_score: -1, follower_count: -1 });
        res.status(200).json({ success: true, data: results });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Recommendation error' });
    }
};


// ─────────────────────────────────────────────────────────────
// @desc    Get Single Influencer by ID
// @route   GET /api/influencers/:id
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getInfluencerById = async (req, res) => {
    try {
        const influencer = await Influencer.findById(req.params.id);
        if (!influencer) return res.status(404).json({ success: false, msg: 'Influencer nahi mila' });
        res.status(200).json({ success: true, data: influencer });
    } catch (err) {
        res.status(500).json({ success: false, msg: 'Server error' });
    }
};


// ─────────────────────────────────────────────────────────────
// @desc    ENTERPRISE ANALYTICS — Full Suite
// @route   GET /api/influencers/stats/analytics
// @access  Private
// ─────────────────────────────────────────────────────────────
exports.getInfluencerAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // ── 1. USER-SPECIFIC CAMPAIGNS ───────────────────────────────
        const userCampaigns = await Campaign.find({ businessId: userId })
            .populate('selectedInfluencers.influencerId');

        const totalCampaigns     = userCampaigns.length;
        const activeCampaigns    = userCampaigns.filter(c => c.status === 'Active').length;
        const completedCampaigns = userCampaigns.filter(c => c.status === 'Completed').length;
        const pendingCampaigns   = userCampaigns.filter(c => c.status === 'Pending').length;
        const totalBudget        = userCampaigns.reduce((sum, c) => sum + (Number(c.budget) || 0), 0);

        // ── 2. COMPLETION RATE ────────────────────────────────────────
        const completionRate = totalCampaigns > 0
            ? parseFloat(((completedCampaigns / totalCampaigns) * 100).toFixed(1))
            : 0;

        // ── 3. IS USER KE SARE INFLUENCERS ───────────────────────────
        const allUserInfluencers    = await Influencer.find({ createdBy: userId }).lean();
        const totalInfluencers      = allUserInfluencers.length;
        const aiAnalyzedInfluencers = allUserInfluencers.filter(inf => (inf.ai_score || 0) > 0);
        const totalAiInfluencers    = aiAnalyzedInfluencers.length;

        // ── 4. AVERAGE AI SCORE ───────────────────────────────────────
        const avgAiScore = totalAiInfluencers > 0
            ? parseFloat((
                aiAnalyzedInfluencers.reduce((sum, inf) => sum + (inf.ai_score || 0), 0) / totalAiInfluencers
              ).toFixed(1))
            : 0;

        // ── 5. AVERAGE ENGAGEMENT RATE ────────────────────────────────
        const engagementValues = allUserInfluencers
            .map(inf => parseFloat(String(inf.engagement_rate).replace('%', '')))
            .filter(v => !isNaN(v));

        const avgEngagementRate = engagementValues.length > 0
            ? parseFloat((engagementValues.reduce((a, b) => a + b, 0) / engagementValues.length).toFixed(2))
            : 0;

        // ── 6. TOTAL REACH ────────────────────────────────────────────
        const totalReach = allUserInfluencers.reduce((sum, inf) => sum + (inf.follower_count || 0), 0);

        // ── 7. ROI ESTIMATE ───────────────────────────────────────────
        const BASE_MULTIPLIER = 5.78;
        const aiBonus         = (avgAiScore / 100) * 1.5;
        const engagementBonus = (avgEngagementRate / 3) * 0.5;
        const reachBonus      = totalReach > 0 ? (Math.log10(Math.max(totalReach, 10)) / 7) : 0;

        let rawMultiplier = BASE_MULTIPLIER + aiBonus + engagementBonus + reachBonus;
        if (totalInfluencers === 0) rawMultiplier = 1.8;

        const finalMultiplier = Math.max(rawMultiplier, 1.2);
        const estimatedEMV    = totalBudget > 0 ? parseFloat((totalBudget * finalMultiplier).toFixed(2)) : 0;
        const estimatedROI    = totalBudget > 0 ? parseFloat((((estimatedEMV - totalBudget) / totalBudget) * 100).toFixed(1)) : 0;
        const roiMultiplier   = totalBudget > 0 ? parseFloat(finalMultiplier.toFixed(2)) : 0;

        // ── 8. COST PER INFLUENCER ────────────────────────────────────
        const costPerInfluencer = totalInfluencers > 0
            ? parseFloat((totalBudget / totalInfluencers).toFixed(2))
            : 0;

        // ── 9. PLATFORM BREAKDOWN ─────────────────────────────────────
        const campaignPlatformMap = {};
        userCampaigns.forEach(c => {
            const p = c.platform || 'Unknown';
            if (!campaignPlatformMap[p]) campaignPlatformMap[p] = { count: 0, budget: 0 };
            campaignPlatformMap[p].count++;
            campaignPlatformMap[p].budget += (Number(c.budget) || 0);
        });

        const infPlatformMap = {};
        allUserInfluencers.forEach(inf => {
            const p = inf.platform || 'Unknown';
            if (!infPlatformMap[p]) infPlatformMap[p] = { count: 0, totalFollowers: 0, totalEngagement: 0 };
            infPlatformMap[p].count++;
            infPlatformMap[p].totalFollowers += (inf.follower_count || 0);
            const eng = parseFloat(String(inf.engagement_rate).replace('%', ''));
            if (!isNaN(eng)) infPlatformMap[p].totalEngagement += eng;
        });

        const platformBreakdown = Object.entries(infPlatformMap).map(([platform, data]) => ({
            _id:             platform,
            platform,
            influencerCount: data.count,
            count:           data.count,
            totalFollowers:  data.totalFollowers,
            avgEngagement:   data.count > 0
                ? parseFloat((data.totalEngagement / data.count).toFixed(2))
                : 0
        }));

        const platformBreakdownFinal = platformBreakdown.length > 0
            ? platformBreakdown
            : Object.entries(campaignPlatformMap).map(([platform, d]) => ({
                _id: platform, platform, count: d.count, budget: d.budget,
            }));

        // ── 10. NICHE BREAKDOWN ───────────────────────────────────────
        const nicheMap = {};
        userCampaigns.forEach(c => {
            const n = c.niche || 'Unknown';
            if (!nicheMap[n]) nicheMap[n] = { campaigns: 0, budget: 0 };
            nicheMap[n].campaigns++;
            nicheMap[n].budget += (Number(c.budget) || 0);
        });

        const nicheBreakdown = Object.entries(nicheMap)
            .map(([niche, data]) => ({
                _id: niche, niche,
                count: data.campaigns, campaigns: data.campaigns,
                budget: data.budget,   totalBudget: data.budget,
            }))
            .sort((a, b) => b.budget - a.budget);

        // ── 11. CAMPAIGN STATUS DISTRIBUTION ─────────────────────────
        const statusDistribution = [
            { _id: 'Active',    name: 'Active',    value: activeCampaigns,    count: activeCampaigns,    color: '#22d3ee' },
            { _id: 'Completed', name: 'Completed', value: completedCampaigns, count: completedCampaigns, color: '#4ade80' },
            { _id: 'Pending',   name: 'Pending',   value: pendingCampaigns,   count: pendingCampaigns,   color: '#f59e0b' },
            {
                _id: 'Other', name: 'Other',
                value: Math.max(totalCampaigns - activeCampaigns - completedCampaigns - pendingCampaigns, 0),
                count: Math.max(totalCampaigns - activeCampaigns - completedCampaigns - pendingCampaigns, 0),
                color: '#6366f1'
            }
        ].filter(s => s.value > 0);

        // ── 12. TOP INFLUENCERS BY AI SCORE ──────────────────────────
        const topInfluencers = [...aiAnalyzedInfluencers]
            .sort((a, b) => (b.ai_score || 0) - (a.ai_score || 0))
            .slice(0, 5)
            .map(inf => ({
                id:              inf._id,
                nickname:        inf.nickname,
                platform:        inf.platform,
                avatar:          inf.avatar,
                ai_score:        inf.ai_score,
                follower_count:  inf.follower_count,
                engagement_rate: inf.engagement_rate,
                niche:           inf.niche,
                sentiment:       inf.sentiment,
                brand_fit:       inf.brand_fit
            }));

        // ── 13. BUDGET TREND ──────────────────────────────────────────
        const budgetTrend = [...userCampaigns]
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map(c => ({
                title:    c.title,
                name:     c.title,
                budget:   Number(c.budget) || 0,
                Budget:   Number(c.budget) || 0,
                platform: c.platform,
                niche:    c.niche,
                status:   c.status,
                date:     c.createdAt
            }));

        // ── 14. SENTIMENT BREAKDOWN ───────────────────────────────────
        const sentimentMap = {};
        allUserInfluencers.forEach(inf => {
            const s = inf.sentiment || 'Neutral';
            sentimentMap[s] = (sentimentMap[s] || 0) + 1;
        });
        const sentimentBreakdown = Object.entries(sentimentMap)
            .map(([sentiment, count]) => ({ _id: sentiment, sentiment, count }));

        // ── 15. BRAND FIT SCORE ───────────────────────────────────────
        const brandFitScoreMap = { 'Excellent': 5, 'Great': 4, 'Good': 3, 'Average': 2, 'Poor': 1 };
        const brandFitValues   = allUserInfluencers
            .map(inf => brandFitScoreMap[inf.brand_fit] || 0)
            .filter(v => v > 0);
        const avgBrandFitScore = brandFitValues.length > 0
            ? parseFloat((brandFitValues.reduce((a, b) => a + b, 0) / brandFitValues.length).toFixed(2))
            : 0;

        // ── 16. CAMPAIGN VELOCITY ─────────────────────────────────────
        const now    = new Date();
        const last30 = new Date(now - 30 * 24 * 60 * 60 * 1000);
        const prev30 = new Date(now - 60 * 24 * 60 * 60 * 1000);

        const recentCampaigns    = userCampaigns.filter(c => new Date(c.createdAt) >= last30).length;
        const previousCampaigns  = userCampaigns.filter(c => new Date(c.createdAt) >= prev30 && new Date(c.createdAt) < last30).length;
        const campaignGrowthRate = previousCampaigns > 0
            ? parseFloat((((recentCampaigns - previousCampaigns) / previousCampaigns) * 100).toFixed(1))
            : recentCampaigns > 0 ? 100 : 0;

        // ── FINAL RESPONSE ────────────────────────────────────────────
        res.status(200).json({
            success: true,
            kpi: {
                totalCampaigns,
                activeCampaigns,
                completedCampaigns,
                pendingCampaigns,
                totalBudget,
                totalInfluencers,
                totalAiInfluencers,
                totalReach,
                avgAiScore,
                avgEngagementRate,
                completionRate,
                estimatedEMV,
                estimatedROI,
                roiMultiplier,
                costPerInfluencer,
                avgBrandFitScore,
                campaignGrowthRate,
                recentCampaigns,
            },
            charts: {
                statusDistribution,
                platformBreakdown: platformBreakdownFinal,
                nicheBreakdown,
                budgetTrend,
                sentimentBreakdown,
                topInfluencers,
            }
        });

    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ success: false, msg: 'Analytics failed', error: err.message });
    }
};