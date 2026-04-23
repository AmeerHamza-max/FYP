const Influencer = require('../models/Influencer');
const { scrapeTikTokDeep, searchInfluencersByKeyword } = require('../scrapers/tiktokScraper');
const { analyzeInfluencer } = require('../services/aiService');

// ── Helper: AI analyze + save to DB ──────────────────────────────────
const analyzeAndSave = async (rawData, niche, userId) => {
    const aiData = await analyzeInfluencer(
        {
            nickname:        rawData.nickname,
            follower_count:  rawData.follower_count,
            engagement_rate: rawData.engagement_rate,
            total_videos:    rawData.total_videos,
            platform:        rawData.platform || 'TikTok',
            niche:           rawData.niche || niche,
            profile_url:     rawData.profile_url,
        },
        { niche }
    );

    const finalScore = aiData?.score || aiData?.ai_score || 0;

    const saved = await Influencer.findOneAndUpdate(
        { profile_url: rawData.profile_url },
        {
            ...rawData,
            platform:     'TikTok',
            niche:        niche || rawData.niche,
            ai_score:     finalScore,
            sentiment:    aiData?.sentiment  || 'Neutral',
            brand_fit:    aiData?.brand_fit  || niche || 'General',
            ai_summary:   aiData?.summary    || 'Analysis complete.',
            last_updated: Date.now(),
            // ✅ createdBy — jo user ne search kiya usi ka ID
            ...(userId && { createdBy: userId }),
        },
        { upsert: true, new: true }
    );

    return saved;
};

// ── Internal Search for Campaign Dispatcher ───────────────────────────
exports.internalSearch = async (niche, userId) => {
    try {
        console.log(`🎯 [TikTok Internal Search] Niche: ${niche}`);
        const usernames = await searchInfluencersByKeyword(niche);
        if (!usernames || usernames.length === 0) return [];

        const results = [];
        for (const user of usernames.slice(0, 5)) {
            const cleanUser = user.toLowerCase().trim();

            let influencer = await Influencer.findOne({ profile_username: cleanUser });

            if (influencer && influencer.ai_score > 0) {
                // Already analyzed — update createdBy agar missing ho
                if (!influencer.createdBy && userId) {
                    influencer = await Influencer.findByIdAndUpdate(
                        influencer._id,
                        { createdBy: userId },
                        { new: true }
                    );
                }
                results.push(influencer);
            } else {
                const freshData = await scrapeTikTokDeep(cleanUser);
                if (freshData) {
                    influencer = await analyzeAndSave(freshData, niche, userId);
                    if (influencer) results.push(influencer);
                }
            }
        }
        return results;
    } catch (error) {
        console.error("TikTok internalSearch Error:", error.message);
        return [];
    }
};

// ── Smart Sync ────────────────────────────────────────────────────────
exports.syncTikTokData = async (req, res) => {
    try {
        const { username } = req.body;
        const userId = req.user?.id;  // ✅ logged-in user ka ID

        if (!username) return res.status(400).json({ success: false, msg: "Username is required" });

        const cleanUsername = username.toLowerCase().trim().replace('@', '');

        // Cache check — 24 hours
        const existing = await Influencer.findOne({ profile_username: cleanUsername });
        if (existing) {
            const hoursSince = (new Date() - new Date(existing.last_updated)) / (1000 * 60 * 60);
            if (hoursSince < 24) {
                return res.json({ success: true, source: "cache", data: existing });
            }
        }

        const freshData = await scrapeTikTokDeep(cleanUsername);
        if (!freshData) return res.status(404).json({ success: false, msg: "Influencer not found" });

        const updated = await analyzeAndSave(freshData, freshData.niche || '', userId);
        res.json({ success: true, source: "api_refresh_with_ai", data: updated });

    } catch (error) {
        console.error("Sync Error:", error.message);
        res.status(500).json({ success: false, msg: "Failed to sync" });
    }
};

// ── Niche Search ──────────────────────────────────────────────────────
exports.searchByNiche = async (req, res) => {
    try {
        const { keyword } = req.body;
        const userId = req.user?.id;  // ✅ logged-in user ka ID

        if (!keyword) return res.status(400).json({ success: false, msg: "Keyword required" });

        const normalizedKeyword = keyword.trim().toLowerCase();
        const usernames = await searchInfluencersByKeyword(normalizedKeyword);

        if (!usernames || usernames.length === 0) {
            const fallback = await Influencer.find({
                platform: "TikTok",
                niche: new RegExp(normalizedKeyword, 'i'),
                createdBy: userId   // ✅ sirf is user ke influencers
            }).limit(15);
            return res.json({ success: true, source: "database_fallback", data: fallback });
        }

        const finalInfluencers = [];
        for (const user of usernames.slice(0, 7)) {
            const cleanUser = user.toLowerCase();
            let influencer = await Influencer.findOne({ profile_username: cleanUser });

            if (influencer && influencer.ai_score > 0) {
                // Already analyzed — update createdBy agar missing ho
                if (!influencer.createdBy && userId) {
                    influencer = await Influencer.findByIdAndUpdate(
                        influencer._id,
                        { createdBy: userId },
                        { new: true }
                    );
                }
                finalInfluencers.push(influencer);
            } else {
                const freshData = await scrapeTikTokDeep(cleanUser);
                if (freshData) {
                    const saved = await analyzeAndSave(freshData, normalizedKeyword, userId);
                    if (saved) finalInfluencers.push(saved);
                }
            }
        }

        res.json({ success: true, data: finalInfluencers });
    } catch (error) {
        console.error("TikTok Search Error:", error.message);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};