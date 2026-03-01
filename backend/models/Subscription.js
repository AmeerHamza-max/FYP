const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    planName: {
        type: String,
        required: true,
        enum: ['Starter', 'Pro', 'Enterprise']
    },
    billingCycle: {
        type: String,
        required: true,
        enum: ['monthly', 'annual']
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        enum: ['active', 'cancelled', 'expired']
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Subscription', SubscriptionSchema);