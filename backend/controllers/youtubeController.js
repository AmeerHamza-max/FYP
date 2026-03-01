const Influencer = require('../models/Influencer');
const { searchYouTubeInfluencers } = require('../scrapers/youtubeScraper');

/**
 * FEATURE: YouTube Niche Search
 * Official API se data nikal kar DB mein save karna (with accurate Engagement Rate)
 */
exports.searchYTByNiche = async (req, res) => {
    try {
        const { keyword, niche, limit } = req.body;
        // Agar keyword nahi hai to niche check karein
        const finalKeyword = keyword || niche;

        if (!finalKeyword) {
            return res.status(400).json({ 
                success: false, 
                msg: "Bhai, keyword ya niche dena zaroori hai!" 
            });
        }

        // Default limit 5 rakhi hai agar request mein na ho
        const requestLimit = parseInt(limit) || 5;

        console.log(`🎯 [YT Search] Keyword: ${finalKeyword} | Limit: ${requestLimit}`);

        // Step 1: Scraper call karein (Scraper ab API se real-time engagement nikal raha hai)
        const ytChannels = await searchYouTubeInfluencers(finalKeyword);

        if (!ytChannels || ytChannels.length === 0) {
            return res.status(404).json({ 
                success: false, 
                msg: "Koi YouTube channel nahi mila ya API quota khatam ho gaya." 
            });
        }

        const finalResults = [];

        // Step 2: Data ko Database mein Save ya Update (Upsert) karna
        // Scraper jitne laya hai aur requestLimit, dono mein se jo chhota ho utne hi chalayein
        const recordsToProcess = Math.min(ytChannels.length, requestLimit);

        for (let i = 0; i < recordsToProcess; i++) {
            const channel = ytChannels[i];

            // profile_url unique hai, uski basis par upsert karein
            const savedChannel = await Influencer.findOneAndUpdate(
                { profile_url: channel.profile_url },
                { 
                    ...channel,
                    // Niche ko format karke update karein
                    niche: finalKeyword.charAt(0).toUpperCase() + finalKeyword.slice(1) 
                },
                { upsert: true, new: true }
            );
            finalResults.push(savedChannel);
        }

        // Step 3: Clean Response bhejye
        res.json({
            success: true,
            meta: {
                total_fetched_from_api: ytChannels.length,
                saved_or_updated_in_db: finalResults.length,
                platform: "YouTube"
            },
            data: finalResults
        });

    } catch (error) {
        console.error("❌ YT Controller Error:", error.message);
        res.status(500).json({ 
            success: false, 
            msg: "Server mein masla aa gaya hai.", 
            error: error.message 
        });
    }
};