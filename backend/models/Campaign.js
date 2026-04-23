const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    businessId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    title: { 
        type: String, 
        required: [true, 'Title is required'],
        trim: true 
    },
    description: { 
        type: String, 
        required: [true, 'Description is required'] 
    },
    platform: { 
        type: String, 
        enum: ['All', 'TikTok', 'YouTube'], 
        default: 'All' 
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Active', 'Completed'], 
        default: 'Pending' 
    },
    budget: { 
        type: Number, 
        required: [true, 'Budget is required'] 
    },
    deadline: { 
        type: Date, 
        required: [true, 'Deadline is required'] 
    },
    niche: { 
        type: String, 
        required: [true, 'Niche is required'] 
    },
    tags: [String],

    // YE WOH AI DATA HAI JO SIRF IS CAMPAIGN KE LIYE SELECTED HAIN
    // Global Influencer database alag rahega, ye yahan link hoga.
    selectedInfluencers: [{
        influencerId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Influencer' 
        },
        ai_score: Number,
        ai_summary: String,
        match_reasoning: String,
        recommended_at: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);