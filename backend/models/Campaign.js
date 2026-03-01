const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
    // User ID jo campaign create kar raha hai (Linked to User Model)
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
        enum: ['Instagram', 'TikTok', 'YouTube', 'Facebook'], 
        required: true 
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
        required: [true, 'Niche is required'] // e.g., Fashion, Tech, Food
    },
    tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Campaign', campaignSchema);