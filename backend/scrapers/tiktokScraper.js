require("dotenv").config();
const axios = require("axios");

/**
 * Load API Keys from .env
 */
const apiKeys = process.env.TIKTOK_API_KEYS
  ? process.env.TIKTOK_API_KEYS.split(",")
  : [];

const apiHost = process.env.TIKTOK_API_HOST;

/**
 * Smart Key Rotation System
 */
const performRequest = async (endpoint, params) => {
  if (apiKeys.length === 0) throw new Error("❌ No API Keys found in .env");

  for (let i = 0; i < apiKeys.length; i++) {
    try {
      const response = await axios.get(`https://${apiHost}${endpoint}`, {
        params,
        headers: {
          "x-rapidapi-key": apiKeys[i].trim(),
          "x-rapidapi-host": apiHost,
        },
        timeout: 15000, // Timeout thora barha diya hai behtar stability ke liye
      });

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      if (status === 429 || status === 403) {
        console.warn(`⚠️ Key ${i + 1} exhausted. Switching to next key...`);
        continue;
      }
      if (i === apiKeys.length - 1) throw new Error("❌ All API keys failed.");
    }
  }
};

/**
 * Search TikTok Influencers (Pakistan Focused & English Usernames Only)
 */
const searchInfluencersByKeyword = async (keyword) => {
  try {
    // 🔥 FORCE PAKISTAN: Tapping into local results
    const targetedKeyword = keyword.toLowerCase().includes("pakistan") 
      ? keyword 
      : `${keyword} Pakistan`;

    console.log(`📡 Searching TikTok Pakistan Niche: ${targetedKeyword}`);

    const data = await performRequest("/user/search", {
      keywords: targetedKeyword,
      count: "40", // Zayda data mangwaya taake filtering ke baad achi list bache
    });

    const rawList = data?.data?.user_list || [];
    const uniqueIds = new Set();

    // 🔥 REGEX: Sirf English letters (a-z), numbers (0-9), dots aur underscores allow hain.
    // Isse Chinese/Arabic aur ajeeb symbols wale accounts nikal jayenge.
    const englishOnlyRegex = /^[a-zA-Z0-9._]+$/;

    rawList.forEach((item) => {
      const user = item.user;
      const id = user?.uniqueId || user?.unique_id;
      const nickname = (user?.nickname || "").toLowerCase();
      const signature = (user?.signature || "").toLowerCase();

      // 1. Check if username is English-only
      if (id && englishOnlyRegex.test(id)) {
        
        // 2. Strict Pakistan Validation: Bio, Nickname ya Username mein "pk" ya "pakistan" ho
        const isPakistani = 
            signature.includes("pakistan") || 
            signature.includes("pk") || 
            nickname.includes("pakistan") ||
            nickname.includes("pk") ||
            id.toLowerCase().includes("pk");

        if (isPakistani) {
            uniqueIds.add(id);
        }
      }
    });

    const finalResult = Array.from(uniqueIds);
    console.log(`✅ Filtered ${finalResult.length} pure Pakistani English profiles.`);
    
    return finalResult;

  } catch (error) {
    console.error("❌ Search Error:", error.message);
    return [];
  }
};

/**
 * Deep Profile Scraper (With Null-Safety)
 */
const scrapeTikTokDeep = async (username) => {
  try {
    if (!username) return null;
    console.log(`🚀 Deep Scraping @${username}`);

    const data = await performRequest("/user/info", {
      unique_id: username,
    });

    const userData = data?.data;
    if (!userData || !userData.user) {
        console.log(`⚠️ No data returned for @${username}`);
        return null;
    }

    const stats = userData.stats || {};
    const userDetails = userData.user || {};

    const followers = stats.followerCount || stats.follower_count || 0;
    const likes = stats.heartCount || stats.heart_count || 0;

    // Engagement Formula
    const rawEngRate = followers > 0 ? ((likes / followers) * 0.15).toFixed(2) : "0.00";

    return {
      profile_username: username.toLowerCase(),
      profile_url: `https://www.tiktok.com/@${username.toLowerCase()}`,
      nickname: userDetails.nickname || username,
      avatar: userDetails.avatarThumb || userDetails.avatar_medium || "",
      follower_count: followers,
      video_likes: likes,
      comment_count: Math.floor(likes * 0.015), 
      engagement_rate: `${rawEngRate}%`,
      audience_feedback: parseFloat(rawEngRate) > 5 ? "Highly Active" : "Stable",
      niche: "General",
      platform: "TikTok",
      last_updated: new Date(),
    };
  } catch (error) {
    console.error(`❌ Scraping Error for @${username}:`, error.message);
    return null;
  }
};

module.exports = {
  scrapeTikTokDeep,
  searchInfluencersByKeyword,
};