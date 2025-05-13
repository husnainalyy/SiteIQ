import mongoose from "mongoose";

const SeoRecommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    websiteUrl: {
      type: String,
      required: true,
      match: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}\/?.*$/,
    },
    seoReport: {
      type: Object,
      default: {},
    },
    recommendations: {
      type: [Object], // Array of key-value structured recommendations
      default: [],
    },
    htmlSnapshot: {
      type: String,
    },
    cssSnapshot: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SeoRecommendation", SeoRecommendationSchema);
