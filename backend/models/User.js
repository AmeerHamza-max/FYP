const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ['business', 'admin'],
    default: 'business'
  },

  // 🔥 SaaS MONETIZATION FIELDS
  plan: {
    type: String,
    enum: ['free', 'pro', 'enterprise'],
    default: 'free'
  },

  campaignsUsed: {
    type: Number,
    default: 0
  },

  campaignLimit: {
    type: Number,
    default: 5 // free users limit
  },

  // password reset fields
  resetPasswordToken: {
    type: String
  },

  resetPasswordExpires: {
    type: Date
  }

}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);