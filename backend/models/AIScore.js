const mongoose = require("mongoose");

const aiScoreSchema = new mongoose.Schema(
  {
    campaign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    influencer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    breakdown: {
      followersWeight: Number,
      engagementWeight: Number,
      nicheMatchWeight: Number,
      budgetFitWeight: Number,
    },

    generatedBy: {
      type: String,
      default: "AI Engine v1",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AIScore", aiScoreSchema);
