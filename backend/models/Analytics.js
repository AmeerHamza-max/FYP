const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    impressions: {
      type: Number,
      default: 0,
    },

    clicks: {
      type: Number,
      default: 0,
    },

    conversions: {
      type: Number,
      default: 0,
    },

    roi: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Analytics", analyticsSchema);
