const axios = require('axios');
require('dotenv').config();

// 🔐 API Keys rotation ke liye (taake limit khatam na ho)
const apiCredentials = [
    { token: process.env.INSTA_TOKEN_1 },
    { token: process.env.INSTA_TOKEN_2 }
];

// 🔥 Default Actor ID - Agar .env mein na ho
const ACTOR_ID = process.env.INSTA_ACTOR_ID || 'apify~instagram-scraper';

// 🔍 SEARCH: Naye Influencers dhoondne ke liye
const searchInstagramInfluencers = async (keyword, index = 0) => {
    if (index >= apiCredentials.length) {
        console.error("❌ Sari Instagram API keys fail ho gayin.");
        return [];
    }

    const { token } = apiCredentials[index];
    if (!token) return searchInstagramInfluencers(keyword, index + 1);

    console.log(`🚀 [Instagram Search] Key #${index + 1}: ${keyword} Pakistan...`);

    try {
        // 🔥 run-sync endpoint: Ye naya run shuru karta hai aur wait karta hai
        const response = await axios({
            method: 'post',
            url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync?token=${token}`,
            data: {
                // 🔥 FIX: Array ki jagah String bhej rahe hain
                "search": `${keyword} Pakistan`,
                "searchType": "user",
                "resultsLimit": 15 // Limit: Zyada na rakhein taake timeout na ho
            }
        });

        if (response.data.status === 'SUCCEEDED') {
            const datasetId = response.data.defaultDatasetId;
            console.log(`✅ Run kamyab! Dataset ID: ${datasetId}`);

            // 📡 Dataset se data uthayein
            const datasetResponse = await axios.get(
                `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`
            );

            const items = datasetResponse.data;
            if (!items || items.length === 0) return [];

            // ♻️ Data ko format karein
            return items.map(profile => ({
                platform: "Instagram",
                profile_username: profile.username,
                nickname: profile.fullName || profile.username,
                profile_url: `https://www.instagram.com/${profile.username}/`,
                avatar: profile.profilePicUrlHD || "",
                bio: profile.biography || "",
                follower_count: profile.followersCount || 0,
                following_count: profile.followsCount || 0,
                total_posts: profile.postsCount || 0,
                engagement_rate: profile.engagementRate 
                    ? (profile.engagementRate * 100).toFixed(2) + "%" 
                    : "0%",
                niche: keyword.charAt(0).toUpperCase() + keyword.slice(1),
                last_updated: new Date()
            }));
        } else {
            throw new Error("Actor run failed");
        }

    } catch (error) {
        // 🔥 Robust Error Handling
        console.error(`❌ Key #${index + 1} fail:`, error.response ? error.response.data : error.message);
        return searchInstagramInfluencers(keyword, index + 1); // 🔄 Retry with next key
    }
};

// 📡 SCRAPE: Single user ki details ke liye
const scrapeInstagramData = async (username) => {
    const token = process.env.INSTA_TOKEN_1; 
    console.log(`📡 [Instagram Scrape] Fetching: ${username}`);
    
    try {
        const response = await axios({
            method: 'post',
            url: `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync?token=${token}`,
            data: {
                "usernames": [username]
            }
        });

        if (response.data.status === 'SUCCEEDED') {
            const datasetId = response.data.defaultDatasetId;
            const datasetResponse = await axios.get(
                `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}`
            );
            
            const item = datasetResponse.data[0];
            if (!item) return null;

            return {
                platform: "Instagram",
                profile_username: item.username,
                nickname: item.fullName || item.username,
                profile_url: `https://www.instagram.com/${item.username}/`,
                avatar: item.profilePicUrlHD,
                bio: item.biography,
                follower_count: item.followersCount,
                following_count: item.followsCount,
                total_posts: item.postsCount,
                engagement_rate: item.engagementRate ? (item.engagementRate * 100).toFixed(2) + "%" : "0%",
                last_updated: new Date()
            };
        }
        return null;
    } catch (error) {
        console.error("Scrape Error:", error.message);
        return null;
    }
};

module.exports = { searchInstagramInfluencers, scrapeInstagramData };