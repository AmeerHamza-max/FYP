const mongoose = require('mongoose');

const InfluencerSchema = new mongoose.Schema({
    // --- Identity & Security ---
    platform: { 
        type: String, 
        required: [true, "Platform is required"], 
        enum: ['TikTok', 'YouTube'],
        index: true 
    },
    profile_username: { 
        type: String, 
        trim: true,
        lowercase: true,
        required: [true, "Username is required"]
    },
    profile_url: { 
        type: String, 
        required: [true, "Profile URL is required"],
        match: [/^(https?:\/\/)?(www\.)?(youtube\.com|tiktok\.com)\/.+$/, "Please provide a valid URL"]
    },
    nickname:  { type: String, trim: true },
    avatar:    { type: String, default: "" },
    
    // --- Stats ---
    follower_count:     { type: Number, default: 0, min: 0 }, 
    total_video_likes:  { type: Number, default: 0, min: 0 }, 
    total_videos:       { type: Number, default: 0, min: 0 }, 
    
    // --- Deep Analytics ---
    engagement_rate: { type: String, default: "0.00%" },
    niche:           { type: String, default: "General", index: true },
    
    // 🤖 AI GENERATED FIELDS
    ai_score:   { type: Number, default: 0, min: 0, max: 100 },
    sentiment:  { 
        type: String, 
        enum: ['Positive', 'Neutral', 'Negative', 'Pending', 'High Engagement', 'Very Positive'], 
        default: 'Pending' 
    },
    brand_fit:  { type: String, default: "General" },
    ai_summary: { type: String, default: "" },

    // --- Content & Metadata ---
    recent_posts: { type: Array, default: [] }, 
    last_updated: { type: Date, default: Date.now },

    // 👤 OWNER — kis user ne yeh influencer search/create kiya
    createdBy: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'User',
        required: false, // purane data ke liye false rakha
        index:    true   // fast query ke liye
    }

}, { 
    timestamps: true,
    versionKey: false
});

// 🔥 Performance: Compound Indexes
InfluencerSchema.index({ platform: 1, niche: 1 });
InfluencerSchema.index({ createdBy: 1, platform: 1 });   // user + platform fast filter
InfluencerSchema.index({ createdBy: 1, ai_score: -1 });  // user + AI tab fast sort
InfluencerSchema.index({ niche: 'text', nickname: 'text', profile_username: 'text' });

module.exports = mongoose.model('Influencer', InfluencerSchema);