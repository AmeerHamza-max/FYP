const mongoose = require('mongoose');

const InfluencerSchema = new mongoose.Schema({
    // --- Identity ---
    platform: { 
        type: String, 
        required: true, 
        enum: ['TikTok', 'Facebook', 'YouTube'], 
        default: 'TikTok'
    },
    profile_username: { 
        type: String, 
        trim: true,
    },
    profile_url: { 
        type: String, 
        unique: true, // ✅ Ye duplicate nahi hone dega
        required: true 
    },
    nickname: { type: String, trim: true },
    avatar: { type: String, default: "" },
    
    // --- Stats (Cross-Platform mapping) ---
    follower_count: { type: Number, default: 0 }, 
    
    // 💡 Changed name to reflect total engagement, not just per-video
    total_video_likes: { type: Number, default: 0 }, 
    
    comment_count: { type: Number, default: 0 },
    aweme_count: { type: Number, default: 0 }, 
    
    // --- Deep Analytics ---
    engagement_rate: { type: String, default: "0.00%" },
    niche: { type: String, default: "General" },
    audience_feedback: { type: String, default: "Stable" }, 
    
    // ➕ NEW FIELD: To store Apify's full 'media' array (Reels/Posts)
    recent_posts: { type: Array, default: [] }, 
    
    // --- Extra Info ---
    bio_url: { type: String, default: "" },
    last_updated: { type: Date, default: Date.now }
});

// Search performance behtar karne ke liye indexing
InfluencerSchema.index({ niche: 'text', nickname: 'text' });

module.exports = mongoose.model('Influencer', InfluencerSchema);