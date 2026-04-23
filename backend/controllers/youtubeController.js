const Influencer = require('../models/Influencer');
const { searchYouTubeInfluencers } = require('../scrapers/youtubeScraper');
const { analyzeInfluencer } = require('../services/aiService');

// ── Helper: AI analyze + save to DB ──────────────────────────────────
const analyzeAndSave = async (channel, niche, userId) => {
    const aiData = await analyzeInfluencer(
        {
            nickname:        channel.nickname,
            follower_count:  channel.follower_count,
            engagement_rate: channel.engagement_rate,
            total_videos:    channel.total_videos,
            platform:        'YouTube',
            niche:           channel.niche || niche,
            profile_url:     channel.profile_url,
        },
        { niche }
    );

    const finalScore = aiData?.score || aiData?.ai_score || 0;

    const saved = await Influencer.findOneAndUpdate(
        { profile_url: channel.profile_url },
        {
            ...channel,
            platform:     'YouTube',
            niche:        niche || channel.niche,
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
        console.log(`🎯 [YouTube Internal Search] Niche: ${niche}`);
        const ytChannels = await searchYouTubeInfluencers(niche);
        if (!ytChannels || ytChannels.length === 0) return [];

        const results = [];
        for (const channel of ytChannels.slice(0, 5)) {
            let influencer = await Influencer.findOne({ profile_url: channel.profile_url });

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
                influencer = await analyzeAndSave(channel, niche, userId);
                if (influencer) results.push(influencer);
            }
        }
        return results;
    } catch (error) {
        console.error("YouTube internalSearch Error:", error.message);
        return [];
    }
};

// ── Search By Niche (Frontend API) ────────────────────────────────────
exports.searchYTByNiche = async (req, res) => {
    try {
        const { keyword, niche, limit } = req.body;
        const userId = req.user?.id;  // ✅ logged-in user ka ID

        const finalKeyword = keyword || niche;

        if (!finalKeyword) {
            return res.status(400).json({ success: false, msg: "Keyword or niche is required!" });
        }

        const requestLimit = parseInt(limit) || 5;
        console.log(`🎯 [YT Search] Keyword: ${finalKeyword} | Limit: ${requestLimit}`);

        const ytChannels = await searchYouTubeInfluencers(finalKeyword);
        if (!ytChannels || ytChannels.length === 0) {
            return res.status(404).json({ success: false, msg: "No YouTube channels found." });
        }

        const finalResults = [];
        for (const channel of ytChannels.slice(0, requestLimit)) {
            let existing = await Influencer.findOne({ profile_url: channel.profile_url });

            if (existing && existing.ai_score > 0) {
                // Already analyzed — update createdBy agar missing ho
                if (!existing.createdBy && userId) {
                    existing = await Influencer.findByIdAndUpdate(
                        existing._id,
                        { createdBy: userId },
                        { new: true }
                    );
                }
                finalResults.push(existing);
            } else {
                const saved = await analyzeAndSave(channel, finalKeyword, userId);
                if (saved) finalResults.push(saved);
            }
        }

        res.json({
            success: true,
            meta: { total_processed: finalResults.length },
            data: finalResults
        });
    } catch (error) {
        console.error("❌ YT Controller Error:", error.message);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};