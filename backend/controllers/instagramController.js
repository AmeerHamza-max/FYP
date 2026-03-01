const Influencer = require('../models/Influencer');
const { scrapeInstagramData, searchInstagramInfluencers } = require('../scrapers/instagramScraper');

// 🔄 Sync/Update Profile
exports.syncInstagramData = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ success: false, msg: "Username required" });

        const cleanUsername = username.toLowerCase().trim().replace('@', '');

        // 1. Check if exists in DB
        const existing = await Influencer.findOne({ profile_username: cleanUsername, platform: 'Instagram' });
        if (existing) {
            const hoursSinceUpdate = (new Date() - new Date(existing.last_updated)) / (1000 * 60 * 60);
            if (hoursSinceUpdate < 24) {
                return res.json({ success: true, source: "cache", data: existing });
            }
        }

        // 2. Scrape Fresh Data
        const scrapedData = await scrapeInstagramData(cleanUsername);
        if (!scrapedData) return res.status(404).json({ success: false, msg: "Influencer not found" });

        // 3. Update DB
        const influencer = await Influencer.findOneAndUpdate(
            { profile_username: cleanUsername, platform: 'Instagram' },
            scrapedData,
            { new: true, upsert: true }
        );

        res.json({ success: true, source: "api_refresh", data: influencer });

    } catch (error) {
        console.error("❌ Sync Error:", error.message);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
};

// 🔍 Search Influencers by Niche
exports.searchInstaByNiche = async (req, res) => {
    try {
        const { niche } = req.body;
        if (!niche) return res.status(400).json({ success: false, msg: "Niche required" });
        
        console.log(`🎯 [Instagram Search] Niche: ${niche}`);

        // 1. Apify se search karein
        const newInfluencers = await searchInstagramInfluencers(niche);
        
        // 2. Fallback: Agar API se data na mile
        if (newInfluencers.length === 0) {
            console.log("⚠️ API fail, DB fallback use kar raha hoon.");
            const fallback = await Influencer.find({ 
                platform: "Instagram",
                niche: new RegExp(niche, 'i')
            }).limit(15);
            return res.json({ success: true, source: "database_fallback", data: fallback });
        }
        
        // 3. Naye profiles DB mein save karein
        const finalInfluencers = [];
        for (const profile of newInfluencers) {
            const saved = await Influencer.findOneAndUpdate(
                { profile_username: profile.profile_username, platform: 'Instagram' },
                profile,
                { upsert: true, new: true }
            );
            finalInfluencers.push(saved);
        }

        res.json({
            success: true,
            meta: { total_displayed: finalInfluencers.length, source: "api_search" },
            data: finalInfluencers
        });
    } catch (error) {
        console.error("❌ Search Error:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};