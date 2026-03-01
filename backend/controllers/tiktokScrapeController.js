const Influencer = require('../models/Influencer');
const { scrapeTikTokDeep, searchInfluencersByKeyword } = require('../scrapers/tiktokScraper');

/**
 * FEATURE 1: Smart Sync
 * Data refresh logic with 24-hour rule
 */
exports.syncTikTokData = async (req, res) => {
    try {
        const { username } = req.body;
        if (!username) return res.status(400).json({ success: false, msg: "Username is required" });

        const cleanUsername = username.toLowerCase().trim().replace('@', '');

        // 1. Cache Check
        const existing = await Influencer.findOne({ profile_username: cleanUsername });
        if (existing) {
            const lastUpdated = new Date(existing.last_updated);
            const hoursSinceUpdate = (new Date() - lastUpdated) / (1000 * 60 * 60);
            
            if (hoursSinceUpdate < 24) {
                return res.json({ 
                    success: true, 
                    source: "cache", 
                    msg: "Data is fresh", 
                    data: existing 
                });
            }
        }

        // 2. Fetch Fresh Data
        const freshData = await scrapeTikTokDeep(cleanUsername);
        if (!freshData) return res.status(404).json({ success: false, msg: "Influencer not found on TikTok" });

        // 3. Update/Create
        const updated = await Influencer.findOneAndUpdate(
            { profile_username: cleanUsername },
            { ...freshData },
            { upsert: true, new: true, runValidators: true }
        );

        res.json({ success: true, source: "api_refresh", data: updated });

    } catch (error) {
        console.error("Sync Error:", error.message);
        res.status(500).json({ success: false, msg: "Failed to sync data" });
    }
};

/**
 * FEATURE 2: Niche Search (Upgraded to 7 Deep Scrapes)
 */
exports.searchByNiche = async (req, res) => {
    try {
        const { keyword } = req.body;
        if (!keyword) return res.status(400).json({ success: false, msg: "Keyword required" });

        const normalizedKeyword = keyword.trim().toLowerCase();
        console.log(`🎯 [TikTok Search] Niche: ${normalizedKeyword} | Limit: 7 New Profiles`);

        // Step 1: Search Usernames (1 API Credit)
        const usernames = await searchInfluencersByKeyword(normalizedKeyword);
        
        if (!usernames || usernames.length === 0) {
            const fallback = await Influencer.find({ 
                platform: "TikTok",
                $or: [
                    { niche: new RegExp(normalizedKeyword, 'i') },
                    { nickname: new RegExp(normalizedKeyword, 'i') }
                ]
            }).limit(15);
            return res.json({ success: true, source: "database_fallback", data: fallback });
        }

        const finalInfluencers = [];
        let apiRequestsCount = 0;
        const REQUEST_LIMIT = 7; // 🔥 Bhai, ab har search par 7 naye bande fetch honge!

        // Step 2: Process Usernames
        for (const user of usernames) {
            const cleanUser = user.toLowerCase();
            
            // Check Database First (Cost: 0)
            let influencer = await Influencer.findOne({ profile_username: cleanUser });

            if (influencer) {
                finalInfluencers.push(influencer);
            } 
            else if (apiRequestsCount < REQUEST_LIMIT) {
                // New User -> Deep Scrape (Cost: 1 API Credit)
                const freshData = await scrapeTikTokDeep(cleanUser);
                
                if (freshData) {
                    freshData.niche = normalizedKeyword.charAt(0).toUpperCase() + normalizedKeyword.slice(1);
                    freshData.platform = "TikTok";
                    
                    const saved = await Influencer.findOneAndUpdate(
                        { profile_username: cleanUser },
                        freshData,
                        { upsert: true, new: true }
                    );
                    finalInfluencers.push(saved);
                    apiRequestsCount++;
                }
            }

            // Agar DB se kafi log mil gaye hain aur API se bhi 7 ho gaye, toh break
            if (finalInfluencers.length >= 15) break;
        }

        // Step 3: Response
        res.json({
            success: true,
            meta: {
                total_displayed: finalInfluencers.length,
                newly_scraped: apiRequestsCount,
                quota_saved: usernames.length - apiRequestsCount,
                next_update_allowed: "24h"
            },
            data: finalInfluencers
        });

    } catch (error) {
        console.error("Search Error:", error);
        res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
};