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
        timeout: 10000,
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
 * Search TikTok Influencers by Keyword (Pakistan Focused)
 */
const searchInfluencersByKeyword = async (keyword) => {
  try {
    // 🔥 FIX 1: Keyword ko force kiya Pakistan results ke liye
    const targetedKeyword = keyword.toLowerCase().includes("pakistan") 
      ? keyword 
      : `${keyword} Pakistan`;

    console.log(`📡 Searching TikTok Niche: ${targetedKeyword}`);

    const data = await performRequest("/user/search", {
      keywords: targetedKeyword,
      count: "15", // Thora zyada data mangwaya taake filter kar sakein
    });

    const rawList = data?.data?.user_list || [];

    // 🔥 FIX 2: Clean IDs and prevent duplicates
    const uniqueIds = new Set();
    rawList.forEach((item) => {
      const id = item.user?.uniqueId || item.user?.unique_id;
      if (id) uniqueIds.add(id);
    });

    return Array.from(uniqueIds);
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

    // Engagement Formula (Likes / Followers ratio weighted)
    const rawEngRate = followers > 0 ? ((likes / followers) * 0.15).toFixed(2) : "0.00";

    // ✅ Final Object consistent with DB Schema
    return {
      profile_username: username.toLowerCase(),
      profile_url: `https://www.tiktok.com/@${username.toLowerCase()}`, // Crucial for DB Index
      nickname: userDetails.nickname || username,
      avatar: userDetails.avatarThumb || userDetails.avatar_medium || userDetails.avatar_thumb || "",
      follower_count: followers,
      video_likes: likes,
      comment_count: Math.floor(likes * 0.015), // Estimated comments
      engagement_rate: `${rawEngRate}%`,
      audience_feedback: parseFloat(rawEngRate) > 5 ? "Highly Active" : "Stable",
      niche: "General", // Controller will update this
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